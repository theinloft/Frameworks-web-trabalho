import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Produto } from 'src/produto/entities/produto.entity';

import { Cliente } from 'src/cliente/entities/cliente.entity';

import { CreatePedidoDto } from '../dto/create-pedido.dto';

@Injectable()
export class PedidoValidator {
  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepo: Repository<Produto>,

    @InjectRepository(Cliente)
    private readonly clienteRepo: Repository<Cliente>,
  ) {}

  async validatePedido(dto: CreatePedidoDto) {
    if (!dto.itens || dto.itens.length === 0) {
      throw new BadRequestException('Pedido sem itens');
    }

    const cliente = await this.clienteRepo.findOneBy({
      id: dto.clienteId,
    });

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const produtosIds = dto.itens.map((item) => item.produtoId);

    const produtosDuplicados = produtosIds.filter(
      (id, index) => produtosIds.indexOf(id) !== index,
    );

    if (produtosDuplicados.length > 0) {
      throw new BadRequestException('Pedido possui produtos duplicados');
    }

    for (const item of dto.itens) {
      if (item.quantidade <= 0) {
        throw new BadRequestException('Quantidade inválida');
      }

      const produto = await this.produtoRepo.findOneBy({
        id: item.produtoId,
      });

      if (!produto) {
        throw new NotFoundException(`Produto ${item.produtoId} não encontrado`);
      }
    }
  }
}
