import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from '../Login/Login.module.css';
import { API_URL } from '../../config/api';

type Estado = 'carregando' | 'sucesso' | 'erro';

function Cartao({
  subtitulo,
  children,
}: {
  subtitulo: string;
  children?: ReactNode;
}) {
  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <h1 className={styles.logo}>Gestão de pedidos</h1>
        <p className={styles.subtitulo}>{subtitulo}</p>
        {children}
      </div>
    </main>
  );
}

function VerificarEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [estado, setEstado] = useState<Estado>(token ? 'carregando' : 'erro');
  const [mensagem, setMensagem] = useState(token ? '' : 'Link inválido.');
  const [email, setEmail] = useState('');
  const [aviso, setAviso] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!token) return;

    fetch(`${API_URL}/api/auth/verificar-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const dados = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(
            typeof dados.message === 'string'
              ? dados.message
              : 'Link inválido ou expirado',
          );
        }
        setEstado('sucesso');
      })
      .catch((e) => {
        setEstado('erro');
        setMensagem(e.message);
      });
  }, [token]);

  async function reenviar() {
    setAviso('');
    setEnviando(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/reenviar-verificacao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.status === 429) {
        setAviso('Muitas tentativas. Aguarde um minuto e tente de novo.');
      } else if (res.status === 400) {
        setAviso('Informe um email válido.');
      } else {
        setAviso(
          'Se o email existir e ainda não estiver confirmado, enviamos um novo link.',
        );
      }
    } catch {
      setAviso('Não foi possível conectar ao servidor.');
    } finally {
      setEnviando(false);
    }
  }

  if (estado === 'carregando') {
    return <Cartao subtitulo="CONFIRMANDO SEU EMAIL..." />;
  }

  if (estado === 'sucesso') {
    return (
      <Cartao subtitulo="EMAIL CONFIRMADO">
        <p className={styles.texto}>Agora você já pode entrar na sua conta.</p>
        <button className={styles.btn} onClick={() => navigate('/login')}>
          IR PARA O LOGIN
        </button>
      </Cartao>
    );
  }

  return (
    <Cartao subtitulo="NÃO FOI POSSÍVEL CONFIRMAR">
      <p className={styles.erro}>{mensagem}</p>

      <div className={styles.campo}>
        <label className={styles.label}>EMAIL</label>
        <input
          type="email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && reenviar()}
        />
      </div>

      <button className={styles.btn} onClick={reenviar} disabled={enviando}>
        {enviando ? 'ENVIANDO...' : 'REENVIAR LINK DE CONFIRMAÇÃO'}
      </button>

      {aviso && <p className={styles.aviso}>{aviso}</p>}

      <button className={styles.btn} onClick={() => navigate('/login')}>
        IR PARA O LOGIN
      </button>
    </Cartao>
  );
}

export default VerificarEmail;