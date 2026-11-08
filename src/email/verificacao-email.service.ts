import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Usuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class VerificacaoEmailService {
  private readonly logger = new Logger(VerificacaoEmailService.name);

  constructor(private jwtService: JwtService) {}

  async enviar(usuario: Pick<Usuario, 'id' | 'email'>) {
    if (usuario.id === undefined || !usuario.email) return;

    const token = this.jwtService.sign(
      { sub: usuario.id, tipo: 'verificar-email' },
      { secret: process.env.JWT_EMAIL_SECRET, expiresIn: '1d' },
    );
    const link = `${process.env.FRONTEND_URL}/verificar-email?token=${token}`;

    if (!process.env.RESEND_API_KEY) {
      this.logger.warn(
        `[DEV] Link de confirmação para ${usuario.email}: ${link}`,
      );
      return;
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: usuario.email,
        subject: 'Confirme seu email - Shred Labs',
        html: `<p>Clique para confirmar seu email:</p>
               <p><a href="${link}">Confirmar meu email</a></p>
               <p>O link vale por 24 horas.</p>`,
      }),
    });
    if (!res.ok) {
      this.logger.error(`Falha ao enviar email: ${await res.text()}`);
    }
  }
}