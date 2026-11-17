import type { Pedido } from '../../types/pedido';

export type Agendamento = {
  agendado: boolean;
  temFaixaHorario: boolean;
  /** valor de <input type="datetime-local">, ex.: 2026-11-21T14:00 */
  inicio: string;
  fim: string;
};

export const AGENDAMENTO_VAZIO: Agendamento = {
  agendado: false,
  temFaixaHorario: false,
  inicio: '',
  fim: '',
};

function paraInput(iso?: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function agendamentoDoPedido(pedido: Pedido): Agendamento {
  if (!pedido.agendado) return AGENDAMENTO_VAZIO;
  return {
    agendado: true,
    temFaixaHorario: !!pedido.temFaixaHorario,
    inicio: paraInput(pedido.inicioAtendimento),
    fim: paraInput(pedido.fimAtendimento),
  };
}

export function validarAgendamento(a: Agendamento): string | null {
  if (!a.agendado) return null;
  if (!a.inicio) return 'Informe a data e o horário do atendimento.';
  if (a.temFaixaHorario) {
    if (!a.fim) return 'Informe o fim da faixa de horário.';
    if (new Date(a.fim) <= new Date(a.inicio)) {
      return 'O fim deve ser depois do início.';
    }
  }
  return null;
}

export function agendamentoParaPayload(a: Agendamento) {
  if (!a.agendado) return { agendado: false };
  return {
    agendado: true,
    temFaixaHorario: a.temFaixaHorario,
    inicioAtendimento: new Date(a.inicio).toISOString(),
    fimAtendimento: a.temFaixaHorario
      ? new Date(a.fim).toISOString()
      : undefined,
  };
}

/** Lê a mensagem de erro do Nest (string ou lista) ou devolve o texto padrão. */
export async function mensagemDeErro(res: Response, padrao: string) {
  try {
    const corpo = await res.json();
    const msg = Array.isArray(corpo.message)
      ? corpo.message.join(' ')
      : corpo.message;
    return msg || padrao;
  } catch {
    return padrao;
  }
}
