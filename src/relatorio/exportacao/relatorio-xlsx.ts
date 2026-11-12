import ExcelJS from 'exceljs';
import {
  DadosRelatorio,
  formatarDataHora,
  rotuloPagamento,
  textoPeriodo,
} from './comum';

const DARK = 'FF1E1E1E';
const YELLOW = 'FFF5C800';
const LIGHT = 'FFFFF8D6';
const GRID = 'FFD9D9D9';
const ZEBRA = 'FFF7F7F7';
const FONTE = 'Arial';
const BRL = '"R$" #,##0.00';

const borda: Partial<ExcelJS.Borders> = {
  left: { style: 'thin', color: { argb: GRID } },
  right: { style: 'thin', color: { argb: GRID } },
  top: { style: 'thin', color: { argb: GRID } },
  bottom: { style: 'thin', color: { argb: GRID } },
};

function cabecalho(row: ExcelJS.Row, colunas: number) {
  for (let c = 1; c <= colunas; c++) {
    const cell = row.getCell(c);
    cell.font = { name: FONTE, bold: true, color: { argb: YELLOW } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = borda;
  }
}

function destaque(row: ExcelJS.Row, colunas: number) {
  for (let c = 1; c <= colunas; c++) {
    const cell = row.getCell(c);
    cell.font = { name: FONTE, bold: true };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LIGHT } };
    cell.border = borda;
  }
}

export async function gerarXlsx(d: DadosRelatorio): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Shred Labs';
  wb.created = d.geradoEm;

  const resumo = wb.addWorksheet('Resumo', {
    views: [{ showGridLines: false }],
  });
  const pedidos = wb.addWorksheet('Pedidos', {
    views: [{ state: 'frozen', ySplit: 4 }],
  });

  const totalGeral = d.pedidos.reduce((s, p) => s + p.valor, 0);
  const qtdGeral = d.pedidos.length;

  // Aba Pedidos (detalhe)
  pedidos.getCell('A1').value = 'Pedidos concluídos – detalhe';
  pedidos.getCell('A1').font = { name: FONTE, size: 14, bold: true };
  pedidos.getCell('A2').value = `Período: ${textoPeriodo(d)}`;
  pedidos.getCell('A2').font = {
    name: FONTE,
    size: 9,
    italic: true,
    color: { argb: 'FF666666' },
  };

  pedidos.getRow(4).values = [
    'Data',
    'Cliente',
    'Forma de pagamento',
    'Valor (R$)',
  ];
  cabecalho(pedidos.getRow(4), 4);

  d.pedidos.forEach((p, i) => {
    const row = pedidos.getRow(5 + i);
    row.values = [
      formatarDataHora(p.data),
      p.cliente,
      rotuloPagamento(p.formaPagamento),
      p.valor,
    ];
    for (let c = 1; c <= 4; c++) {
      const cell = row.getCell(c);
      cell.font = { name: FONTE, size: 10 };
      cell.border = borda;
      if (i % 2 === 1) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: ZEBRA },
        };
      }
    }
    row.getCell(4).numFmt = BRL;
    row.getCell(4).alignment = { horizontal: 'right' };
  });

  const ultima = 4 + d.pedidos.length;
  if (d.pedidos.length > 0) {
    const tot = pedidos.getRow(ultima + 1);
    tot.getCell(3).value = 'Total';
    tot.getCell(3).alignment = { horizontal: 'right' };
    tot.getCell(4).value = { formula: `SUM(D5:D${ultima})`, result: totalGeral };
    tot.getCell(4).numFmt = BRL;
    destaque(tot, 4);
    tot.getCell(3).alignment = { horizontal: 'right' };
    pedidos.autoFilter = `A4:D${ultima}`;
  } else {
    pedidos.mergeCells('A5:D5');
    pedidos.getCell('A5').value = 'Nenhum pedido concluído no período.';
    pedidos.getCell('A5').font = { name: FONTE, size: 10, italic: true };
  }
  pedidos.columns = [
    { width: 20 },
    { width: 28 },
    { width: 24 },
    { width: 16 },
  ];

  // Aba Resumo
  resumo.mergeCells('A1:D1');
  resumo.getCell('A1').value = 'SHRED LABS · Relatório de pedidos';
  resumo.getCell('A1').font = {
    name: FONTE,
    size: 15,
    bold: true,
    color: { argb: YELLOW },
  };
  resumo.getRow(1).height = 34;
  resumo.mergeCells('A2:D2');
  resumo.getCell('A2').value = 'Resumo por forma de pagamento';
  resumo.getCell('A2').font = {
    name: FONTE,
    size: 10,
    color: { argb: 'FFFFFFFF' },
  };
  resumo.getRow(2).height = 20;
  for (const linha of [1, 2]) {
    for (let c = 1; c <= 4; c++) {
      const cell = resumo.getRow(linha).getCell(c);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DARK } };
      cell.alignment = { vertical: 'middle', indent: 1 };
    }
  }

  const meta: [string, string][] = [
    ['Período', textoPeriodo(d)],
    [
      'Filtro de pagamento',
      d.formaPagamento ? rotuloPagamento(d.formaPagamento) : 'Todas',
    ],
    ['Status', 'Somente pedidos concluídos'],
    ['Gerado em', formatarDataHora(d.geradoEm)],
  ];
  meta.forEach(([chave, valor], i) => {
    const row = resumo.getRow(3 + i);
    row.getCell(1).value = chave;
    row.getCell(1).font = { name: FONTE, size: 10, bold: true };
    row.getCell(2).value = valor;
    row.getCell(2).font = { name: FONTE, size: 10 };
  });

  const cab = 8;
  resumo.getRow(cab).values = [
    'Forma de pagamento',
    'Pedidos',
    'Total (R$)',
    '% do total',
  ];
  cabecalho(resumo.getRow(cab), 4);

  let proxima = cab + 1;
  if (d.resumo.length > 0) {
    const primeira = proxima;
    const ultimaLinha = primeira + d.resumo.length - 1;
    const tot = ultimaLinha + 1;
    const faixaForma = `Pedidos!$C$5:$C$${ultima}`;
    const faixaValor = `Pedidos!$D$5:$D$${ultima}`;

    d.resumo.forEach((l, i) => {
      const r = primeira + i;
      const row = resumo.getRow(r);
      row.getCell(1).value = rotuloPagamento(l.formaPagamento);
      row.getCell(2).value = {
        formula: `COUNTIF(${faixaForma},A${r})`,
        result: l.quantidade,
      };
      row.getCell(3).value = {
        formula: `SUMIF(${faixaForma},A${r},${faixaValor})`,
        result: l.total,
      };
      row.getCell(4).value = {
        formula: `IF($C$${tot}=0,0,C${r}/$C$${tot})`,
        result: totalGeral ? l.total / totalGeral : 0,
      };
      for (let c = 1; c <= 4; c++) {
        const cell = row.getCell(c);
        cell.font = { name: FONTE, size: 10 };
        cell.border = borda;
      }
      row.getCell(2).alignment = { horizontal: 'center' };
      row.getCell(3).numFmt = BRL;
      row.getCell(4).numFmt = '0.0%';
      row.getCell(4).alignment = { horizontal: 'center' };
    });

    const rowTot = resumo.getRow(tot);
    rowTot.getCell(1).value = 'TOTAL';
    rowTot.getCell(2).value = {
      formula: `SUM(B${primeira}:B${ultimaLinha})`,
      result: qtdGeral,
    };
    rowTot.getCell(3).value = {
      formula: `SUM(C${primeira}:C${ultimaLinha})`,
      result: totalGeral,
    };
    rowTot.getCell(4).value = {
      formula: `SUM(D${primeira}:D${ultimaLinha})`,
      result: totalGeral ? 1 : 0,
    };
    destaque(rowTot, 4);
    rowTot.getCell(2).alignment = { horizontal: 'center' };
    rowTot.getCell(3).numFmt = BRL;
    rowTot.getCell(4).numFmt = '0.0%';
    rowTot.getCell(4).alignment = { horizontal: 'center' };

    const tk = resumo.getRow(tot + 2);
    tk.getCell(1).value = 'Ticket médio';
    tk.getCell(1).font = { name: FONTE, bold: true };
    tk.getCell(3).value = {
      formula: `IF(B${tot}=0,0,C${tot}/B${tot})`,
      result: qtdGeral ? totalGeral / qtdGeral : 0,
    };
    tk.getCell(3).font = { name: FONTE, bold: true };
    tk.getCell(3).numFmt = BRL;
    proxima = tot + 4;
  } else {
    resumo.mergeCells(`A${proxima}:D${proxima}`);
    resumo.getCell(`A${proxima}`).value = 'Nenhum pedido concluído no período.';
    resumo.getCell(`A${proxima}`).font = {
      name: FONTE,
      size: 10,
      italic: true,
    };
    proxima += 2;
  }

  resumo.mergeCells(`A${proxima}:D${proxima}`);
  resumo.getRow(proxima).height = 40;
  const obs = resumo.getCell(`A${proxima}`);
  obs.value =
    'Obs.: "Não informado" = pedido concluído sem forma de pagamento registrada. ' +
    'Totais calculados por fórmula a partir da aba Pedidos.';
  obs.font = { name: FONTE, size: 9, italic: true, color: { argb: 'FF666666' } };
  obs.alignment = { wrapText: true, vertical: 'top' };

  resumo.columns = [{ width: 30 }, { width: 12 }, { width: 20 }, { width: 14 }];

  const dados = await wb.xlsx.writeBuffer();
  return Buffer.from(dados);
}