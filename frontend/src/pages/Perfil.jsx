import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import api from '../services/api';
import Header from '../components/layout/Header';
import './Perfil.css';

const ICONES_HISTORICO = {
  jornada: '📿',
  rosario: '🌹',
  conquista: '🏅',
  vela: '🕯️'
};

function formatarData(data) {
  if (!data) return '';
  const d = new Date(data);
  const dia = d.getDate();
  const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  return `${dia} de ${meses[d.getMonth()]}`;
}

function extrairAno(data) {
  if (!data) return new Date().getFullYear();
  return new Date(data).getFullYear();
}

export default function Perfil() {
  const { usuario, logout } = useUser();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api.get('/perfil/stats')
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setCarregando(false));
  }, []);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function inicial(nome) {
    return nome ? nome.trim()[0].toUpperCase() : '?';
  }

  if (carregando) {
    return (
      <div className="perfil-page">
        <Header />
        <div className="page-container" style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
          <div className="loading-spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="perfil-page">
      <Header />
      <div className="page-container">
        <h1 className="perfil-page__title fade-in">Meu Perfil</h1>

        {/* Card do Usuário */}
        <div className="perfil-page__user-card fade-in">
          <div className="perfil-page__avatar">{inicial(usuario?.nome)}</div>
          <div className="perfil-page__user-info">
            <strong className="perfil-page__nome">{usuario?.nome || '—'}</strong>
            <span className="perfil-page__membro">Peregrina desde {extrairAno(stats?.membroDesde)}</span>
          </div>
          {stats?.streak > 0 && (
            <div className="perfil-page__streak-badge">
              <span>🕯️</span>
              <span>{stats.streak} {stats.streak === 1 ? 'dia' : 'dias'}</span>
            </div>
          )}
        </div>

        {/* Progresso Geral */}
        <div className="perfil-page__stats-grid fade-in">
          <div className="perfil-page__stat-card">
            <span className="perfil-page__stat-icon">📿</span>
            <div className="perfil-page__stat-data">
              <span className="perfil-page__stat-valor">
                {stats?.jornada?.diasConcluidos || 0}<span className="perfil-page__stat-total">/ 21</span>
              </span>
              <span className="perfil-page__stat-label">Jornada</span>
            </div>
            <div className="perfil-page__stat-bar-wrap">
              <div className="perfil-page__stat-bar" style={{ width: `${stats?.jornada?.percentual || 0}%` }} />
            </div>
          </div>

          <div className="perfil-page__stat-card">
            <span className="perfil-page__stat-icon">🌹</span>
            <div className="perfil-page__stat-data">
              <span className="perfil-page__stat-valor">{stats?.rosarios || 0}</span>
              <span className="perfil-page__stat-label">Rosários</span>
            </div>
          </div>

          <div className="perfil-page__stat-card">
            <span className="perfil-page__stat-icon">🕯️</span>
            <div className="perfil-page__stat-data">
              <span className="perfil-page__stat-valor">{stats?.streak || 0}</span>
              <span className="perfil-page__stat-label">Sequência</span>
            </div>
          </div>

          <div className="perfil-page__stat-card">
            <span className="perfil-page__stat-icon">🙏</span>
            <div className="perfil-page__stat-data">
              <span className="perfil-page__stat-valor">{stats?.pedidos || 0}</span>
              <span className="perfil-page__stat-label">Pedidos</span>
            </div>
          </div>
        </div>

        {/* Velas — últimos 21 dias */}
        {stats?.velasRecentes && (
          <div className="perfil-page__velas-section fade-in">
            <h3 className="perfil-page__section-title">Velas Acesas</h3>
            <div className="perfil-page__velas-row">
              {Array.from({ length: 21 }).map((_, i) => {
                const dataAlvo = new Date();
                dataAlvo.setDate(dataAlvo.getDate() - (20 - i));
                const dataStr = dataAlvo.toISOString().split('T')[0];
                const acesa = stats.velasRecentes.some(v => {
                  const vStr = new Date(v).toISOString().split('T')[0];
                  return vStr === dataStr;
                });
                return (
                  <div
                    key={i}
                    className={`perfil-page__vela ${acesa ? 'perfil-page__vela--acesa' : ''}`}
                    title={dataStr}
                  >
                    {acesa ? '🕯️' : '·'}
                  </div>
                );
              })}
            </div>
            <p className="perfil-page__velas-legenda">Últimos 21 dias de presença no sacrário</p>
          </div>
        )}

        {/* Conquistas */}
        <div className="perfil-page__conquistas-section fade-in">
          <h3 className="perfil-page__section-title">Conquistas</h3>
          <div className="perfil-page__conquistas-grid">
            {stats?.conquistas?.map(c => (
              <div
                key={c.key}
                className={`perfil-page__conquista ${c.desbloqueada ? 'perfil-page__conquista--desbloqueada' : ''}`}
              >
                <span className="perfil-page__conquista-icone">{c.icone}</span>
                <strong className="perfil-page__conquista-nome">{c.nome}</strong>
                <span className="perfil-page__conquista-desc">{c.descricao}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Histórico de Atividades */}
        {stats?.historico?.length > 0 && (
          <div className="perfil-page__historico-section fade-in">
            <h3 className="perfil-page__section-title">Histórico</h3>
            <div className="perfil-page__historico-list">
              {stats.historico.map((h, i) => (
                <div key={i} className="perfil-page__historico-item">
                  <span className="perfil-page__historico-icon">
                    {ICONES_HISTORICO[h.tipo] || '✦'}
                  </span>
                  <div className="perfil-page__historico-info">
                    <span className="perfil-page__historico-desc">{h.descricao}</span>
                    <span className="perfil-page__historico-data">{formatarData(h.data)}</span>
                  </div>
                  <span className="perfil-page__historico-badge">Completo</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logout */}
        <button className="perfil-page__logout fade-in" onClick={handleLogout}>
          Sair da conta
        </button>
      </div>
    </div>
  );
}
