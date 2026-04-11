import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './DevPanel.css';

/**
 * Painel de desenvolvimento — só aparece em modo dev (npm run dev).
 * Atalhos para testar fluxos sem precisar navegar manualmente.
 */
export default function DevPanel() {
  const [aberto, setAberto] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Só renderiza em desenvolvimento
  if (import.meta.env.PROD) return null;

  return (
    <div className="dev-panel">
      <button className="dev-panel__toggle" onClick={() => setAberto(!aberto)}>
        🛠️
      </button>

      {aberto && (
        <div className="dev-panel__menu">
          <p className="dev-panel__title">Dev Tools</p>

          <div className="dev-panel__section">
            <p className="dev-panel__label">Navegar</p>
            <button onClick={() => navigate('/')}>Home</button>
            <button onClick={() => navigate('/rosario')}>Rosário</button>
            <button onClick={() => navigate('/comunidade')}>Comunidade</button>
            <button onClick={() => navigate('/biblioteca')}>Biblioteca</button>
            <button onClick={() => navigate('/limpeza')}>Limpeza</button>
            <button onClick={() => navigate('/loja')}>Loja</button>
            <button onClick={() => navigate('/conclusao')}>Conclusão</button>
            <button onClick={() => navigate('/acesso-expirado')}>Expirado</button>
          </div>

          <div className="dev-panel__section">
            <p className="dev-panel__label">Ações Rápidas</p>
            <button onClick={() => {
              window.__DEV_COMPLETE_ROSARIO?.();
              setAberto(false);
            }}>
              ⏩ Completar Rosário
            </button>
            <button onClick={() => {
              window.__DEV_SKIP_TO_CONJUNTO?.(3);
              setAberto(false);
            }}>
              ⏭️ Pular p/ Gloriosos
            </button>
            <button onClick={() => {
              localStorage.removeItem('sacrario_token');
              window.location.reload();
            }}>
              🚪 Logout (limpar token)
            </button>
          </div>

          <p className="dev-panel__rota">Rota: {location.pathname}</p>
        </div>
      )}
    </div>
  );
}
