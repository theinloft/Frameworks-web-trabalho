import { Injectable } from '@nestjs/common';
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

  update(id: string, updateClienteDto: UpdateClienteDto) {
    return this.clienteRepo.update(id, updateClienteDto);
  }

  remove(id: string) {
    return this.clienteRepo.remove({ id });
  }
}
