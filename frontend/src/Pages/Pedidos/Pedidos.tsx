import { useState } from 'react';
import styles from './Pedidos.module.css';
import { useApi } from '../../hooks/useApi';
import Paginacao from '../../components/Paginacao/Paginacao';
import { paginar } from '../../utils/utils';
import ModalConfirmar from '../../components/ModalConfirmar/ModalConfirmar';
import ModalConcluirPedido from '../../components/ModalConcluirPedido/ModalConcluirPedido';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import ModalDetalhesPedido from '../../components/ModalDetalhesPedido/modalDetalhesPedido';
import { API_URL } from '../../config/api';
import type { Pedido } from '../../types/pedido';
import { FormaPagamento } from '../../types/pedido';

const POR_PAGINA = 5;

const statusCor: Record<string, string> = {
  andamento: '#f5c800',
  concluido: '#4caf50',
  cancelado: '#ff5050',
};

export default function Pedido() {
  const [pagPedidos, setPagProdutos] = useState(1);

  const [visualizando, setVisualizando] = useState<Pedido | null>(null);

  const { data: pedidos, setData: setPedidos } = useApi<Pedido[]>(
    `${API_URL}/api/pedido`,
  );

  const navigate = useNavigate();

  function abrirEdicao(p: Pedido) {
    navigate(`/pedidos/editar/${p.id}`);
  }

  const [confirmarCancelarPedido, setConfirmarCancelarPedido] = useState<{
    id: string;
  } | null>(null);

  const [pedidoParaConcluir, setPedidoParaConcluir] = useState<string | null>(
    null,
  );

  const [erroConcluir, setErroConcluir] = useState<string | null>(null);


  const token = localStorage.getItem('token');

  async function atualizarStatus(
    id: string,
    status: 'andamento' | 'concluido' | 'cancelado',
  ) {
    await fetch(`${API_URL}/api/pedido/atualizar-status/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    setPedidos((prev) =>
      prev ? prev.map((p) => (p.id === id ? { ...p, status } : p)) : prev,
    );
    setConfirmarCancelarPedido(null);
  }

  async function concluirPedido(id: string, formaPagamento: FormaPagamento) {
    const response = await fetch(`${API_URL}/api/pedido/${id}/concluir`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ formaPagamento }),
    });

    if (!response.ok) {
      const erro = await response.json().catch(() => null);
      setErroConcluir(
        erro?.message ??
        'Não foi possível concluir o pedido. Tente novamente.',
      );
      return;
    }

    setPedidos((prev) =>
      prev
        ? prev.map((p) =>
          p.id === id ? { ...p, status: 'concluido', formaPagamento } : p,
        )
        : prev,
    );
    setPedidoParaConcluir(null);
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.titulo}>Pedidos</h1>
        <button
          className={styles.btnNovo}
          onClick={() => navigate('/pedidos/novo')}
        >
          {' '}
          + NOVO PEDIDO
        </button>
      </div>
      <div>
        <div>
          <section className={styles.secao}>
            <div className={styles.secaoHead}></div>
            <div className={styles.tableHead}>
              <span>CLIENTE</span>
              <span>DATA/HORA</span>
              <span>NUMERO DO PEDIDO</span>
              <span>STATUS PEDIDO</span>
              <span>AÇÕES</span>
            </div>
            {paginar(pedidos ?? [], pagPedidos, POR_PAGINA).map((p) => (
              <div key={p.id} className={styles.row}>
                <span
                  className={styles.celula}
                  onClick={() => setVisualizando(p)}
                >
                  {p.cliente?.nome ?? '—'}
                </span>
                <span className={styles.celulaSecundaria}>
                  {format(new Date(p.horarioPedido), 'dd/MM/yyyy HH:mm', {
                    locale: ptBR,
                  })}
                </span>
                <span className={styles.celulaSecundaria}>{p.id}</span>
                <span
                  className={styles.celulaSecundaria}
                  style={{ color: statusCor[p.status] ?? '#fff' }}
                >
                  {p.status}
                </span>
                <span className={styles.celulaAcoes}>
                  <button
                    className={styles.btnEditar}
                    onClick={() => abrirEdicao(p)}
                  >
                    EDITAR
                  </button>
                  <button
                    className={styles.btnCancelar}
                    onClick={() =>
                      setConfirmarCancelarPedido({ id: p.id! })
                    }
                  >
                    CANCELAR PEDIDO
                  </button>
                  <button
                    className={styles.btnConcluir}
                    onClick={() => setPedidoParaConcluir(p.id!)}
                  >
                    CONCLUIR PEDIDO
                  </button>
                </span>
              </div>
            ))}
            <Paginacao
              pagina={pagPedidos}
              total={pedidos?.length ?? 0}
              porPagina={POR_PAGINA}
              onChange={setPagProdutos}
            />

            {confirmarCancelarPedido && (
              <ModalConfirmar
                mensagem="Deseja cancelar este pedido?"
                onConfirmar={() =>
                  atualizarStatus(confirmarCancelarPedido.id, 'cancelado')
                }
                onCancelar={() => setConfirmarCancelarPedido(null)}
              />
            )}

            {pedidoParaConcluir && (
              <ModalConcluirPedido
                erro={erroConcluir}
                onConfirmar={(formaPagamento) =>
                  concluirPedido(pedidoParaConcluir, formaPagamento)
                }
                onCancelar={() => {
                  setPedidoParaConcluir(null);
                  setErroConcluir(null);
                }}
              />
            )}

            {visualizando && (
              <ModalDetalhesPedido
                pedido={visualizando}
                onFechar={() => setVisualizando(null)}
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}