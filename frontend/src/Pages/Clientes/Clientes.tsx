import { useState } from 'react';
import { paginar } from '../../utils/utils';
import Modal from '../../components/Modal/Modal';
import { useApi } from '../../hooks/useApi';
import Paginacao from '../../components/Paginacao/Paginacao';
import styles from './Clientes.module.css';
import ModalConfirmar from '../../components/ModalConfirmar/ModalConfirmar';
import { API_URL } from '../../config/api';

const POR_PAGINA = 5;

type Cliente = {
  id: string;
  nome: string;
  email: string;
};

export default function Clientes() {
  const [pagClientes, setPagClientes] = useState(1);
  const [editando, setEditando] = useState<Cliente | null>(null);
  const [criando, setCriando] = useState(false);
  const [confirmarExcluir, setConfirmarExcluir] = useState<string | null>(null);
  const [erro, setErro] = useState('');

  const token = localStorage.getItem('token');

  const [form, setForm] = useState({ nome: '', email: '' });

  const { data: clientes, setData: setClientes } = useApi<Cliente[]>(
    `${API_URL}/api/cliente`,
  );

  const camposClientes = [
    { label: 'NOME', chave: 'nome' },
    { label: 'EMAIL', chave: 'email', tipo: 'email' },
  ];

  function abrirEdicao(c: Cliente) {
    setEditando(c);
    setForm({ nome: c.nome, email: c.email });
  }

  async function salvarEdicao() {
    if (!editando) return;
    if (!form.nome.trim() || !form.email.trim()) {
      setErro('Nome e email são obrigatórios.');
      return;
    }
    setErro('');
    await fetch(`${API_URL}/api/cliente/${editando.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    setClientes((prev) =>
      prev
        ? prev.map((c) => (c.id === editando.id ? { ...c, ...form } : c))
        : prev,
    );
    setEditando(null);
  }

  async function excluir(id: string) {
    await fetch(`${API_URL}/api/cliente/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setClientes((prev) => (prev ? prev.filter((c) => c.id !== id) : prev));
    setConfirmarExcluir(null);
  }

  async function criarCliente() {
    if (!form.nome.trim() || !form.email.trim()) {
      setErro('Nome e email são campos obrigatórios.');
      return;
    }
    setErro('');
    const res = await fetch(`${API_URL}/api/cliente`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    const novo = await res.json();
    setClientes((prev) => (prev ? [...prev, novo] : [novo]));
    setCriando(false);
    setForm({ nome: '', email: '' });
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.titulo}>CLIENTES</h1>
        <button
          className={styles.btnNovo}
          onClick={() => {
            setCriando(true);
            setErro('');
            setForm({ nome: '', email: '' });
          }}
        >
          + NOVO CLIENTE
        </button>
      </div>

      <section className={styles.secao}>
        <div className={styles.tableHead}>
          <span>NOME</span>
          <span>EMAIL</span>
          <span>AÇÕES</span>
        </div>
        {paginar(clientes ?? [], pagClientes, POR_PAGINA).map((c) => (
          <div key={c.id} className={styles.row}>
            <span className={styles.celula}>{c.nome}</span>
            <span className={styles.celulaSecundaria}>{c.email}</span>
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
          pagina={pagClientes}
          total={clientes?.length ?? 0}
          porPagina={POR_PAGINA}
          onChange={setPagClientes}
        />
      </section>

      {confirmarExcluir && (
        <ModalConfirmar
          mensagem="Deseja excluir este cliente?"
          onConfirmar={() => excluir(confirmarExcluir)}
          onCancelar={() => setConfirmarExcluir(null)}
        />
      )}
      {editando && (
        <Modal
          titulo="EDITAR CLIENTE"
          campos={camposClientes}
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
          titulo="NOVO CLIENTE"
          campos={camposClientes}
          form={form}
          erro={erro}
          onChange={(chave, valor) =>
            setForm((f) => ({ ...f, [chave]: valor }))
          }
          onConfirmar={criarCliente}
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
