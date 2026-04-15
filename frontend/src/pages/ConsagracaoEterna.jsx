import { useUser } from '../context/UserContext';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import './ConsagracaoEterna.css';

const PAYT_VITALICIO_URL = 'https://pay.exemplo.com.br/vitalicio';

export default function ConsagracaoEterna() {
  const { usuario } = useUser();

  const diasRestantes = usuario?.diasRestantes ?? null;
  const totalDias = 45;
  const percentualRestante = diasRestantes != null
    ? Math.max(0, Math.min(100, Math.round((diasRestantes / totalDias) * 100)))
    : 100;

  // Se já é vitalício
  if (usuario?.acesso_vitalicio) {
    return (
      <div className="consagracao-page">
        <Header />
        <div className="page-container">
          <div className="consagracao-page__content fade-in">
            <span className="consagracao-page__icon-main">✦</span>
            <h1 className="consagracao-page__title">Consagração <em>Eterna</em></h1>
            <div className="ornament">✦</div>
            <div className="consagracao-page__vitalicio-card">
              <span>👑</span>
              <div>
                <strong>Você possui acesso eterno</strong>
                <p>Seu sacrário nunca fecha. Reze em paz, para sempre.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="consagracao-page">
      <Header />
      <div className="page-container">
        <div className="consagracao-page__content fade-in">
          <span className="consagracao-page__icon-main">✦</span>
          <h1 className="consagracao-page__title">Consagração <em>Eterna</em></h1>
          <p className="consagracao-page__subtitle">Garanta acesso permanente ao Sacrário do Rosário</p>

          {/* Card de alerta com dias restantes */}
          {diasRestantes != null && (
            <div className="consagracao-page__alerta fade-in">
              <div className="consagracao-page__alerta-header">
                <span>🕯️</span>
                <div>
                  <strong>Sua graça se encerra em <em>{diasRestantes}</em> dias</strong>
                  <p>Seu acesso inclui <strong>45 dias de bênção</strong> a contar do primeiro acesso. Após esse período, o sacrário se fecha.</p>
                </div>
              </div>
              <div className="consagracao-page__alerta-bar-wrap">
                <div
                  className="consagracao-page__alerta-bar"
                  style={{ width: `${percentualRestante}%` }}
                />
              </div>
            </div>
          )}

          {/* Benefícios */}
          <div className="consagracao-page__beneficio fade-in">
            <span className="consagracao-page__beneficio-icon">✦</span>
            <div>
              <strong>Acesso Perpétuo</strong>
              <p>Seu sacrário nunca fecha. Reze quando seu coração pedir.</p>
            </div>
          </div>

          <div className="consagracao-page__beneficio fade-in">
            <span className="consagracao-page__beneficio-icon">✦</span>
            <div>
              <strong>Novos Mistérios</strong>
              <p>Receba conteúdos inéditos de oração para sempre, sem pagar mais nada.</p>
            </div>
          </div>

          <div className="consagracao-page__beneficio fade-in">
            <span className="consagracao-page__beneficio-icon">✦</span>
            <div>
              <strong>Sem Preocupações</strong>
              <p>Nunca mais se preocupe com prazo. Volte ao sacrário quando quiser.</p>
            </div>
          </div>

          {/* Preço + CTA */}
          <div className="consagracao-page__oferta fade-in">
            <p className="consagracao-page__oferta-de">
              <span className="consagracao-page__risco">Acesso limitado a 45 dias</span>
            </p>
            <p className="consagracao-page__oferta-por">Por apenas</p>
            <p className="consagracao-page__oferta-preco">
              <span className="consagracao-page__cifrao">R$</span>
              <span className="consagracao-page__valor">97</span>
            </p>
            <p className="consagracao-page__oferta-info">pagamento único · acesso para sempre</p>

            <Button
              onClick={() => window.open(PAYT_VITALICIO_URL, '_blank')}
              fullWidth
            >
              ✦ CONSAGRAR ACESSO ETERNO »
            </Button>

            <p className="consagracao-page__oferta-seguro">Pagamento seguro via PIX</p>
          </div>
        </div>
      </div>
    </div>
  );
}
