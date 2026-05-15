import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepo: Repository<Cliente>,
  ) {}

  create(_createClienteDto: CreateClienteDto) {
    const cliente = this.clienteRepo.create({
      nome: _createClienteDto.nome,
      email: _createClienteDto.email,
    });
    return this.clienteRepo.save(cliente);
  }

  findAll() {
    return this.clienteRepo.find();
  }

  findOne(id: string) {
    return this.clienteRepo.findOneByOrFail({ id });
  }

  async update(id: string, dto: UpdateClienteDto) {
    const cliente = await this.clienteRepo.findOne({
      where: { id },
    });

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    cliente.nome = dto.nome ?? cliente.nome;
    cliente.email = dto.email ?? cliente.email;

    return this.clienteRepo.save(cliente);
  }

  async remove(id: string) {
    const cliente = await this.clienteRepo.findOne({
      where: { id },
    });

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    try {
      await this.clienteRepo.remove(cliente);

      return {
        mensagem: 'Cliente removido com sucesso',
      };
    } catch {
      throw new BadRequestException(
        'Não é possível remover cliente com pedidos vinculados',
      );
    }
  }
}
