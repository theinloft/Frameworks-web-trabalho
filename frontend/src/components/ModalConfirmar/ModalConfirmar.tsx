import styles from "./ModalConfirmar.module.css";

type Props = {
  mensagem: string;
  onConfirmar: () => void;
  onCancelar: () => void;
};

export default function ModalConfirmar({
  mensagem,
  onConfirmar,
  onCancelar,
}: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <p className={styles.mensagem}>{mensagem}</p>
        <div className={styles.acoes}>
          <button className={styles.btnSim} onClick={onConfirmar}>
            SIM
          </button>
          <button className={styles.btnNao} onClick={onCancelar}>
            NÃO
          </button>
        </div>
      </div>
    </div>
  );
}
