import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Button from '../components/ui/Button';
import './Login.css';

export default function DefinirSenha() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { definirSenha } = useUser();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');

    if (senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres');
      return;
    }
    if (senha !== confirmar) {
      setErro('As senhas não coincidem');
      return;
    }

    setCarregando(true);
    try {
      await definirSenha(token, senha);
      navigate('/onboarding');
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao definir senha. O link pode ter expirado.');
    } finally {
      setCarregando(false);
    }
  }

  if (!token) {
    return (
      <div className="login-page">
        <div className="login-page__content fade-in">
          <div className="login-page__logo">
            <span className="login-page__icon">✦</span>
            <h1 className="login-page__title">Sacrário do Rosário</h1>
          </div>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
            Link inválido. Verifique seu e-mail para o link correto.
          </p>
          <Button onClick={() => navigate('/login')} fullWidth variant="secondary">
            Ir para o Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-page__bg" />
      <div className="login-page__content fade-in">
        <div className="login-page__logo">
          <span className="login-page__icon">✦</span>
          <h1 className="login-page__title">Sacrário do Rosário</h1>
          <div className="ornament">✦</div>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
            Defina sua senha para acessar
          </p>
        </div>

        <form className="login-page__form" onSubmit={handleSubmit}>
          <div className="login-page__field">
            <label htmlFor="senha">Nova Senha</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              autoComplete="new-password"
            />
          </div>

          <div className="login-page__field">
            <label htmlFor="confirmar">Confirmar Senha</label>
            <input
              id="confirmar"
              type="password"
              value={confirmar}
              onChange={e => setConfirmar(e.target.value)}
              placeholder="Repita a senha"
              required
              autoComplete="new-password"
            />
          </div>

          {erro && <p className="login-page__erro">{erro}</p>}

          <Button type="submit" fullWidth disabled={carregando}>
            {carregando ? <span className="loading-spinner" style={{ width: 20, height: 20 }} /> : 'DEFINIR SENHA »'}
          </Button>
        </form>
      </div>
    </div>
  );
}
