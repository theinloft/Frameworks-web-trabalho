import { useState } from 'react';
import styles from './Categoria.module.css';
import Paginacao from '../../components/Paginacao/Paginacao';
import ModalConfirmar from '../../components/ModalConfirmar/ModalConfirmar';
import Modal from '../../components/Modal/Modal';
import { useApi } from '../../hooks/useApi';
import { paginar } from '../../utils/utils';
import { API_URL } from '../../config/api';

const POR_PAGINA = 5;

type Categoria = {
  id: string;
  categoria: string;
};

export default function Categoria() {
  const [pagCategoria, setPagCategoria] = useState(1);
  const [editando, setEditando] = useState<Categoria | null>(null);
  const [criando, setCriando] = useState(false);
  const [confirmarExcluir, setConfirmarExcluir] = useState<string | null>(null);
  const [erro, setErro] = useState('');

  const token = localStorage.getItem('token');

  const [form, setForm] = useState({ categoria: '' });

  const { data: categorias, setData: setCategorias } = useApi<Categoria[]>(
    `${API_URL}/api/categoria`,
  );

  const camposCategoria = [{ label: 'Categoria', chave: 'categoria' }];

  function abrirEdicao(c: Categoria) {
    setEditando(c);
    setForm({ categoria: c.categoria });
  }

  async function salvarEdicao() {
    if (!editando) return;
    if (!form.categoria.trim()) {
      setErro('Nome da Categoria é obrigatório.');
      return;
    }
    setErro('');
    await fetch(`${API_URL}/api/categoria/${editando.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    setCategorias((prev) =>
      prev
        ? prev.map((c) => (c.id === editando.id ? { ...c, ...form } : c))
        : prev,
    );
    setEditando(null);
  }

  async function excluir(id: string) {
    await fetch(`${API_URL}/api/categoria/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setCategorias((prev) => (prev ? prev.filter((c) => c.id !== id) : prev));
    setConfirmarExcluir(null);
  }

  async function criarCategoria() {
    if (!form.categoria.trim()) {
      setErro('Nome da Categoria é obrigatório.');
      return;
    }
    setErro('');
    const res = await fetch(`${API_URL}/api/categoria`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    const novo = await res.json();
    setCategorias((prev) => (prev ? [...prev, novo] : [novo]));
    setCriando(false);
    setForm({ categoria: '' });
  }
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.titulo}>CATEGORIA</h1>
        <button
          className={styles.btnNovo}
          onClick={() => {
            setCriando(true);
            setErro('');
            setForm({ categoria: '' });
          }}
        >
          + NOVA CATEGORIA
        </button>
      </div>{' '}
      <section className={styles.secao}>
        <div className={styles.tableHead}>
          <span>NOME DA CATEGORIA</span>
          <span>AÇÕES</span>
        </div>
        {paginar(categorias ?? [], pagCategoria, POR_PAGINA).map((c) => (
          <div key={c.id} className={styles.row}>
            <span className={styles.celula}>{c.categoria}</span>

            <span className={styles.celulaAcoes}>
              <button
                className={styles.btnEditar}
                onClick={() => abrirEdicao(c)}
              >
                EDITAR
              </button>
              <button
                className={styles.btnExcluir}
                onClick={() => setConfirmarExcluir(c.id)}
              >
                EXCLUIR
              </button>
            </span>
          </div>
        ))}
        <Paginacao
          pagina={pagCategoria}
          total={categorias?.length ?? 0}
          porPagina={POR_PAGINA}
          onChange={setPagCategoria}
        />
      </section>
      {confirmarExcluir && (
        <ModalConfirmar
          mensagem="Deseja excluir este categoria?"
          onConfirmar={() => excluir(confirmarExcluir)}
          onCancelar={() => setConfirmarExcluir(null)}
        />
      )}
      {editando && (
        <Modal
          titulo="EDITAR CATEGORIA"
          campos={camposCategoria}
          form={form}
          erro={erro}
          onChange={(chave, valor) =>
            setForm((f) => ({ ...f, [chave]: valor }))
          }
          onConfirmar={salvarEdicao}
          onCancelar={() => {
            setEditando(null);
            setErro('');
          }}
          labelConfirmar="SALVAR"
        />
      )}
      {criando && (
        <Modal
          titulo="NOVA CATEGORIA"
          campos={camposCategoria}
          form={form}
          erro={erro}
          onChange={(chave, valor) =>
            setForm((f) => ({ ...f, [chave]: valor }))
          }
          onConfirmar={criarCategoria}
          onCancelar={() => {
            setCriando(false);
            setErro('');
          }}
          labelConfirmar="CRIAR"
        />
      )}
    </div>
  );
}
