import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { API_URL } from '../../config/api';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', senha: '' });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  function atualizar(campo: string, valor: string) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function entrar() {
    setErro('');
    setCarregando(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.message || 'Erro ao fazer login.');
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

        <button className={styles.btn} onClick={entrar} disabled={carregando}>
          {carregando ? 'ENTRANDO...' : 'ENTRAR'}
        </button>

        <button className={styles.btn} onClick={() => navigate('/')}>
          VOLTAR
        </button>

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
