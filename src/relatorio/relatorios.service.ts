import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Pedido, StatusPedido } from 'src/pedido/entities/pedido.entity';
import { Perfil } from 'src/usuario/enums/perfil.enum';
import { FiltroRelatorioDto } from './dto/filtro-relatorio.dto';
import { LinhaPedido, resumirPedidos } from './exportacao/comum';
import { gerarPdf } from './exportacao/relatorio-pdf';
import { gerarXlsx } from './exportacao/relatorio-xlsx';

type UsuarioToken = { id: number; perfil: string };

export interface ArquivoExportado {
  buffer: Buffer;
  contentType: string;
  nomeArquivo: string;
}

function diaSeguinte(data: string): Date {
  const d = new Date(`${data}T00:00:00`);
  d.setDate(d.getDate() + 1);
  return d;
}

@Injectable()
export class RelatoriosService {
  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepo: Repository<Pedido>,
  ) {}

 
  private baseQuery(
    f: FiltroRelatorioDto,
    user: UsuarioToken,
  ): SelectQueryBuilder<Pedido> {
    const qb = this.pedidoRepo
      .createQueryBuilder('p')
      .where('p.status = :s', { s: StatusPedido.CONCLUIDO });

    if (user.perfil !== Perfil.ADMIN_MASTER) {
      qb.andWhere('p.usuarioId = :uid', { uid: user.id });
    }
    if (f.dataInicio) {
      qb.andWhere('p.horarioPedido >= :ini', { ini: f.dataInicio });
    }
    if (f.dataFim) {
      qb.andWhere('p.horarioPedido < :fim', { fim: diaSeguinte(f.dataFim) });
    }
    if (f.formaPagamento) {
      qb.andWhere('p.formaPagamento = :fp', { fp: f.formaPagamento });
    }
    return qb;
  }

  async resumo(f: FiltroRelatorioDto, user: UsuarioToken) {
    return this.baseQuery(f, user)
      .select('p.formaPagamento', 'formaPagamento')
      .addSelect('COUNT(*)', 'quantidade')
      .addSelect('SUM(p.valorTotal)', 'total')
      .groupBy('p.formaPagamento')
      .getRawMany();
  }

  async exportar(
    f: FiltroRelatorioDto,
    formato: 'pdf' | 'xlsx',
    user: UsuarioToken,
  ): Promise<ArquivoExportado> {
    const registros = await this.baseQuery(f, user)
      .leftJoin('p.cliente', 'c')
      .select([
        'p.id',
        'p.horarioPedido',
        'p.valorTotal',
        'p.formaPagamento',
        'c.nome',
      ])
      .orderBy('p.horarioPedido', 'ASC')
      .getMany();

    const pedidos: LinhaPedido[] = registros.map((p) => ({
      data: new Date(p.horarioPedido),
      cliente: p.cliente?.nome ?? '—',
      formaPagamento: p.formaPagamento ?? null,
      valor: Number(p.valorTotal),
    }));

    const dados = {
      dataInicio: f.dataInicio,
      dataFim: f.dataFim,
      formaPagamento: f.formaPagamento,
      geradoEm: new Date(),
      pedidos,
      resumo: resumirPedidos(pedidos),
    };

    if (formato === 'pdf') {
      return {
        buffer: await gerarPdf(dados),
        contentType: 'application/pdf',
        nomeArquivo: 'relatorio-pedidos.pdf',
      };
    }
    return {
      buffer: await gerarXlsx(dados),
      contentType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      nomeArquivo: 'relatorio-pedidos.xlsx',
    };
  }
}