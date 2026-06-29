import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import styles from './NovoPedido.module.css';
import Modal from '../../components/Modal/Modal';
import { useNavigate } from 'react-router-dom';

type Pedido = {
  id: string;
  cliente?: Cliente;
  horarioPedido: string;
  itens: Produto[];
  status: string;
};

type Cliente = {
  id: string;
  nome: string;
};

type ProdutoItem = {
  id: string;
  nome: string;
  preco: number;
  imagem?: string;
};

type ItemCarrinho = {
  produto: ProdutoItem;
  quantidade: number;
};

export default function NovoPedido() {
  const [quantidade, setQuantidade] = useState(1);
  const [itensCarrinho, setItensCarrinho] = useState<ItemCarrinho[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] =
    useState<ProdutoItem | null>(null);
  const navigate = useNavigate();
  const [nomeCliente, setNomeCliente] = useState('');
  const [criando, setCriandoCliente] = useState(false);
  const [erro, setErro] = useState('');
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(
    null,
  );
  const token = localStorage.getItem('token');

  const { data: produtos } = useApi<ProdutoItem[]>(
    'http://localhost:3000/api/produtos',
  );
  const camposClientes = [
    { label: 'NOME', chave: 'nome' },
    { label: 'EMAIL', chave: 'email', tipo: 'email' },
  ];

  const {
    data: clientes,
    erro: erroClientes,
    setData: setClientes,
  } = useApi<Cliente[]>('http://localhost:3000/api/cliente');

  console.log('erroClientes:', erroClientes);

  function adicionarItem() {
    if (!produtoSelecionado) return;

    const existente = itensCarrinho.find(
      (i) => i.produto.id === produtoSelecionado.id,
    );
    if (existente) {
      setItensCarrinho((prev) =>
        prev.map((i) =>
          i.produto.id === produtoSelecionado.id
            ? { ...i, quantidade: i.quantidade + quantidade }
            : i,
        ),
      );
    } else {
      setItensCarrinho((prev) => [
        ...prev,
        { produto: produtoSelecionado, quantidade },
      ]);
    }
    setProdutoSelecionado(null);
    setQuantidade(1);
  }

  async function criarPedido() {
    if (!clienteSelecionado) {
      setErro('Selecione um cliente.');
      return;
    }
    if (itensCarrinho.length === 0) {
      setErro('Adicione pelo menos um produto.');
      return;
    }
    setErro('');
    await fetch('http://localhost:3000/api/pedido', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        clienteId: clienteSelecionado.id,
        itens: itensCarrinho.map((i) => ({
          produtoId: i.produto.id,
          quantidade: i.quantidade,
        })),
      }),
    });
    navigate('/pedidos');
  }

  function removerItem(produtoId: string) {
    setItensCarrinho((prev) => prev.filter((i) => i.produto.id !== produtoId));
  }

  async function criarCliente() {
    if (!form.nome.trim() || !form.email.trim()) {
      setErro('Nome e email são campos obrigatórios.');
      return;
    }
    setErro('');
    const res = await fetch('http://localhost:3000/api/cliente', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    const novo = await res.json();
    setClientes((prev) => (prev ? [...prev, novo] : [novo]));
    setCriandoCliente(false);
    setForm({ nome: '', email: '' });
  }

  const [form, setForm] = useState({ nome: '', email: '' });

  const clientesFiltrados =
    clientes?.filter((c) =>
      c.nome.toLowerCase().includes(nomeCliente.toLowerCase()),
    ) ?? [];

  console.log('clientes:', clientes);
  console.log('clientesFiltrados:', clientesFiltrados);
  return (
    <>
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.titulo}>NOVO PEDIDO</h1>
          <div className={styles.buscaCliente}>
            <button
              className={styles.btnNovo}
              onClick={() => {
                setCriandoCliente(true);
                setErro('');
                setForm({ nome: '', email: '' });
              }}
            >
              {' '}
              + NOVO CLIENTE
            </button>
            <br></br>
            <label className={styles.label}>CLIENTE:</label>
            <input
              type="text"
              placeholder="Digite o nome do cliente"
              value={nomeCliente}
              onChange={(e) => setNomeCliente(e.target.value)}
            />
            {nomeCliente && clientesFiltrados.length > 0 && (
              <ul className={styles.listaClientes}>
                {clientesFiltrados.map((cliente) => (
                  <li
                    onClick={() => {
                      setNomeCliente(cliente.nome);
                      setClienteSelecionado(cliente);
                    }}
                  >
                    {cliente.nome}
                  </li>
                ))}
              </ul>
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
                  setCriandoCliente(false);
                  setErro('');
                }}
                labelConfirmar="CRIAR"
              />
            )}
            {clienteSelecionado && (
              <div className={styles.secaoProdutos}>
                <h2 className={styles.secaoTitulo}>PRODUTOS</h2>

                <div className={styles.adicionarProduto}>
                  <select
                    className={styles.select}
                    value={produtoSelecionado?.id ?? ''}
                    onChange={(e) => {
                      const p =
                        produtos?.find((p) => p.id === e.target.value) ?? null;
                      setProdutoSelecionado(p);
                    }}
                  >
                    <option value="">Selecione um produto...</option>
                    {produtos?.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome} — R$ {Number(p.preco).toFixed(2)}
                      </option>
                    ))}
                  </select>
                  <input
                    className={styles.inputQtde}
                    type="number"
                    min={1}
                    value={quantidade}
                    onChange={(e) => setQuantidade(Number(e.target.value))}
                  />
                  <button
                    className={styles.btnAdicionar}
                    onClick={adicionarItem}
                  >
                    + ADICIONAR
                  </button>
                </div>

                {itensCarrinho.length > 0 && (
                  <div className={styles.carrinho}>
                    {itensCarrinho.map((item) => (
                      <div
                        key={item.produto.id}
                        className={styles.itemCarrinho}
                      >
                        <span className={styles.itemNome}>
                          {item.produto.nome}
                        </span>
                        <span className={styles.itemQtde}>
                          {item.quantidade}x
                        </span>
                        <span className={styles.itemPreco}>
                          R${' '}
                          {(
                            Number(item.produto.preco) * item.quantidade
                          ).toFixed(2)}
                        </span>
                        <button
                          className={styles.btnRemover}
                          onClick={() => removerItem(item.produto.id)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <div className={styles.total}>
                      <span>TOTAL</span>
                      <span>
                        R${' '}
                        {itensCarrinho
                          .reduce(
                            (acc, i) =>
                              acc + Number(i.produto.preco) * i.quantidade,
                            0,
                          )
                          .toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                {erro && <p className={styles.erro}>{erro}</p>}

                <button className={styles.btnCriar} onClick={criarPedido}>
                  CONFIRMAR PEDIDO
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
