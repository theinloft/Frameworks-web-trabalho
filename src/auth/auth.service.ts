import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuario/entities/usuario.entity';
import { UsuariosService } from '../usuario/usuario.service';
@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, senha: string) {
    const usuario = await this.usuariosService.buscarPorEmail(email);
    if (!usuario) throw new UnauthorizedException('Usuário não encontrado');
    if (!usuario.senha)
      throw new UnauthorizedException('Usuário sem senha cadastrada');

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) throw new UnauthorizedException('Senha incorreta');

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
}
