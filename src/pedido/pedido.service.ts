import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { Repository } from 'typeorm';
import { Pedido, StatusPedido } from './entities/pedido.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Produto } from 'src/produto/entities/produto.entity';
import { PedidoItem } from './entities/pedidoItem.entity';
import { PedidoValidator } from './validators/pedido.validator';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { PedidoResponseDto } from './dto/pedido-response.dto';
import { Perfil } from 'src/usuario/enums/perfil.enum';
import { Usuario } from 'src/usuario/entities/usuario.entity';

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

  async create(_createPedidoDto: CreatePedidoDto,usuarioLogado: { id: number }) {
    
    await this.pedidoValidator.validatePedido(_createPedidoDto);
    const itensPedido: PedidoItem[] = [];

    for (const itemDto of _createPedidoDto.itens) {
      const produto = await this.produtoRepo.findOne({
        where: { id: itemDto.produtoId },
      });

      if (!produto) {
        throw new NotFoundException(
          `Produto ${itemDto.produtoId}
         nÃ£o encontrado`,
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
       usuario: { id: usuarioLogado.id } as Usuario,
    });

    return this.pedidoRepo.save(pedido);
  }

  findAll(usuarioLogado: { id: number; perfil: Perfil }) {
    if (usuarioLogado.perfil === Perfil.ADMIN_MASTER) {
      return this.pedidoRepo.find({
        relations: ['cliente', 'itens', 'itens.produto'],
      });
    }
    return this.pedidoRepo.find({
      where: { usuarioId: usuarioLogado.id },
      relations: ['cliente', 'itens', 'itens.produto'],
    });
  }

 async findOne(id: string, usuarioLogado: { id: number; perfil: Perfil }) {
    const pedido = await this.pedidoRepo.findOne({
      where: { id },
      relations: ['cliente', 'itens', 'itens.produto'],
    });

    if (!pedido) throw new NotFoundException('Pedido não encontrado');

    if (
      usuarioLogado.perfil !== Perfil.ADMIN_MASTER &&
      pedido.usuarioId !== usuarioLogado.id
    ) {
      throw new NotFoundException('Pedido não encontrado');
    }

    return pedido;
  }

  async update(
    id: string,
    dto: UpdatePedidoDto,
    usuarioLogado: { id: number; perfil: Perfil },
  ): Promise<PedidoResponseDto> {
    await this.pedidoValidator.validatePedido(dto);

    const pedido = await this.pedidoRepo.findOne({
      where: { id },
      relations: ['cliente', 'itens', 'itens.produto'],
    });

    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado');
    }

    if (
      usuarioLogado.perfil !== Perfil.ADMIN_MASTER &&
      pedido.usuarioId !== usuarioLogado.id
    ) {
      throw new NotFoundException('Pedido não encontrado');
    }

    if (dto.clienteId) {
      const cliente = await this.clienteRepo.findOneBy({
        id: dto.clienteId,
      });

      if (!cliente) {
        throw new NotFoundException('Cliente não encontrado');
      }

      pedido.cliente = cliente;
    }

    if (dto.itens) {
      const novosItens: PedidoItem[] = [];

      for (const itemDto of dto.itens) {
        const produto = await this.produtoRepo.findOneBy({
          id: itemDto.produtoId,
        });

        if (!produto) {
          throw new NotFoundException(
            `Produto ${itemDto.produtoId} não encontrado`,
          );
        }

        const itemExistente = pedido.itens.find(
          (item) => item.produto.id === itemDto.produtoId,
        );

        if (itemExistente) {
          itemExistente.quantidade = itemDto.quantidade;
          itemExistente.precoUnitario = produto.preco!;
          novosItens.push(itemExistente);
        } else {
          const novoItem = new PedidoItem();

          novoItem.produto = produto;
          novoItem.quantidade = itemDto.quantidade;
          novoItem.precoUnitario = produto.preco!;
          novoItem.pedido = pedido;

          novosItens.push(novoItem);
        }
      }

      pedido.itens = novosItens;
    }

    pedido.valorTotal = Number(
      pedido.itens
        .reduce(
          (total, item) => total + item.precoUnitario * item.quantidade,
          0,
        )
        .toFixed(2),
    );

    pedido.status = StatusPedido.ANDAMENTO;

    const pedidoSalvo = await this.pedidoRepo.save(pedido);
    return this.toResponse(pedidoSalvo);
  }


  async remove(id: string, usuarioLogado: { id: number; perfil: Perfil }) {
    const pedido = await this.pedidoRepo.findOneBy({ id });

    if (!pedido) throw new NotFoundException('Pedido não encontrado');

    if (
      usuarioLogado.perfil !== Perfil.ADMIN_MASTER &&
      pedido.usuarioId !== usuarioLogado.id
    ) {
      throw new NotFoundException('Pedido não encontrado');
    }

    return this.pedidoRepo.delete(id);
  }

  async atualizarStatus(
    id: string,
    status: StatusPedido,
    usuarioLogado: { id: number; perfil: Perfil },
  ): Promise<Pedido> {
    const pedido = await this.findOne(id, usuarioLogado);
    if (!pedido) throw new NotFoundException('Pedido não encontrado');
    pedido.status = status;
    return this.pedidoRepo.save(pedido);
  }

  private toResponse(pedido: Pedido): PedidoResponseDto {
    return {
      id: pedido.id,
      cliente: pedido.cliente,
      valorTotal: pedido.valorTotal,
      horarioPedido: pedido.horarioPedido,
      itens: pedido.itens.map((item) => ({
        id: item.id,
        produto: item.produto,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario,
      })),
    };
  }
}