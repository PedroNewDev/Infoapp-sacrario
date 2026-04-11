import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import './AcessoExpirado.css';

export default function AcessoExpirado() {
  const navigate = useNavigate();

  return (
    <div className="expirado-page">
      <div className="expirado-page__content fade-in">
        <div className="expirado-page__icon">🌹</div>
        <h1 className="expirado-page__title">Sua jornada foi incrível</h1>
        <div className="ornament">✦</div>

        <p className="expirado-page__text">
          Seus 45 dias no Sacrário do Rosário chegaram ao fim. Mas a oração não precisa parar.
          Cada Ave Maria que você rezou foi ouvida. Cada intenção, acolhida.
          Maria continua esperando por você.
        </p>

        <p className="expirado-page__text">
          Seu progresso, suas intenções e seus rosários rezados estão guardados.
          Para continuar sua jornada de oração, garanta seu acesso permanente.
        </p>

        <div className="expirado-page__actions">
          <Button
            onClick={() => window.open('https://pay.exemplo.com.br/vitalicio', '_blank')}
            fullWidth
          >
            MANTER ACESSO VITALÍCIO »
          </Button>

          <Button
            variant="secondary"
            onClick={() => navigate('/login')}
            fullWidth
          >
            Voltar ao Login
          </Button>
        </div>

        <p className="expirado-page__footer">
          Imaculado Coração de Maria, sede o nosso refúgio.
        </p>
      </div>
    </div>
  );
}
