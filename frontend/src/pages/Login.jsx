import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import api from '../services/api';
import Button from '../components/ui/Button';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [modoReset, setModoReset] = useState(false);
  const [resetEnviado, setResetEnviado] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      if (modoReset) {
        await api.post('/auth/esqueci-senha', { email });
        setResetEnviado(true);
      } else {
        const usuario = await login(email, senha);
        if (!usuario.onboarding_completo) {
          navigate('/onboarding');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao conectar. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-page__bg" />

      <div className="login-page__content fade-in">
        <div className="login-page__logo">
          <span className="login-page__icon">✦</span>
          <h1 className="login-page__title">Sacrário do Rosário</h1>
          <div className="ornament">✦</div>
        </div>

        {resetEnviado ? (
          <div className="login-page__reset-msg">
            <p>Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.</p>
            <Button onClick={() => { setModoReset(false); setResetEnviado(false); }} variant="secondary" fullWidth>
              Voltar ao Login
            </Button>
          </div>
        ) : (
          <form className="login-page__form" onSubmit={handleSubmit}>
            <div className="login-page__field">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Seu e-mail da compra"
                required
                autoComplete="email"
              />
            </div>

            {!modoReset && (
              <div className="login-page__field">
                <label htmlFor="senha">Senha</label>
                <input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  placeholder="Sua senha"
                  required
                  autoComplete="current-password"
                />
              </div>
            )}

            {erro && <p className="login-page__erro">{erro}</p>}

            <Button type="submit" fullWidth disabled={carregando}>
              {carregando ? (
                <span className="loading-spinner" style={{ width: 20, height: 20 }} />
              ) : modoReset ? 'ENVIAR LINK' : 'ENTRAR »'}
            </Button>

            <button
              type="button"
              className="login-page__link"
              onClick={() => { setModoReset(!modoReset); setErro(''); }}
            >
              {modoReset ? 'Voltar ao login' : 'Esqueci minha senha'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
