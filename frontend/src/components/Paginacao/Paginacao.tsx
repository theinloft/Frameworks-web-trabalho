import styles from "./Paginacao.module.css";

type Props = {
  pagina: number;
  total: number;
  porPagina: number;
  onChange: (p: number) => void;
};

export default function Paginacao({
  pagina,
  total,
  porPagina,
  onChange,
}: Props) {
  const totalPaginas = Math.ceil(total / porPagina);
  if (totalPaginas <= 1) return null;

  return (
    <div className={styles.paginacao}>
      <button
        className={styles.btnPag}
        onClick={() => onChange(pagina - 1)}
        disabled={pagina === 1}
      >
        ‹
      </button>
      <span className={styles.pagInfo}>
        {pagina} / {totalPaginas}
      </span>
      <button
        className={styles.btnPag}
        onClick={() => onChange(pagina + 1)}
        disabled={pagina === totalPaginas}
      >
        ›
      </button>
    </div>
  );
}
