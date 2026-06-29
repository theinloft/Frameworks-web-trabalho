import styles from './Produtos.module.css';
import Paginacao from '../../components/Paginacao/Paginacao';
import { paginar } from '../../utils/utils';
import { useApi } from '../../hooks/useApi';
import Modal from '../../components/Modal/Modal';
import ModalConfirmar from '../../components/ModalConfirmar/ModalConfirmar';
import { useState } from 'react';

const POR_PAGINA = 5;

type Categoria = {
  id: number;
  categoria: string;
};

type Produto = {
  id: string;
  nome: string;
  preco: number;
  imagem?: string;
  categoria?: Categoria;
};

export default function Produtos() {
  const [erro, setErro] = useState('');
  const [pagProdutos, setPagProdutos] = useState(1);
  const [visualizando, setVisualizando] = useState<Produto | null>(null);

  const [editando, setEditando] = useState<Produto | null>(null);
  const [imagem, setImagem] = useState<File | null>(null);

  const [criando, setCriando] = useState(false);
  const [confirmarExcluir, setConfirmarExcluir] = useState<string | null>(null);

  const [form, setForm] = useState({ nome: '', preco: 0, categoriaId: 0 });

  const { data: categorias } = useApi<Categoria[]>(
    'http://localhost:3000/api/categoria',
  );

  const { data: produtos, setData: setProdutos } = useApi<Produto[]>(
    'http://localhost:3000/api/produto',
  );

  const camposProduto = [
    { label: 'NOME', chave: 'nome' },
    { label: 'PREÇO', chave: 'preco', tipo: 'number' },
    {
      label: 'CATEGORIA',
      chave: 'categoriaId',
      tipo: 'select',
      opcoes:
        categorias?.map((c) => ({ label: c.categoria, value: c.id })) ?? [],
    },
  ];

  const token = localStorage.getItem('token');

  function abrirEdicao(p: Produto) {
    setEditando(p);
    setForm({
      nome: p.nome,
      preco: p.preco,
      categoriaId: p.categoria?.id || 0,
    });
  }

  async function salvarEdicao() {
    if (!editando) return;
    if (!form.nome.trim()) {
      setErro('O nome do produto é obrigatório.');
      return;
    }
    if (!form.preco || Number(form.preco) <= 0) {
      setErro('O preço deve ser maior que zero.');
      return;
    }
    if (!form.categoriaId) {
      setErro('Selecione uma categoria.');
      return;
    }
    setErro('');
    await fetch(`http://localhost:3000/api/produto/${editando.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (imagem) {
      const formData = new FormData();
      formData.append('imagem', imagem);
      await fetch(
        `http://localhost:3000/api/produto/imagens/upload/${editando.id}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );
    }

    setProdutos((prev) =>
      prev
        ? prev.map((p) => (p.id === editando.id ? { ...p, ...form } : p))
        : prev,
    );
    setEditando(null);
    setImagem(null);
  }

  async function excluir(id: string) {
    if (!confirm('Excluir produto?')) return;
    await fetch(`http://localhost:3000/api/produto/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setProdutos((prev) => (prev ? prev.filter((p) => p.id !== id) : prev));
    setConfirmarExcluir(null);
  }

  async function criarProduto() {
    if (!form.nome.trim()) {
      setErro('O nome do produto é obrigatório.');
      return;
    }
    if (!form.preco || Number(form.preco) <= 0) {
      setErro('O preço deve ser maior que zero.');
      return;
    }
    if (!form.categoriaId) {
      setErro('Selecione uma categoria.');
      return;
    }
    setErro('');
    const res = await fetch('http://localhost:3000/api/produto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    const novo = await res.json();
    setProdutos((prev) => (prev ? [...prev, novo] : [novo]));
    setCriando(false);
    setImagem(null);
    setForm({ nome: '', preco: 0, categoriaId: 0 });

    if (imagem) {
      const formData = new FormData();
      formData.append('imagem', imagem);
      await fetch(
        `http://localhost:3000/api/produto/imagens/upload/${novo.id}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.titulo}>PRODUTOS</h1>
        <button
          className={styles.btnNovo}
          onClick={() => {
            setCriando(true);
            setErro('');
            setForm({ nome: '', preco: 0, categoriaId: 0 });
          }}
        >
          + NOVO PRODUTO
        </button>
      </div>
      {/* Produtos */}

      <section className={styles.secao}>
        <div className={styles.secaoHead}></div>
        <div className={styles.tableHead}>
          <span>NOME</span>
          <span>PREÇO</span>
          <span>CATEGORIA</span>
          <span>AÇÕES</span>
        </div>
        {paginar(produtos ?? [], pagProdutos, POR_PAGINA).map((p) => (
          <div key={p.id} className={styles.row}>
            <span className={styles.celula} onClick={() => setVisualizando(p)}>
              {p.nome}
            </span>
            <span className={styles.celulaSecundaria}>
              R$ {Number(p.preco).toFixed(2)}
            </span>
            <span className={styles.celulaSecundaria}>
              {p.categoria?.categoria ?? '—'}
            </span>
            <span className={styles.celulaAcoes}>
              <button
                className={styles.btnEditar}
                onClick={() => abrirEdicao(p)}
              >
                EDITAR
              </button>
              <button
                className={styles.btnExcluir}
                onClick={() => setConfirmarExcluir(p.id)}
              >
                EXCLUIR
              </button>
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
      {confirmarExcluir && (
        <ModalConfirmar
          mensagem="Deseja excluir este produto?"
          onConfirmar={() => excluir(confirmarExcluir)}
          onCancelar={() => setConfirmarExcluir(null)}
        />
      )}
      {editando && (
        <Modal
          titulo="EDITAR PRODUTO"
          campos={camposProduto}
          form={form}
          erro={erro}
          onChange={(chave, valor) =>
            setForm((f) => ({ ...f, [chave]: valor }))
          }
          onChangeImagem={(file) => setImagem(file)}
          onConfirmar={salvarEdicao}
          onCancelar={() => setEditando(null)}
          labelConfirmar="SALVAR"
        />
      )}
      {criando && (
        <Modal
          titulo="NOVO PRODUTO"
          campos={camposProduto}
          form={form}
          erro={erro}
          onChange={(chave, valor) =>
            setForm((f) => ({ ...f, [chave]: valor }))
          }
          onChangeImagem={(file) => setImagem(file)}
          onConfirmar={criarProduto}
          onCancelar={() => setCriando(false)}
          labelConfirmar="CRIAR"
        />
      )}
      {visualizando && (
        <div
          className={styles.lightboxOverlay}
          onClick={() => setVisualizando(null)}
        >
          <div className={styles.lightbox} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.lightboxFechar}
              onClick={() => setVisualizando(null)}
            >
              ✕
            </button>
            {visualizando.imagem ? (
              <img
                className={styles.lightboxImagem}
                src={`http://localhost:3000/uploads/${visualizando.imagem}`}
                alt={visualizando.nome}
              />
            ) : (
              <div className={styles.lightboxSemImagem}>SEM IMAGEM</div>
            )}
            <div className={styles.lightboxInfo}>
              <h2 className={styles.lightboxNome}>{visualizando.nome}</h2>
              <span className={styles.lightboxPreco}>
                R$ {Number(visualizando.preco).toFixed(2)}
              </span>
              <span className={styles.lightboxCategoria}>
                {visualizando.categoria?.categoria ?? '—'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
