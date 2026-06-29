import { useState } from 'react';
import styles from './Painel.module.css';
import Paginacao from '../../components/Paginacao/Paginacao';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';

type Cliente = {
  id: string;
  nome: string;
  email: string;
};

type Produto = {
  id: string;
  nome: string;
  preco: number;
};

type Pedido = {
  id: string;
  HorarioPedido: string;
};

const POR_PAGINA = 5;

export default function Painel() {
  const [pagClientes, setPagClientes] = useState(1);
  const [pagProdutos, setPagProdutos] = useState(1);
  const [pagPedidos, setPagPedidos] = useState(1);

  const navigate = useNavigate();

  function paginar<T>(lista: T[], pagina: number) {
    const inicio = (pagina - 1) * POR_PAGINA;
    return lista.slice(inicio, inicio + POR_PAGINA);
  }

  const { data: clientes } = useApi<Cliente[]>(
    'http://localhost:3000/api/cliente',
  );
  const { data: produtos } = useApi<Produto[]>(
    'http://localhost:3000/api/produto',
  );
  const { data: pedidos } = useApi<Pedido[]>(
    'http://localhost:3000/api/pedido',
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <span className={styles.tag}>Painel</span>
          <h1 className={styles.titulo}>
            Pedidos,Produtos e clientes
            <span className={styles.destaque}> Dashboard</span>
          </h1>
        </div>
      </header>

      {/* KPIs */}
      <div className={styles.kpis}>
        <div
          className={styles.kpi}
          onClick={() => navigate('/pedidos')}
          style={{ cursor: 'pointer' }}
        >
          <span className={styles.kpiNum}>{pedidos?.length ?? '—'}</span>
          <span className={styles.kpiLabel}>PEDIDOS</span>
        </div>
        <div
          className={styles.kpi}
          onClick={() => navigate('/clientes')}
          style={{ cursor: 'pointer' }}
        >
          <span className={`${styles.kpiNum} ${styles.amarelo}`}>
            {clientes?.length ?? '—'}
          </span>
          <span className={styles.kpiLabel}>CLIENTES</span>
        </div>
        <div
          className={styles.kpi}
          onClick={() => navigate('/produtos')}
          style={{ cursor: 'pointer' }}
        >
          <span className={styles.kpiNum}>{produtos?.length ?? '—'}</span>
          <span className={styles.kpiLabel}>PRODUTOS</span>
        </div>
      </div>

      {/* Grid principal */}
      <div className={styles.grid}>
        {/* Pedidos */}
        <section className={styles.secao}>
          <div className={styles.secaoHead}>
            <span className={styles.secaoTitulo}>PEDIDOS RECENTES</span>
          </div>
          <div className={styles.tableHead}>
            <span>ID</span>
            <span>DATA</span>
          </div>
          {paginar(pedidos ?? [], pagPedidos).map((p) => (
            <div key={p.id} className={styles.row}>
              <span className={styles.celula}>{p.id.substring(0, 8)}...</span>
              <span className={styles.celulaSecundaria}>
                {new Date(p.HorarioPedido).toLocaleDateString('pt-BR')}
              </span>
            </div>
          ))}
          <Paginacao
            pagina={pagPedidos}
            total={pedidos?.length ?? 0}
            porPagina={POR_PAGINA}
            onChange={setPagPedidos}
          />
        </section>
        {/* Clientes */}
        <section className={styles.secao}>
          <div className={styles.secaoHead}>
            <span className={styles.secaoTitulo}>CLIENTES</span>
          </div>
          {paginar(clientes ?? [], pagClientes).map((c) => (
            <div key={c.id} className={styles.clienteCard}>
              <div className={styles.avatar}>
                {c.nome.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className={styles.clienteNome}>{c.nome}</div>
                <div className={styles.clienteMeta}>{c.email}</div>
              </div>
            </div>
          ))}
          <Paginacao
            pagina={pagClientes}
            total={clientes?.length ?? 0}
            porPagina={POR_PAGINA}
            onChange={setPagClientes}
          />
        </section>

        {/* Produtos */}
        <section className={styles.secao}>
          <div className={styles.secaoHead}>
            <span className={styles.secaoTitulo}>PRODUTOS</span>
          </div>
          <div className={styles.tableHead}>
            <span>NOME</span>
            <span>PREÇO</span>
          </div>
          {paginar(produtos ?? [], pagProdutos).map((p) => (
            <div key={p.id} className={styles.row}>
              <span className={styles.celula}>{p.nome}</span>
              <span className={styles.celulaSecundaria}>
                R$ {Number(p.preco).toFixed(2)}
              </span>
            </div>
          ))}
          <Paginacao
            pagina={pagProdutos}
            total={produtos?.length ?? 0}
            porPagina={POR_PAGINA}
            onChange={setPagProdutos}
          />
        </section>
      </div>
    </div>
  );
}
