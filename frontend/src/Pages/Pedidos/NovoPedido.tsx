import { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import styles from './NovoPedido.module.css';
import Modal from '../../components/Modal/Modal';
import { useNavigate } from 'react-router-dom';
import BuscaAutoCompletar from '../../components/BuscaAutoCompletar/BuscaAutoCompletar';
import { API_URL } from '../../config/api';

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
  const [nomeProduto, setNomeProduto] = useState('');
  const [criando, setCriandoCliente] = useState(false);
  const [erro, setErro] = useState('');
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(
    null,
  );
  const token = localStorage.getItem('token');

  const { data: produtos } = useApi<ProdutoItem[]>(`${API_URL}/api/produto`);
  const camposClientes = [
    { label: 'NOME', chave: 'nome' },
    { label: 'EMAIL', chave: 'email', tipo: 'email' },
  ];

  const {
    data: clientes,
    erro: erroClientes,
    setData: setClientes,
  } = useApi<Cliente[]>(`${API_URL}/api/cliente`);

  console.log('erroClientes:', erroClientes);

  useEffect(() => {
    console.log('NovoPedido montado!');
    return () => console.log('NovoPedido desmontado!');
  }, []);

  useEffect(() => {
    console.log('itensCarrinho mudou:', itensCarrinho);
  }, [itensCarrinho]);

  function adicionarItem() {
    if (!produtoSelecionado) return;

    setItensCarrinho((prev) => {
      const existente = prev.find(
        (i) => i.produto.id === produtoSelecionado.id,
      );
      if (existente) {
        return prev.map((i) =>
          i.produto.id === produtoSelecionado.id
            ? { produto: i.produto, quantidade: i.quantidade + quantidade }
            : i,
        );
      }
      return [...prev, { produto: produtoSelecionado, quantidade }];
    });

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
    await fetch(`${API_URL}/api/pedido`, {
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
    setCriandoCliente(false);
    setForm({ nome: '', email: '' });
  }

  const [form, setForm] = useState({ nome: '', email: '' });

  const clientesFiltrados =
    clientes?.filter((c) =>
      c.nome.toLowerCase().includes(nomeCliente.toLowerCase()),
    ) ?? [];
  const produtosFiltrados =
    produtos?.filter((p) =>
      p.nome.toLowerCase().includes(nomeProduto.toLowerCase()),
    ) ?? [];

  return (
    <>
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.titulo}>NOVO PEDIDO</h1>
        </div>

        <div className={styles.card}>
          <div className={styles.dadosPedido}>
            <div className={styles.linha}>
              <div className={styles.campo}>
                <label className={styles.label}>CLIENTE</label>

                <BuscaAutoCompletar
                  items={clientesFiltrados}
                  value={nomeCliente}
                  placeholder="Digite o nome do cliente"
                  getLabel={(c) => c.nome}
                  onChange={(texto) => {
                    setNomeCliente(texto);
                    setClienteSelecionado(null);
                  }}
                  onSelect={(cliente) => {
                    setClienteSelecionado(cliente);
                    setNomeCliente(cliente.nome);
                  }}
                />
              </div>

              <button
                className={styles.btnNovo}
                onClick={() => {
                  setCriandoCliente(true);
                  setErro('');
                  setForm({ nome: '', email: '' });
                }}
              >
                + NOVO CLIENTE
              </button>
            </div>
          </div>
        </div>
        <br></br>

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

            <div className={styles.linhaProduto}>
              {' '}
              <BuscaAutoCompletar
                items={produtosFiltrados}
                value={nomeProduto}
                placeholder="Digite o produto"
                getLabel={(p) => `${p.nome} - R$ ${Number(p.preco).toFixed(2)}`}
                onChange={(texto) => {
                  setNomeProduto(texto);
                  setProdutoSelecionado(null);
                }}
                onSelect={(produto) => {
                  setProdutoSelecionado(produto);
                  setNomeProduto(produto.nome);
                }}
              />
              <input
                className={styles.inputQtde}
                type="number"
                value={quantidade || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setQuantidade(val === '' ? 0 : Number(val));
                }}
                onBlur={() => {
                  if (quantidade < 1) setQuantidade(1);
                }}
              />
              <button className={styles.btnAdicionar} onClick={adicionarItem}>
                + ADICIONAR
              </button>
            </div>

            {itensCarrinho.length > 0 && (
              <div className={styles.carrinho}>
                {itensCarrinho.map((item) => (
                  <div key={item.produto.id} className={styles.itemCarrinho}>
                    <span className={styles.itemNome}>{item.produto.nome}</span>
                    <span className={styles.itemQtde}>{item.quantidade}x</span>
                    <span className={styles.itemPreco}>
                      R${' '}
                      {(Number(item.produto.preco) * item.quantidade).toFixed(
                        2,
                      )}
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
    </>
  );
}
