import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import './PerfilPanel.css';

const PAYT_VITALICIO_URL = 'https://pay.exemplo.com.br/vitalicio';

function inicial(nome) {
  return nome ? nome.trim()[0].toUpperCase() : '?';
}

function StatusAcesso({ usuario }) {
  if (usuario?.acesso_vitalicio) {
    return (
      <div className="perfil__acesso">
        <div className="perfil__acesso-tipo perfil__acesso-tipo--vitalicio">
          <span>✦</span> Acesso Vitalício
        </div>
        <p className="perfil__acesso-desc">Você tem acesso completo para sempre.</p>
      </div>
    );
  }

  const dias = usuario?.diasRestantes ?? null;
  const total = 45;
  const pct = dias != null ? Math.max(0, Math.min(100, Math.round((dias / total) * 100))) : 0;
  const urgente = dias != null && dias <= 7;

  return (
    <div className="perfil__acesso">
      <div className={`perfil__acesso-tipo ${urgente ? 'perfil__acesso-tipo--urgente' : ''}`}>
        Plano 45 dias
      </div>
      {dias != null ? (
        <>
          <div className="perfil__acesso-bar-wrap">
            <div
              className={`perfil__acesso-bar ${urgente ? 'perfil__acesso-bar--urgente' : ''}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className={`perfil__acesso-dias ${urgente ? 'perfil__acesso-dias--urgente' : ''}`}>
            {dias === 0 ? 'Acesso expira hoje' : `${dias} ${dias === 1 ? 'dia restante' : 'dias restantes'}`}
          </p>
        </>
      ) : (
        <p className="perfil__acesso-desc">Carregando…</p>
      )}
    </div>
  );
}

export default function PerfilPanel({ aberto, onFechar, progresso }) {
  const { usuario, logout } = useUser();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    onFechar();
    navigate('/login');
  }

  const diaAtual = progresso?.diaAtual || 1;
  const percentual = progresso?.percentual || 0;

  return (
    <>
      <div
        className={`perfil-overlay ${aberto ? 'perfil-overlay--visivel' : ''}`}
        onClick={onFechar}
        aria-hidden="true"
      />

      <aside className={`perfil-panel ${aberto ? 'perfil-panel--aberto' : ''}`} aria-label="Painel de perfil">
        {/* Cabeçalho com fundo dourado */}
        <div className="perfil__header-bg">
          <button className="perfil__fechar" onClick={onFechar} aria-label="Fechar painel">✕</button>
          <div className="perfil__topo">
            <div className="perfil__avatar">{inicial(usuario?.nome)}</div>
            <div className="perfil__topo-info">
              <strong className="perfil__nome">{usuario?.nome || '—'}</strong>
              <span className="perfil__email">{usuario?.email || ''}</span>
            </div>
          </div>
        </div>

        <div className="perfil__divider" />

        {/* Jornada */}
        <div className="perfil__secao">
          <p className="perfil__secao-label">📿 Jornada de 21 Dias</p>
          <div className="perfil__jornada-info">
            <span className="perfil__jornada-dia">Dia {diaAtual} de 21</span>
            <span className="perfil__jornada-pct">{percentual}%</span>
          </div>
          <div className="perfil__jornada-bar-wrap">
            <div className="perfil__jornada-bar" style={{ width: `${percentual}%` }} />
          </div>
        </div>

        <div className="perfil__divider" />

        {/* Status de acesso */}
        <div className="perfil__secao">
          <p className="perfil__secao-label">Meu acesso</p>
          <StatusAcesso usuario={usuario} />

          {!usuario?.acesso_vitalicio && (
            <button
              className="perfil__upgrade-btn"
              onClick={() => window.open(PAYT_VITALICIO_URL, '_blank')}
            >
              <span>🌟</span>
              <div>
                <strong>Garantir acesso vitalício</strong>
                <span>Nunca mais se preocupe com expiração</span>
              </div>
              <span className="perfil__upgrade-arrow">›</span>
            </button>
          )}
        </div>

        <div className="perfil__divider" />

        {/* Módulos */}
        <div className="perfil__secao">
          <p className="perfil__secao-label">Módulos</p>
          <div className="perfil__modulos">
            <div className={`perfil__modulo ${usuario?.modulo_audio ? 'perfil__modulo--on' : 'perfil__modulo--off'}`}>
              <span>🎧</span>
              <span>Áudios Sagrados</span>
              <span className="perfil__modulo-status">{usuario?.modulo_audio ? 'Ativo' : 'Bloqueado'}</span>
            </div>
            <div className={`perfil__modulo ${usuario?.upsell_limpeza ? 'perfil__modulo--on' : 'perfil__modulo--off'}`}>
              <span>🕯️</span>
              <span>Oração de Limpeza</span>
              <span className="perfil__modulo-status">{usuario?.upsell_limpeza ? 'Ativo' : 'Bloqueado'}</span>
            </div>
          </div>
        </div>

        {/* Intenção */}
        {usuario?.intencao_principal && (
          <>
            <div className="perfil__divider" />
            <div className="perfil__secao">
              <p className="perfil__secao-label">🌹 Minha intenção</p>
              <p className="perfil__intencao">"{usuario.intencao_principal}"</p>
            </div>
          </>
        )}

        <div className="perfil__divider" />

        {/* Logout */}
        <button className="perfil__logout" onClick={handleLogout}>
          Sair da conta
        </button>
      </aside>
    </>
  );
}
