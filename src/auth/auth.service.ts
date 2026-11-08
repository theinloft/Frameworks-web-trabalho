import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuario/entities/usuario.entity';
import { UsuariosService } from '../usuario/usuario.service';
import { VerificacaoEmailService } from 'src/email/verificacao-email.service';
@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
     private verificacaoEmail: VerificacaoEmailService,
  ) {}

  async login(email: string, senha: string) {
    const usuario = await this.usuariosService.buscarPorEmail(email);
    if (!usuario) throw new UnauthorizedException('Usuário não encontrado');
    if (!usuario.senha)
      throw new UnauthorizedException('Usuário sem senha cadastrada');

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) throw new UnauthorizedException('Senha incorreta');

    
     if (!usuario.emailVerificado)
    throw new ForbiddenException('Confirme seu email para entrar');


    const payload = {
      id: usuario.id,
      email: usuario.email,
      perfil: usuario.perfil,
    };
    return {
      token: this.jwtService.sign(payload),
      usuario: { id: usuario.id, nome: usuario.nome, perfil: usuario.perfil },
    };
  }

  async verificarEmail(token: string) {
  let payload: { sub: number | string; tipo: string };
  try {
    payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_EMAIL_SECRET,
    });
  } catch {
    throw new BadRequestException('Link inválido ou expirado');
  }
  if (payload.tipo !== 'verificar-email')
    throw new BadRequestException('Link inválido ou expirado');

  await this.usuariosService.marcarEmailVerificado(payload.sub);
  return { mensagem: 'Email confirmado com sucesso' };
}

async reenviarVerificacao(email: string) {
  const usuario = await this.usuariosService.buscarPorEmail(email);
  if (usuario && !usuario.emailVerificado) await this.verificacaoEmail.enviar(usuario);
  return { mensagem: 'Se o email existir e ainda não estiver confirmado, enviamos um novo link.' };
}
}
