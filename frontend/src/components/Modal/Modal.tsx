import styles from "./Modal.module.css";

type Campo = {
  label: string;
  chave: string;
  tipo?: string;
  opcoes?: { label: string; value: string | number }[];
};

type Props = {
  titulo: string;
  campos: Campo[];
  form: Record<string, unknown>;
  erro?: string;
  onChange: (chave: string, valor: string) => void;
  onChangeImagem?: (file: File) => void;
  onConfirmar: () => void;
  onCancelar: () => void;
  labelConfirmar?: string;
};

export default function Modal({
  titulo,
  campos,
  form,
  erro,
  onChange,
  onConfirmar,
  onCancelar,
  labelConfirmar = "SALVAR",
  onChangeImagem,
}: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.modalTitulo}>{titulo}</h2>

        {campos.map((c) => (
          <div key={c.chave} className={styles.campo}>
            <label className={styles.label}>{c.label}</label>
            {c.tipo === "select" ? (
              <select
                className={styles.input}
                value={(form[c.chave] as string) ?? ""}
                onChange={(e) => onChange(c.chave, e.target.value)}
              >
                <option value="">Selecione...</option>
                {c.opcoes?.map((op) => (
                  <option key={op.value} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className={styles.input}
                type={c.tipo ?? "text"}
                inputMode={c.tipo === "number" ? "decimal" : undefined}
                value={(form[c.chave] as string) ?? ""}
                onChange={(e) => onChange(c.chave, e.target.value)}
              />
            )}
          </div>
        ))}
        {onChangeImagem && (
          <div className={styles.campo}>
            <label className={styles.label}>IMAGEM</label>
            <label className={styles.btnImagem}>
              SELECIONAR IMAGEM
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files?.[0]) onChangeImagem(e.target.files[0]);
                }}
              />
            </label>
          </div>
        )}
        {erro && <p className={styles.erro}>{erro}</p>}
        <div className={styles.modalAcoes}>
          <button className={styles.btnSalvar} onClick={onConfirmar}>
            {labelConfirmar}
          </button>
          <button className={styles.btnCancelar} onClick={onCancelar}>
            CANCELAR
          </button>
        </div>
      </div>
    </div>
  );
}
