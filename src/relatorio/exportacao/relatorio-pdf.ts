import PDFDocument from 'pdfkit';
import {
  DadosRelatorio,
  formatarDataHora,
  formatarMoeda,
  rotuloPagamento,
  textoPeriodo,
} from './comum';

const COR = {
  dark: '#1E1E1E',
  yellow: '#F5C800',
  light: '#FFF8D6',
  grid: '#D9D9D9',
  zebra: '#F7F7F7',
  muted: '#666666',
  texto: '#222222',
};

const LARGURA = 595.28;
const ALTURA = 841.89;
const MARGEM = 51;
const UTIL = LARGURA - 2 * MARGEM;
const TOPO = 104;
const LIMITE = ALTURA - 56;
const LINHA = 22;

interface Coluna {
  titulo: string;
  largura: number;
  alinhar: 'left' | 'right';
}

type Doc = InstanceType<typeof PDFDocument>;

function texto(
  doc: Doc,
  valor: string,
  x: number,
  y: number,
  largura: number,
  alinhar: 'left' | 'right' = 'left',
) {
  doc.text(valor, x, y, {
    width: largura,
    align: alinhar,
    height: 11,
    ellipsis: true,
  });
}

function faixaTopo(doc: Doc) {
  doc.save();
  doc.rect(0, 0, LARGURA, 80).fill(COR.dark);
  doc.rect(0, 80, LARGURA, 3.5).fill(COR.yellow);
  doc.font('Helvetica-Bold').fontSize(18).fillColor(COR.yellow);
  texto(doc, 'SHRED LABS', MARGEM, 26, UTIL);
  doc.font('Helvetica').fontSize(11).fillColor('#FFFFFF');
  texto(doc, 'Relatório de pedidos por forma de pagamento', MARGEM, 50, UTIL);
  doc.restore();
}

function cabecalhoTabela(doc: Doc, y: number, colunas: Coluna[]) {
  doc.rect(MARGEM, y, UTIL, LINHA).fill(COR.dark);
  doc.font('Helvetica-Bold').fontSize(9).fillColor(COR.yellow);
  let x = MARGEM;
  for (const c of colunas) {
    texto(doc, c.titulo, x + 8, y + 7, c.largura - 16, c.alinhar);
    x += c.largura;
  }
}

function tabela(
  doc: Doc,
  yInicial: number,
  colunas: Coluna[],
  linhas: string[][],
  ultimaEmDestaque: boolean,
): number {
  let y = yInicial;
  cabecalhoTabela(doc, y, colunas);
  y += LINHA;

  linhas.forEach((linha, i) => {
    if (y + LINHA > LIMITE) {
      doc.addPage();
      y = TOPO;
      cabecalhoTabela(doc, y, colunas);
      y += LINHA;
    }
    const destaque = ultimaEmDestaque && i === linhas.length - 1;
    doc
      .rect(MARGEM, y, UTIL, LINHA)
      .fill(destaque ? COR.light : i % 2 === 1 ? COR.zebra : '#FFFFFF');
    doc
      .rect(MARGEM, y, UTIL, LINHA)
      .lineWidth(0.4)
      .strokeColor(COR.grid)
      .stroke();
    doc
      .font(destaque ? 'Helvetica-Bold' : 'Helvetica')
      .fontSize(9)
      .fillColor(COR.texto);
    let x = MARGEM;
    linha.forEach((valor, c) => {
      texto(doc, valor, x + 8, y + 7, colunas[c].largura - 16, colunas[c].alinhar);
      x += colunas[c].largura;
    });
    y += LINHA;
  });
  return y;
}

export function gerarPdf(d: DadosRelatorio): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 0,
      bufferPages: true,
      info: {
        Title: 'Relatório de pedidos por forma de pagamento',
        Author: 'Shred Labs',
      },
    });
    const partes: Buffer[] = [];
    doc.on('data', (c: Buffer) => partes.push(c));
    doc.on('end', () => resolve(Buffer.concat(partes)));
    doc.on('error', reject);

    faixaTopo(doc);
    doc.on('pageAdded', () => faixaTopo(doc));

    const total = d.pedidos.reduce((s, p) => s + p.valor, 0);
    const qtd = d.pedidos.length;
    let y = TOPO;

    // filtros usados
    doc.font('Helvetica').fontSize(9).fillColor('#444444');
    const forma = d.formaPagamento ? rotuloPagamento(d.formaPagamento) : 'Todas';
    texto(
      doc,
      `Período: ${textoPeriodo(d)}   ·   Pagamento: ${forma}   ·   Status: Concluídos`,
      MARGEM,
      y,
      UTIL,
    );
    y += 22;

    // cartões
    const gap = 14;
    const larguraCard = (UTIL - 2 * gap) / 3;
    const cards: [string, string][] = [
      ['PEDIDOS', String(qtd)],
      ['VALOR TOTAL', formatarMoeda(total)],
      ['TICKET MÉDIO', formatarMoeda(qtd ? total / qtd : 0)],
    ];
    cards.forEach(([rotulo, valor], i) => {
      const x = MARGEM + i * (larguraCard + gap);
      doc.rect(x, y, larguraCard, 52).fill(COR.light);
      doc.rect(x, y, larguraCard, 3).fill(COR.yellow);
      doc.font('Helvetica').fontSize(7.5).fillColor(COR.muted);
      texto(doc, rotulo, x + 10, y + 14, larguraCard - 20);
      doc.font('Helvetica-Bold').fontSize(14).fillColor(COR.dark);
      texto(doc, valor, x + 10, y + 28, larguraCard - 20);
    });
    y += 52 + 26;

    if (qtd === 0) {
      doc.font('Helvetica-Oblique').fontSize(10).fillColor(COR.muted);
      texto(doc, 'Nenhum pedido concluído no período.', MARGEM, y, UTIL);
    } else {
      // resumo
      doc.font('Helvetica-Bold').fontSize(11).fillColor(COR.dark);
      texto(doc, 'Resumo por forma de pagamento', MARGEM, y, UTIL);
      y += 20;
      const linhasResumo = d.resumo.map((l) => [
        rotuloPagamento(l.formaPagamento),
        String(l.quantidade),
        formatarMoeda(l.total),
        `${(total ? (l.total / total) * 100 : 0).toFixed(1).replace('.', ',')}%`,
      ]);
      linhasResumo.push([
        'TOTAL',
        String(qtd),
        formatarMoeda(total),
        '100,0%',
      ]);
      y = tabela(
        doc,
        y,
        [
          { titulo: 'Forma de pagamento', largura: UTIL * 0.4, alinhar: 'left' },
          { titulo: 'Pedidos', largura: UTIL * 0.16, alinhar: 'right' },
          { titulo: 'Total', largura: UTIL * 0.26, alinhar: 'right' },
          { titulo: '% do total', largura: UTIL * 0.18, alinhar: 'right' },
        ],
        linhasResumo,
        true,
      );
      y += 28;

      // detalhe
      if (y + 80 > LIMITE) {
        doc.addPage();
        y = TOPO;
      }
      doc.font('Helvetica-Bold').fontSize(11).fillColor(COR.dark);
      texto(doc, 'Pedidos do período', MARGEM, y, UTIL);
      y += 20;
      const linhasPedidos = d.pedidos.map((p) => [
        formatarDataHora(p.data),
        p.cliente,
        rotuloPagamento(p.formaPagamento),
        formatarMoeda(p.valor),
      ]);
      linhasPedidos.push(['', '', 'Total', formatarMoeda(total)]);
      y = tabela(
        doc,
        y,
        [
          { titulo: 'Data', largura: UTIL * 0.22, alinhar: 'left' },
          { titulo: 'Cliente', largura: UTIL * 0.3, alinhar: 'left' },
          { titulo: 'Forma de pagamento', largura: UTIL * 0.26, alinhar: 'left' },
          { titulo: 'Valor', largura: UTIL * 0.22, alinhar: 'right' },
        ],
        linhasPedidos,
        true,
      );
      y += 14;
      if (y + 20 > LIMITE) {
        doc.addPage();
        y = TOPO;
      }
      doc.font('Helvetica-Oblique').fontSize(8).fillColor(COR.muted);
      texto(
        doc,
        '"Não informado" = pedido concluído sem forma de pagamento registrada.',
        MARGEM,
        y,
        UTIL,
      );
    }

    // rodapé contendo paginação
    const { start, count } = doc.bufferedPageRange();
    for (let i = start; i < start + count; i++) {
      doc.switchToPage(i);
      doc.font('Helvetica').fontSize(8).fillColor('#777777');
      texto(doc, `Gerado em ${formatarDataHora(d.geradoEm)}`, MARGEM, ALTURA - 34, UTIL);
      texto(doc, `Página ${i + 1} de ${count}`, MARGEM, ALTURA - 34, UTIL, 'right');
    }

    doc.end();
  });
}