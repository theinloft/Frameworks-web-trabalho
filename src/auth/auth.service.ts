   import {
     BadRequestException,
     ForbiddenException,
     Injectable,
     InternalServerErrorException,
     UnauthorizedException,
   } from '@nestjs/common';
   import { OAuth2Client, type TokenPayload } from 'google-auth-library';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuario/entities/usuario.entity';
import { UsuariosService } from '../usuario/usuario.service';
import { VerificacaoEmailService } from '../email/verificacao-email.service';
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

    return this.gerarSessao(usuario);
  }
  private gerarSessao(usuario: Usuario) {
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

async loginGoogle(credential: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId)
    throw new InternalServerErrorException('Login com Google não configurado');

  let payload: TokenPayload | undefined;
  try {
    const ticket = await new OAuth2Client(clientId).verifyIdToken({
      idToken: credential,
      audience: clientId,
    });
    payload = ticket.getPayload();
  } catch {
    throw new UnauthorizedException('Token do Google inválido');
  }
  if (!payload?.email || !payload.email_verified)
    throw new UnauthorizedException('Email do Google não verificado');

  const email = payload.email.toLowerCase();
  let usuario = await this.usuariosService.buscarPorEmail(email);

  if (!usuario) {
    usuario = await this.usuariosService.criarSocial({
      nome: payload.name ?? email,
      email,
    });
  } else if (!usuario.emailVerificado && usuario.id !== undefined) {
    await this.usuariosService.ativarViaProvedor(usuario.id);
    usuario.emailVerificado = true;
    usuario.senha = null;
  }

  return this.gerarSessao(usuario);
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
