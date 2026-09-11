export type Produto = {
  id: string;
  nome: string;
  preco: number;
  imagem?: string | null;
};

export type Item = {
  id: string;
  quantidade: number;
  precoUnitario: number;
  produto?: Produto;
};

export type Cliente = {
  id: string;
  nome: string;
  email: string;
};

export const FormaPagamento = {
  DINHEIRO: 'dinheiro',
  CARTAO: 'cartao',
  PIX: 'pix',
} as const;

export type FormaPagamento = (typeof FormaPagamento)[keyof typeof FormaPagamento];

export const FORMA_PAGAMENTO_LABELS: Record<FormaPagamento, string> = {
  [FormaPagamento.DINHEIRO]: 'Dinheiro',
  [FormaPagamento.CARTAO]: 'Cartão',
  [FormaPagamento.PIX]: 'Pix',
};

export type Pedido = {
  id: string;
  horarioPedido: string;
  status: string;
  cliente?: Cliente;
  itens: Item[];
};

