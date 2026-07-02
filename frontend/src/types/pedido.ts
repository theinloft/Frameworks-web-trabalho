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

export type Pedido = {
  id: string;
  horarioPedido: string;
  status: string;
  cliente?: Cliente;
  itens: Item[];
};
