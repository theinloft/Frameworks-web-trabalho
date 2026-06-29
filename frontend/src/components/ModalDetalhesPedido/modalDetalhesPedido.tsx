import styles from './ModalDetalhesPedido.module.css';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Produto = {
  id: string;
  nome: string;
  preco: number;
  imagem?: string | null;
};

type Item = {
  id: string;
  quantidade: number;
  precoUnitario: number;
  produto?: Produto;
};

type Cliente = {
  id: string;
  nome: string;
  email: string;
};

type Pedido = {
  id: string;
  horarioPedido: string;
  status: string;
  cliente?: Cliente;
  itens: Item[];
};

type Props = {
  pedido: Pedido;
  onFechar: () => void;
};

export default function ModalDetalhesPedido({ pedido, onFechar }: Props) {
  const total = pedido.itens.reduce(
    (acc, item) => acc + Number(item.precoUnitario) * item.quantidade,
    0,
  );

  const statusCor: Record<string, string> = {
    andamento: '#f5c800',
    concluido: '#4caf50',
    cancelado: '#ff5050',
  };

  return (
    <div className={styles.overlay} onClick={onFechar}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.fechar} onClick={onFechar}>
          ✕
        </button>

        <div className={styles.cabecalho}>
          <div>
            <h2 className={styles.cliente}>{pedido.cliente?.nome ?? '—'}</h2>
            <span className={styles.email}>{pedido.cliente?.email ?? '—'}</span>
          </div>
          <div className={styles.statusWrap}>
            <span
              className={styles.status}
              style={{ color: statusCor[pedido.status] ?? '#fff' }}
            >
              {pedido.status.toUpperCase()}
            </span>
            <span className={styles.data}>
              {format(new Date(pedido.horarioPedido), 'dd/MM/yyyy HH:mm', {
                locale: ptBR,
              })}
            </span>
          </div>
        </div>

        <div className={styles.itens}>
          <div className={styles.itens}>
            {pedido.itens.map((item) => (
              <div key={item.id} className={styles.item}>
                {item.produto?.imagem ? (
                  <img
                    className={styles.itemImagem}
                    src={`http://localhost:3000/my-uploads/${item.produto.imagem}`}
                    alt={item.produto.nome}
                  />
                ) : (
                  <div className={styles.itemSemImagem}>SEM FOTO</div>
                )}
                <div className={styles.itemInfo}>
                  <span className={styles.itemNome}>
                    {item.produto?.nome ?? '—'}
                  </span>
                  <span className={styles.itemQtde}>
                    {item.quantidade}x R${' '}
                    {Number(item.precoUnitario).toFixed(2)}
                  </span>
                </div>
                <span className={styles.itemPreco}>
                  R$ {(Number(item.precoUnitario) * item.quantidade).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.rodape}>
          <span className={styles.totalLabel}>TOTAL</span>
          <span className={styles.totalValor}>R$ {total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
