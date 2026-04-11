import { useState } from 'react';
import { useUser } from '../context/UserContext';
import api from '../services/api';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import './Loja.css';

export default function Loja() {
  const { usuario, atualizarUsuario } = useUser();
  const [registrado, setRegistrado] = useState(usuario?.interesse_loja || false);
  const [carregando, setCarregando] = useState(false);

  async function registrarInteresse() {
    setCarregando(true);
    try {
      await api.put('/usuario/interesse-loja');
      setRegistrado(true);
      await atualizarUsuario({ interesse_loja: true });
    } catch {}
    setCarregando(false);
  }

  return (
    <div className="loja-page">
      <Header />
      <div className="page-container">
        <div className="loja-page__content fade-in">
          <div className="loja-page__icon">🛍️</div>
          <h2 className="loja-page__title">Estamos preparando algo especial para você</h2>
          <div className="ornament">✦</div>

          <p className="loja-page__text">
            Em breve, nossa loja de terços, santos e artigos de devoção estará disponível aqui.
            Cada peça será abençoada e enviada com oração.
          </p>

          <div className="loja-page__items">
            <div className="loja-page__item">📿 Terços Artesanais</div>
            <div className="loja-page__item">🕯️ Velas Devocionais</div>
            <div className="loja-page__item">📖 Livros de Oração</div>
            <div className="loja-page__item">🏅 Medalhas e Santos</div>
          </div>

          {registrado ? (
            <div className="loja-page__registrado fade-in">
              <span>✓</span>
              <p>Você será avisada quando a loja abrir!</p>
            </div>
          ) : (
            <Button onClick={registrarInteresse} fullWidth disabled={carregando}>
              {carregando ? (
                <span className="loading-spinner" style={{ width: 20, height: 20 }} />
              ) : (
                'AVISE-ME QUANDO ABRIR »'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
