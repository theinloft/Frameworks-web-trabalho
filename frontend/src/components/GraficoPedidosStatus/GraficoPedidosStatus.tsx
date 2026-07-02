import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import styles from './GraficoPedidosStatus.module.css';

type Pedido = {
  status: string;
};

type Props = {
  pedidos: Pedido[];
};

const CORES = ['#f5c800', '#4caf50', '#ff5050'];

export default function GraficoPedidosStatus({ pedidos }: Props) {
  const dados = [
    {
      name: 'Andamento',
      value: pedidos.filter((p) => p.status === 'andamento').length,
    },
    {
      name: 'Concluído',
      value: pedidos.filter((p) => p.status === 'concluido').length,
    },
    {
      name: 'Cancelado',
      value: pedidos.filter((p) => p.status === 'cancelado').length,
    },
  ];

  return (
    <div className={styles.secao}>
      <span className={styles.titulo}>PEDIDOS POR STATUS</span>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={dados}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {dados.map((_, index) => (
              <Cell key={index} fill={CORES[index % CORES.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
