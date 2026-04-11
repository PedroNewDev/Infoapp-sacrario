import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import api from '../services/api';
import Header from '../components/layout/Header';
import ProgressBar from '../components/ui/ProgressBar';
import SparkleButton from '../components/ui/SparkleButton';
import PreviewPlayer from '../components/ui/PreviewPlayer';
import PerfilPanel from '../components/ui/PerfilPanel';
import { oracoesAudio } from '../content/biblioteca';
import './Home.css';

const PAYT_AUDIO_URL = 'https://pay.exemplo.com.br/audio';

export default function Home() {
  const { usuario } = useUser();
  const navigate = useNavigate();
  const [progresso, setProgresso] = useState(null);
  const [painelAberto, setPainelAberto] = useState(false);
  const [editandoIntencao, setEditandoIntencao] = useState(false);
  const [intencao, setIntencao] = useState(usuario?.intencao_principal || '');

  useEffect(() => {
    api.get('/jornada/progresso').then(r => setProgresso(r.data)).catch(() => {});
  }, []);

  async function salvarIntencao() {
    await api.put('/usuario/intencao', { intencao_principal: intencao });
    setEditandoIntencao(false);
  }

  const diaAtual = progresso?.diaAtual || 1;
  const percentual = progresso?.percentual || 0;

  const cards = [
    { label: 'Rosário Virtual', icon: '📿', path: '/rosario' },
    { label: 'Pedidos de Oração', icon: '🙏', path: '/comunidade' },
    { label: 'Sala de Oração Ao Vivo', icon: '⛪', path: null, emBreve: true },
    { label: 'Biblioteca Espiritual', icon: '📖', path: '/biblioteca' },
  ];

  const audioPreview = oracoesAudio.find(a => a.previewUrl);
  const temModuloAudio = usuario?.modulo_audio;

  return (
    <div className="home">
      <Header showAvatar onAvatarClick={() => setPainelAberto(true)} />
      <PerfilPanel
        aberto={painelAberto}
        onFechar={() => setPainelAberto(false)}
        progresso={progresso}
      />

      <div className="page-container">
        <div className="home__welcome fade-in">
          <h2 className="home__greeting">Bem-vinda, {usuario?.nome?.split(' ')[0]}</h2>
          <div className="ornament">✦</div>
          <p className="home__subtitle">· Jornada de 21 Dias ·</p>
          <p className="home__day">Dia {diaAtual} de 21</p>

          <ProgressBar percentual={percentual} />

          <SparkleButton onClick={() => navigate(`/jornada/${diaAtual}`)} fullWidth>
            CONTINUAR DIA {diaAtual} »
          </SparkleButton>
        </div>

        <div className="home__grid fade-in">
          {cards.map(card => (
            <button
              key={card.label}
              className={`home__card ${card.emBreve ? 'home__card--disabled' : ''}`}
              onClick={() => card.path && navigate(card.path)}
              disabled={card.emBreve}
            >
              <span className="home__card-icon">{card.icon}</span>
              <span className="home__card-label">{card.label}</span>
              {card.emBreve && <span className="home__card-badge">Em Breve</span>}
            </button>
          ))}
        </div>

        {/* Destaque: Biblioteca de Áudios Sagrados */}
        {temModuloAudio ? (
          <button
            className="home__audio-unlocked fade-in"
            onClick={() => navigate('/biblioteca?secao=audio')}
          >
            <span className="home__audio-unlocked-icon">🎧</span>
            <div className="home__audio-unlocked-text">
              <strong>Minha Biblioteca de Áudios Sagrados</strong>
              <span>{oracoesAudio.length} orações gravadas · tocar agora »</span>
            </div>
          </button>
        ) : (
          <div className="home__audio-promo fade-in">
            <div className="home__audio-promo-header">
              <span className="home__audio-promo-icon">🎧</span>
              <div className="home__audio-promo-head-text">
                <h3 className="home__audio-promo-title">Orações em Áudio Sagrado</h3>
                <p className="home__audio-promo-sub">
                  Leve Maria com você a qualquer hora · {oracoesAudio.length} orações
                </p>
              </div>
            </div>

            {audioPreview && (
              <div className="home__audio-promo-player">
                <PreviewPlayer
                  src={audioPreview.previewUrl}
                  titulo={audioPreview.titulo}
                  duracao={audioPreview.duracao}
                />
              </div>
            )}

            <button
              className="home__audio-promo-cta"
              onClick={() => window.open(PAYT_AUDIO_URL, '_blank')}
            >
              Ouvir todas as orações sagradas »
            </button>
          </div>
        )}

        {/* Card Oração de Limpeza */}
        <button className="home__limpeza fade-in" onClick={() => navigate('/oracao-limpeza')}>
          <span className="home__limpeza-icon">🕯️</span>
          <div className="home__limpeza-text">
            <strong>Oração de Limpeza e Proteção</strong>
            {!usuario?.upsell_limpeza && <span className="home__limpeza-lock">🔒</span>}
          </div>
        </button>

        {/* Intenção flutuante */}
        <div className="home__intencao fade-in">
          {editandoIntencao ? (
            <div className="home__intencao-edit">
              <input
                type="text"
                value={intencao}
                onChange={e => setIntencao(e.target.value)}
                maxLength={250}
                autoFocus
              />
              <button onClick={salvarIntencao}>✓</button>
            </div>
          ) : (
            <div className="home__intencao-display" onClick={() => setEditandoIntencao(true)}>
              <span>🌹</span>
              <span>Minha Intenção: {usuario?.intencao_principal || 'Toque para definir'}</span>
              <span className="home__intencao-edit-icon">✎</span>
            </div>
          )}
        </div>

        {/* Banner de dias restantes */}
        {!usuario?.acesso_vitalicio && usuario?.diasRestantes != null && usuario.diasRestantes <= 14 && (
          <div className="home__expiracao fade-in">
            Faltam {usuario.diasRestantes} dias para seu acesso expirar
          </div>
        )}
      </div>
    </div>
  );
}
