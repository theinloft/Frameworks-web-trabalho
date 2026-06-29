import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './cadastro-cliente.css';

export default function CadastroUsuario() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  function atualizar(campo: string, valor: string) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function cadastrar() {
    setErro('');
    setCarregando(true);

    try {
      const res = await fetch('http://localhost:3000/api/usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setErro(
          Array.isArray(data.message)
            ? data.message.join(', ')
            : data.message || 'Erro ao cadastrar.',
        );
        return;
      }

      const loginRes = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, senha: form.senha }),
      });

      if (loginRes.ok) {
        const { token } = await loginRes.json();
        localStorage.setItem('token', token);
        navigate('/painel');
      } else {
        navigate('/login');
      }
    } catch {
      setErro('Não foi possível conectar ao servidor.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="main">
      <div className="card">
        <h1 className="logo">SHRED_LAB</h1>
        <p className="subtitulo">CADASTRE-SE</p>

        <div className="campo">
          <label className="label">Nome</label>
          <input
            type="text"
            className="input"
            value={form.nome}
            onChange={(e) => atualizar('nome', e.target.value)}
          />
        </div>

        <div className="campo">
          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            value={form.email}
            onChange={(e) => atualizar('email', e.target.value)}
          />
        </div>

        <div className="campo">
          <label className="label">Senha</label>
          <input
            type="password"
            className="input"
            value={form.senha}
            onChange={(e) => atualizar('senha', e.target.value)}
          />
        </div>

        {erro && <p className="erro">{erro}</p>}

        <button
          type="button"
          className="btn"
          onClick={cadastrar}
          disabled={carregando}
        >
          {carregando ? 'CADASTRANDO...' : 'CADASTRAR'}
        </button>

        <button type="button" className="btn" onClick={() => navigate('/')}>
          VOLTAR
        </button>
      </div>
    </main>
  );
}
