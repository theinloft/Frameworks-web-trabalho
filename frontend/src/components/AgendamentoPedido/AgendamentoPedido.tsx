import styles from './AgendamentoPedido.module.css';
import { AGENDAMENTO_VAZIO, type Agendamento } from './agendamento';

type Props = {
  value: Agendamento;
  onChange: (valor: Agendamento) => void;
};

export default function AgendamentoPedido({ value, onChange }: Props) {
  return (
    <div className={styles.bloco}>
      <h2 className={styles.titulo}>AGENDAMENTO</h2>

      <fieldset className={styles.grupo}>
        <legend className={styles.pergunta}>
          ESSE PEDIDO É UM SERVIÇO AGENDADO PARA O CLIENTE?
        </legend>
        <p className={styles.hint}>
          Marque &ldquo;Sim&rdquo; se houver um horário de atendimento marcado
          com o cliente. Caso contrário, deixe &ldquo;Não&rdquo; e o pedido
          será registrado normalmente.
        </p>

        <div className={styles.opcoes}>
          <label className={styles.opcao}>
            <input
              type="radio"
              name="agendado"
              checked={!value.agendado}
              onChange={() => onChange(AGENDAMENTO_VAZIO)}
            />
            Não
          </label>
          <label className={styles.opcao}>
            <input
              type="radio"
              name="agendado"
              checked={value.agendado}
              onChange={() => onChange({ ...value, agendado: true })}
            />
            Sim
          </label>
        </div>
      </fieldset>

      {value.agendado && (
        <>
          <label className={styles.opcao}>
            <input
              type="checkbox"
              checked={value.temFaixaHorario}
              onChange={(e) =>
                onChange({
                  ...value,
                  temFaixaHorario: e.target.checked,
                  fim: e.target.checked ? value.fim : '',
                })
              }
            />
            Esse atendimento tem faixa de horário (início e fim)?
          </label>
          <p className={styles.hint}>
            Com faixa de horário, nenhum outro pedido poderá ser marcado nesse
            período.
          </p>

          <div className={styles.campos}>
            <label className={styles.campo}>
              <span className={styles.label}>
                {value.temFaixaHorario ? 'INÍCIO' : 'DATA E HORÁRIO'}
              </span>
              <input
                className={styles.input}
                type="datetime-local"
                value={value.inicio}
                onChange={(e) => onChange({ ...value, inicio: e.target.value })}
              />
            </label>

            {value.temFaixaHorario && (
              <label className={styles.campo}>
                <span className={styles.label}>FIM</span>
                <input
                  className={styles.input}
                  type="datetime-local"
                  value={value.fim}
                  min={value.inicio}
                  onChange={(e) => onChange({ ...value, fim: e.target.value })}
                />
              </label>
            )}
          </div>
        </>
      )}
    </div>
  );
}
