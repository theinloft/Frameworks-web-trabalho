import { useState } from 'react';
import styles from './ModalConcluirPedido.module.css';
import { FormaPagamento, FORMA_PAGAMENTO_LABELS } from '../../types/pedido';

interface Props {
  onConfirmar: (formaPagamento: FormaPagamento) => void;
  onCancelar: () => void;
  erro?: string | null;
}

export default function ModalConcluirPedido({ onConfirmar, onCancelar, erro }: Props) {
    const [formaPagamento, setFormaPagamento] = useState<FormaPagamento | ''>('');

    function handleConfirmar() {
        if (!formaPagamento) return;
        onConfirmar(formaPagamento);
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                        {erro && <p className={styles.erro}>{erro}</p>}

                <p className={styles.mensagem}><h2>Concluir pedido</h2>
                    <p>Selecione a forma de pagamento:</p></p>

                <select
                    className={styles.select}
                    value={formaPagamento}
                    onChange={(e) => setFormaPagamento(e.target.value as FormaPagamento)}
                >
                    <option value="" disabled>
                        Selecione...
                    </option>
                    {Object.values(FormaPagamento).map((forma) => (
                        <option key={forma} value={forma}>
                            {FORMA_PAGAMENTO_LABELS[forma]}
                        </option>
                    ))}
                </select>

                <div className={styles.acoes}>
                    <button className={styles.btnCancelar} onClick={onCancelar}>
                        Cancelar
                    </button>
                    <button
                        className={styles.btnConfirmar}
                        onClick={handleConfirmar}
                        disabled={!formaPagamento}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}