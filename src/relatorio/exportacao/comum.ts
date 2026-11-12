export interface LinhaResumo {
  formaPagamento: string | null;
  quantidade: number;
  total: number;
}

export interface LinhaPedido {
  data: Date;
  cliente: string;
  formaPagamento: string | null;
  valor: number;
}

export interface DadosRelatorio {
  dataInicio?: string;
  dataFim?: string;
  formaPagamento?: string;
  geradoEm: Date;
  resumo: LinhaResumo[];
  pedidos: LinhaPedido[];
}

export const NAO_INFORMADO = 'Não informado';

const ROTULOS: Record<string, string> = {
  dinheiro: 'Dinheiro',
  cartao: 'Cartão',
  credito: 'Cartão de crédito',
  debito: 'Cartão de débito',
  pix: 'Pix',
};

const FUSO = 'America/Sao_Paulo';

export function rotuloPagamento(forma?: string | null): string {
  return forma ? (ROTULOS[forma] ?? forma) : NAO_INFORMADO;
}

export function formatarMoeda(valor: number): string {
  return valor
    .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    .replace(/\u00a0/g, ' ');
}

export function formatarDataHora(data: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: FUSO,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })
    .format(data)
    .replace(',', '');
}

export function formatarDataIso(iso?: string): string {
  if (!iso) return '';
  const [ano, mes, dia] = iso.slice(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
}

export function textoPeriodo(d: DadosRelatorio): string {
  const ini = formatarDataIso(d.dataInicio);
  const fim = formatarDataIso(d.dataFim);
  if (ini && fim) return `${ini} a ${fim}`;
  if (ini) return `A partir de ${ini}`;
  if (fim) return `Até ${fim}`;
  return 'Todo o período';
}

export function resumirPedidos(pedidos: LinhaPedido[]): LinhaResumo[] {
  const mapa = new Map<string, LinhaResumo>();
  for (const p of pedidos) {
    const chave = p.formaPagamento ?? '';
    const atual = mapa.get(chave) ?? {
      formaPagamento: p.formaPagamento,
      quantidade: 0,
      total: 0,
    };
    atual.quantidade += 1;
    atual.total += p.valor;
    mapa.set(chave, atual);
  }
  return [...mapa.values()].sort((a, b) => b.total - a.total);
}