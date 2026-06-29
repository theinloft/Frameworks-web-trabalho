import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private repo: Repository<Usuario>,
  ) {}

  async criar(dto: CreateUsuarioDto) {
    const existe = await this.repo.findOneBy({ email: dto.email });
    if (existe) throw new ConflictException('E-mail já cadastrado');

    const hash = await bcrypt.hash(dto.senha, 10);
    const usuario = this.repo.create({ ...dto, senha: hash });
    return this.repo.save(usuario);
  }

  async buscarPorEmail(email: string) {
    return this.repo.findOneBy({ email });
  }

  async listar() {
    return this.repo.find({ select: ['id', 'nome', 'email', 'perfil'] });
  }

  async buscarPorId(id: number) {
    return this.repo.findOneBy({ id });
  }

  async remover(id: number) {
    const usuario = await this.repo.findOneBy({ id });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');
    return this.repo.remove(usuario);
  }
}
