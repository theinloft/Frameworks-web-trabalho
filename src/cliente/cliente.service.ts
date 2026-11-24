import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { QueryFailedError, Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Perfil } from '../usuario/enums/perfil.enum';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepo: Repository<Cliente>,
  ) { }


  private tratarDuplicidade(error: unknown): never {
    if (
      error instanceof QueryFailedError &&
      (error as any).driverError?.code === '23505'
    ) {
      throw new ConflictException(
        'Você já tem um cliente com esse e-mail ou documento',
      );
    }
    throw error;
  }


  async create(dto: CreateClienteDto, usuarioLogado: { id: number }) {
    const cliente = this.clienteRepo.create({
      nome: dto.nome,
      email: dto.email,
      telefone: dto.telefone?.replace(/\D/g, ''),
      documento: dto.documento?.replace(/\D/g, ''),
      usuarioId: usuarioLogado.id,
    });

    try {
      return await this.clienteRepo.save(cliente);
    } catch (error) {
      this.tratarDuplicidade(error);
    }
  }

  findAll(usuarioLogado: { id: number; perfil: Perfil }) {
    if (usuarioLogado.perfil === Perfil.ADMIN_MASTER) {
      return this.clienteRepo.find();
    }
    return this.clienteRepo.find({
      where: { usuarioId: usuarioLogado.id },
    });
  }

  async findOne(id: string, usuarioLogado: { id: number; perfil: Perfil }) {
    const cliente = await this.clienteRepo.findOneByOrFail({ id });

    if (
      usuarioLogado.perfil !== Perfil.ADMIN_MASTER &&
      cliente.usuarioId !== usuarioLogado.id
    ) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return cliente;
  }

  async update(
    id: string,
    dto: UpdateClienteDto,
    usuarioLogado: { id: number; perfil: Perfil },
  ) {
    const cliente = await this.clienteRepo.findOne({ where: { id } });

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    if (
      usuarioLogado.perfil !== Perfil.ADMIN_MASTER &&
      cliente.usuarioId !== usuarioLogado.id
    ) {
      throw new NotFoundException('Cliente não encontrado');
    }

    cliente.nome = dto.nome ?? cliente.nome;
    cliente.email = dto.email ?? cliente.email;
    cliente.telefone = dto.telefone
      ? dto.telefone.replace(/\D/g, '')
      : cliente.telefone;
    cliente.documento = dto.documento
      ? dto.documento.replace(/\D/g, '')
      : cliente.documento;

    try {
      return await this.clienteRepo.save(cliente);
    } catch (error) {
      this.tratarDuplicidade(error);
    }
  }

  async remove(id: string, usuarioLogado: { id: number; perfil: Perfil }) {
    const cliente = await this.clienteRepo.findOne({ where: { id } });

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    if (
      usuarioLogado.perfil !== Perfil.ADMIN_MASTER &&
      cliente.usuarioId !== usuarioLogado.id
    ) {
      throw new NotFoundException('Cliente não encontrado');
    }

    try {
      await this.clienteRepo.remove(cliente);
      return { mensagem: 'Cliente removido com sucesso' };
    } catch {
      throw new BadRequestException(
        'Não foi possível remover cliente com pedidos vinculados',
      );
    }
  }
}