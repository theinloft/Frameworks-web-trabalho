import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { Repository } from 'typeorm';
import { Pedido } from './entities/pedido.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Produto } from 'src/produto/entities/produto.entity';
import { PedidoItem } from './entities/pedidoItem.entity';
import { PedidoValidator } from './validators/pedido.validator';
import { Cliente } from 'src/cliente/entities/cliente.entity';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepo: Repository<Pedido>,
    @InjectRepository(Produto)
    private readonly produtoRepo: Repository<Produto>,
    @InjectRepository(Cliente)
    private readonly clienteRepo: Repository<Cliente>,
    private readonly pedidoValidator: PedidoValidator,
  ) {}

  async create(_createPedidoDto: CreatePedidoDto) {
    await this.pedidoValidator.validatePedido(_createPedidoDto);
    const itensPedido: PedidoItem[] = [];

    for (const itemDto of _createPedidoDto.itens) {
      const produto = await this.produtoRepo.findOne({
        where: { id: itemDto.produtoId },
      });

      if (!produto) {
        throw new NotFoundException(
          `Produto ${itemDto.produtoId}
         não encontrado`,
        );
      }

      itensPedido.push({
        produto,
        quantidade: itemDto.quantidade,
        precoUnitario: produto.preco,
      } as PedidoItem);
    }

    const valorTotal = itensPedido.reduce(
      (total, item) => total + item.precoUnitario * item.quantidade,
      0,
    );

    const pedido = this.pedidoRepo.create({
      cliente: {
        id: _createPedidoDto.clienteId,
      },

      valorTotal,

      itens: itensPedido,
    });

    return this.pedidoRepo.save(pedido);
  }

  findAll() {
    return this.pedidoRepo.find({
      relations: ['cliente', 'itens', 'itens.produto'],
    });
  }

  findOne(id: string) {
    return this.pedidoRepo.findOne({
      where: { id },
      relations: ['cliente', 'itens', 'itens.produto'],
    });
  }

  async update(id: string, dto: UpdatePedidoDto): Promise<Pedido> {
    await this.pedidoValidator.validatePedido(dto);

    const pedido = await this.pedidoRepo.findOne({
      where: { id },
      relations: ['itens', 'itens.produto'],
    });

    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado');
    }

    const cliente = await this.clienteRepo.findOneBy({
      id: dto.clienteId,
    });

    pedido.cliente = cliente!;

    for (const itemDto of dto.itens) {
      const produto = await this.produtoRepo.findOneBy({
        id: itemDto.produtoId,
      });

      const itemExistente = pedido.itens.find(
        (item) => item.produto.id === itemDto.produtoId,
      );

      if (itemExistente) {
        itemExistente.quantidade += itemDto.quantidade;
        itemExistente.precoUnitario = produto!.preco!;
      } else {
        const novoItem = new PedidoItem();

        novoItem.produto = produto!;
        novoItem.quantidade = itemDto.quantidade;
        novoItem.precoUnitario = produto!.preco!;

        pedido.itens.push(novoItem);
      }
    }

    pedido.valorTotal = pedido.itens.reduce(
      (total, item) => total + item.precoUnitario * item.quantidade,
      0,
    );

    return await this.pedidoRepo.save(pedido);
  }

  remove(id: string) {
    return this.pedidoRepo.delete(id);
  }
}
