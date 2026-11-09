import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import styles from './Login.module.css';
import { API_URL } from '../../config/api';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', senha: '' });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [emailPendente, setEmailPendente] = useState(false);
  const [aviso, setAviso] = useState('');
  const [reenviando, setReenviando] = useState(false);

  function atualizar(campo: string, valor: string) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function autenticar(caminho: string, corpo: object) {
    setErro('');
    setAviso('');
    setEmailPendente(false);
    setCarregando(true);

    try {
      const res = await fetch(`${API_URL}${caminho}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(corpo),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403) setEmailPendente(true);
        setErro(
          Array.isArray(data.message)
            ? data.message.join(' ')
            : data.message || 'Erro ao fazer login.',
        );
        return;
      }

      localStorage.setItem('token', data.token);
      window.dispatchEvent(new Event('storage'));
      navigate('/painel');
    } catch {
      setErro('Não foi possível conectar ao servidor.');
    } finally {
      setCarregando(false);
    }
  }

  function entrar() {
    return autenticar('/api/auth/login', form);
  }

  function entrarComGoogle(resposta: CredentialResponse) {
    if (!resposta.credential) {
      setErro('Não foi possível entrar com o Google.');
      return;
    }
    return autenticar('/api/auth/google', { credential: resposta.credential });
  }

  async function reenviar() {
    setAviso('');
    setReenviando(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/reenviar-verificacao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
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
      setReenviando(false);
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <h1 className={styles.logo}>Gestão de pedidos</h1>
        <p className={styles.subtitulo}>ACESSE SUA CONTA</p>
        <div className={styles.campo}>
          <label className={styles.label}>EMAIL</label>
          <input
            type="email"
            className={styles.input}
            value={form.email}
            onChange={(e) => atualizar('email', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && entrar()}
          />
        </div>

        <div className={styles.campo}>
          <label className={styles.label}>SENHA</label>
          <input
            type="password"
            className={styles.input}
            value={form.senha}
            onChange={(e) => atualizar('senha', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && entrar()}
          />
        </div>

        {erro && <p className={styles.erro}>{erro}</p>}

        {emailPendente && (
          <button
            className={styles.btn}
            onClick={reenviar}
            disabled={reenviando}
          >
            {reenviando ? 'ENVIANDO...' : 'REENVIAR LINK DE CONFIRMAÇÃO'}
          </button>
        )}
        {aviso && <p className={styles.aviso}>{aviso}</p>}

        <button className={styles.btn} onClick={entrar} disabled={carregando}>
          {carregando ? 'ENTRANDO...' : 'ENTRAR'}
        </button>

        <button className={styles.btn} onClick={() => navigate('/')}>
          VOLTAR
        </button>

        <p className={styles.divisor}>OU</p>
        <div className={styles.google}>
          <GoogleLogin
            onSuccess={entrarComGoogle}
            onError={() => setErro('Não foi possível entrar com o Google.')}
            theme="filled_black"
            shape="rectangular"
            width="284"
          />
        </div>

        <p className={styles.rodape}>
          Não tem conta?{' '}
          <Link to="/cadastro-cliente" className={styles.link}>
            CADASTRE-SE
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Login;