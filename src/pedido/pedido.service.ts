import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { ConcluirPedidoDto } from './dto/concluir-pedido.dto';
import { AgendamentoDto } from './dto/agendamento.dto';

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
    const agendamento = this.normalizarAgendamento(_createPedidoDto);
    if (agendamento.temFaixaHorario) {
      await this.validarFaixa(
        usuarioLogado.id,
        agendamento.inicioAtendimento!,
        agendamento.fimAtendimento!,
      );
    }
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
      ...agendamento,
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
        throw new NotFoundException('Pedido não encontrado');
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

    if (dto.agendado !== undefined) {
      const agendamento = this.normalizarAgendamento(dto);
      if (agendamento.temFaixaHorario) {
        // ignora o próprio pedido: ele pode alterar a faixa que já ocupa
        await this.validarFaixa(
          pedido.usuarioId,
          agendamento.inicioAtendimento!,
          agendamento.fimAtendimento!,
          pedido.id,
        );
      }
      Object.assign(pedido, agendamento);
    }

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
    if (
      status !== StatusPedido.CANCELADO &&
      pedido.status === StatusPedido.CANCELADO &&
      pedido.temFaixaHorario &&
      pedido.inicioAtendimento &&
      pedido.fimAtendimento
    ) {
      // reativar um pedido cancelado volta a ocupar a faixa: confere de novo
      await this.validarFaixa(
        pedido.usuarioId,
        pedido.inicioAtendimento,
        pedido.fimAtendimento,
        pedido.id,
      );
    }
    pedido.status = status;
    return this.pedidoRepo.save(pedido);
  }

  async concluirPedido(
  id: string,
  dto: ConcluirPedidoDto,
  usuarioLogado: { id: number; perfil: Perfil },
): Promise<Pedido> {
  const pedido = await this.findOne(id, usuarioLogado);

  if (pedido.status === StatusPedido.CONCLUIDO) {
    throw new BadRequestException('Pedido já está concluído');
  }

  if (pedido.status === StatusPedido.CANCELADO) {
    throw new BadRequestException('Pedido cancelado não pode ser concluído');
  }

  pedido.formaPagamento = dto.formaPagamento;
  pedido.status = StatusPedido.CONCLUIDO;

  return this.pedidoRepo.save(pedido);
}

  private normalizarAgendamento(dto: AgendamentoDto) {
    if (!dto.agendado) {
      return {
        agendado: false,
        temFaixaHorario: false,
        inicioAtendimento: null,
        fimAtendimento: null,
      };
    }

    const inicio = new Date(dto.inicioAtendimento!);
    const temFaixa = dto.temFaixaHorario === true;
    const fim = temFaixa ? new Date(dto.fimAtendimento!) : null;

    if (temFaixa && fim!.getTime() <= inicio.getTime()) {
      throw new BadRequestException('O fim deve ser depois do início');
    }

    return {
      agendado: true,
      temFaixaHorario: temFaixa,
      inicioAtendimento: inicio,
      fimAtendimento: fim,
    };
  }

  private async validarFaixa(
    usuarioId: number,
    inicio: Date,
    fim: Date,
    ignorarPedidoId?: string,
  ) {
    const qb = this.pedidoRepo
      .createQueryBuilder('p')
      .where('p.usuarioId = :usuarioId', { usuarioId })
      .andWhere('p.temFaixaHorario = true')
      .andWhere('p.status <> :cancelado', { cancelado: StatusPedido.CANCELADO })
      .andWhere('p.inicioAtendimento < :fim', { fim })
      .andWhere('p.fimAtendimento > :inicio', { inicio });

    if (ignorarPedidoId) {
      qb.andWhere('p.id <> :ignorarPedidoId', { ignorarPedidoId });
    }

    const conflito = await qb.getOne();
    if (conflito) {
      const hora = (d: Date) =>
        d.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'America/Sao_Paulo',
        });
      throw new ConflictException(
        `Já existe um atendimento nesse horário (${hora(conflito.inicioAtendimento!)}–${hora(conflito.fimAtendimento!)})`,
      );
    }
  }

  private toResponse(pedido: Pedido): PedidoResponseDto {
    return {
      id: pedido.id,
      cliente: pedido.cliente,
      valorTotal: pedido.valorTotal,
      horarioPedido: pedido.horarioPedido,
      agendado: pedido.agendado,
      temFaixaHorario: pedido.temFaixaHorario,
      inicioAtendimento: pedido.inicioAtendimento,
      fimAtendimento: pedido.fimAtendimento,
      itens: pedido.itens.map((item) => ({
        id: item.id,
        produto: item.produto,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario,
      })),
    };
  }
}

