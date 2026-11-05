import { useState } from 'react';
import styles from './Relatorios.module.css';
import { useApi } from '../../hooks/useApi';

const API_URL = import.meta.env.VITE_API_URL; 

type Filtros = {
    dataInicio: string;
    dataFim: string;
    formaPagamento: string;
};

type ResumoPagamento = {
    formaPagamento: string;
    quantidade: string; 
    total: string;
};

const filtrosIniciais: Filtros = {
    dataInicio: '',
    dataFim: '',
    formaPagamento: '',
};

function montarQuery(filtros: Filtros, extras: Record<string, string> = {}) {
    const params = new URLSearchParams();
    Object.entries({ ...filtros, ...extras }).forEach(([chave, valor]) => {
        if (valor) params.append(chave, valor);
    });
    return params.toString();
}

export default function Relatorios() {
    const [filtros, setFiltros] = useState<Filtros>(filtrosIniciais);
    const [aplicados, setAplicados] = useState<Filtros>(filtrosIniciais);
    const [carregando, setCarregando] = useState(false);
    const [erroExportar, setErroExportar] = useState('');

    const { data: resumo, erro } = useApi<ResumoPagamento[]>(
        `${API_URL}/relatorios/pedidos/resumo?${montarQuery(aplicados)}`,
    );

    function atualizar(campo: keyof Filtros, valor: string) {
        setFiltros((anterior) => ({ ...anterior, [campo]: valor }));
    }

    async function exportar(formato: 'pdf' | 'xlsx') {
        try {
            setCarregando(true);
            setErroExportar('');

            const token = localStorage.getItem('token');
            const query = montarQuery(aplicados, { formato });
            const res = await fetch(
                `${API_URL}/relatorios/pedidos/exportar?${query}`,
                { headers: { Authorization: `Bearer ${token}` } },
            );
            if (!res.ok) throw new Error('Erro ao exportar relatório');

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);

            if (formato === 'pdf') {
                window.open(url, '_blank');
            } else {
                const a = document.createElement('a');
                a.href = url;
                a.download = 'pedidos.xlsx';
                a.click();
                URL.revokeObjectURL(url);
            }
        } catch (e) {
            setErroExportar(e instanceof Error ? e.message : 'Erro inesperado');
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.titulo}>RELATÓRIOS</h1>
            </div>

            <div className={styles.filtros}>
                <div className={styles.campo}>
                    <label className={styles.label}>Data início</label>
                    <input
                        type="date"
                        className={styles.input}
                        value={filtros.dataInicio}
                        onChange={(e) => atualizar('dataInicio', e.target.value)}
                    />
                </div>

                <div className={styles.campo}>
                    <label className={styles.label}>Data fim</label>
                    <input
                        type="date"
                        className={styles.input}
                        value={filtros.dataFim}
                        onChange={(e) => atualizar('dataFim', e.target.value)}
                    />
                </div>

                <div className={styles.campo}>
                    <label className={styles.label}>Forma de pagamento</label>
                    <select
                        className={styles.input}
                        value={filtros.formaPagamento}
                        onChange={(e) => atualizar('formaPagamento', e.target.value)}
                    >
                        <option value="">Todas</option>
                        <option value="PIX">PIX</option>
                        <option value="CREDITO">Cartão de crédito</option>
                        <option value="DEBITO">Cartão de débito</option>
                        <option value="BOLETO">Boleto</option>
                    </select>
                </div>

                <div className={styles.acoes}>
                    <button className={styles.botao} onClick={() => setAplicados(filtros)}>
                        Filtrar
                    </button>
                    <button
                        className={styles.botao}
                        onClick={() => exportar('xlsx')}
                        disabled={carregando}
                    >
                        Exportar Excel
                    </button>
                    <button
                        className={styles.botao}
                        onClick={() => exportar('pdf')}
                        disabled={carregando}
                    >
                        Exportar PDF
                    </button>
                </div>
            </div>

            {erroExportar && <p>{erroExportar}</p>}
            {erro && <p>{erro}</p>}

            {resumo && (
                <table className={styles.tabela}>
                    <thead>
                        <tr>
                            <th>Forma de pagamento</th>
                            <th>Pedidos</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resumo.map((linha) => (
                            <tr key={linha.formaPagamento}>
                                <td>{linha.formaPagamento}</td>
                                <td>{Number(linha.quantidade)}</td>
                                <td>
                                    {Number(linha.total).toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                    })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}