import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import api from '../services/api';
import Header from '../components/layout/Header';
import ProgressBar from '../components/ui/ProgressBar';
import SparkleButton from '../components/ui/SparkleButton';
import PreviewPlayer from '../components/ui/PreviewPlayer';
import PerfilPanel from '../components/ui/PerfilPanel';
import ConversionCard from '../components/ui/ConversionCard';
import IconSacro from '../components/ui/IconSacro';
import { oracoesAudio } from '../content/biblioteca';
import { IconHeadphones, IconLock, IconCheck, IconPen } from '../components/ui/Icons';
import './Home.css';

const PAYT_AUDIO_URL = 'https://pay.exemplo.com.br/audio';

export default function Home() {
  const { usuario } = useUser();
  const navigate = useNavigate();
  const [progresso, setProgresso] = useState(null);
  const [painelAberto, setPainelAberto] = useState(false);
  const [editandoIntencao, setEditandoIntencao] = useState(false);
  const [intencao, setIntencao] = useState(usuario?.intencao_principal || '');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/jornada/progresso').then(r => setProgresso(r.data)).catch(() => {});
    api.get('/perfil/stats').then(r => setStats(r.data)).catch(() => {});
  }, []);

  async function salvarIntencao() {
    await api.put('/usuario/intencao', { intencao_principal: intencao });
    setEditandoIntencao(false);
  }

  const diaAtual = progresso?.diaAtual || 1;
  const percentual = progresso?.percentual || 0;
  const jornadaCompleta = progresso?.jornadaCompleta || false;

  const cards = [
    { label: 'Rosário Virtual',        icon: '📿', path: '/rosario',    bgClass: 'home__card--rosario' },
    { label: 'Pedidos de Oração',      icon: '🙏', path: '/comunidade', bgClass: 'home__card--oracao' },
    { label: 'Sala de Oração Ao Vivo', icon: '⛪', path: null, emBreve: true, bgClass: 'home__card--sala' },
    { label: 'Biblioteca Espiritual',  icon: '📖', path: '/biblioteca', bgClass: 'home__card--biblioteca' },
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
        {/* Streak + Velas */}
        {stats?.streak > 0 && (
          <div className="home__streak fade-in">
            <span className="home__streak-icon">🕯️</span>
            <span className="home__streak-text">
              {stats.streak} {stats.streak === 1 ? 'dia' : 'dias'} de oração contínua
            </span>
          </div>
        )}

        <div className="home__welcome fade-in">
          <h2 className="home__greeting">Bem-vindo(a), {usuario?.nome?.split(' ')[0]}</h2>
          <div className="ornament">✦</div>

          {jornadaCompleta ? (
            <>
              <p className="home__subtitle">· Jornada Concluída ·</p>
              <p className="home__day">21 de 21 dias — Consagração completa</p>
              <ProgressBar percentual={100} />
              <div className="home__pos-jornada">
                <span className="home__pos-jornada-icon">👑</span>
                <p className="home__pos-jornada-texto">
                  Sua consagração foi concluída, mas a graça não precisa ter fim.
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="home__subtitle">· Jornada de 21 Dias ·</p>
              <p className="home__day">Dia {diaAtual} de 21</p>
              <ProgressBar percentual={percentual} />
              <SparkleButton onClick={() => navigate(`/jornada/${diaAtual}`)} fullWidth>
                Continuar Dia {diaAtual} »
              </SparkleButton>
            </>
          )}
        </div>

        {/* Velas visuais — últimos 7 dias */}
        {stats?.velasRecentes && stats.velasRecentes.length > 0 && (
          <div className="home__velas fade-in">
            <span className="home__velas-label">Sua presença no sacrário</span>
            <div className="home__velas-row">
              {Array.from({ length: 7 }).map((_, i) => {
                const dataAlvo = new Date();
                dataAlvo.setDate(dataAlvo.getDate() - (6 - i));
                const dataStr = dataAlvo.toISOString().split('T')[0];
                const acesa = stats.velasRecentes.some(v => {
                  const vStr = new Date(v).toISOString().split('T')[0];
                  return vStr === dataStr;
                });
                const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
                const eHoje = i === 6;
                return (
                  <div key={i} className={`home__vela-col ${eHoje ? 'home__vela-col--hoje' : ''}`}>
                    <div className={`home__vela ${acesa ? 'home__vela--acesa' : ''}`}>
                      {acesa ? '🕯️' : '·'}
                    </div>
                    <span className="home__vela-dia">{diasSemana[dataAlvo.getDay()]}</span>
                    <span className="home__vela-num">{dataAlvo.getDate()}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="home__grid fade-in">
          {cards.filter(c => !c.emBreve).map(card => (
            <button
              key={card.label}
              className={`home__card ${card.bgClass}`}
              onClick={() => card.path && navigate(card.path)}
            >
              <div className="home__card-body">
                <span className="home__card-icon">
{card.icon}
                </span>
              </div>
              <div className="home__card-footer">
                <span className="home__card-label">{card.label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Seção "Em Breve" */}
        {cards.filter(c => c.emBreve).length > 0 && (
          <div className="home__em-breve fade-in">
            <h3 className="home__em-breve-heading">Em breve</h3>
            <div className="home__grid home__grid--em-breve">
              {cards.filter(c => c.emBreve).map(card => (
                <div key={card.label} className={`home__card ${card.bgClass} home__card--disabled`}>
                  <div className="home__card-body">
                    <span className="home__card-icon">
                      {card.bgClass === 'home__card--sala' ? '⛪' : card.icon}
                    </span>
                  </div>
                  <div className="home__card-footer">
                    <span className="home__card-label">{card.label}</span>
                    <span className="home__card-badge">Em Breve</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Destaque: Biblioteca de Áudios Sagrados */}
        {temModuloAudio ? (
          <button
            className="home__audio-unlocked fade-in"
            onClick={() => navigate('/biblioteca?secao=audio')}
          >
            <span className="home__audio-unlocked-icon"><IconHeadphones size={24} /></span>
            <div className="home__audio-unlocked-text">
              <strong>Minha Biblioteca de Áudios Sagrados</strong>
              <span>{oracoesAudio.length} orações gravadas · tocar agora »</span>
            </div>
          </button>
        ) : (
          <div className="home__audio-promo fade-in">
            <div className="home__audio-promo-header">
              <span className="home__audio-promo-icon"><IconHeadphones size={24} /></span>
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
            {!usuario?.upsell_limpeza ? (
              <span className="home__limpeza-lock"><IconLock size={14} /> <small>Disponível para membros</small></span>
            ) : (
              <span className="home__limpeza-unlocked"><IconCheck size={14} /> Desbloqueado</span>
            )}
          </div>
        </button>

        {/* Conversion card pós-jornada */}
        {jornadaCompleta && (
          <div className="fade-in" style={{ marginTop: 'var(--space-md)' }}>
            <ConversionCard variante="pos-jornada" />
          </div>
        )}

        {/* Cena devocional — Santa + Basílica + Intenção */}
        <div className="home__cena fade-in">
          <div className="home__cena-bg" />
          <img src="/img/santa.png" alt="Nossa Senhora" className="home__cena-santa" />
          <div className="home__cena-direita">
            {editandoIntencao ? (
              <div className="home__intencao-edit">
                <input
                  type="text"
                  value={intencao}
                  onChange={e => setIntencao(e.target.value)}
                  maxLength={250}
                  autoFocus
                />
                <button onClick={salvarIntencao}><IconCheck size={18} /></button>
              </div>
            ) : (
              <div className="home__intencao-display" onClick={() => setEditandoIntencao(true)}>
                <span className="home__intencao-label">Minha Intenção</span>
                <span className="home__intencao-texto">{usuario?.intencao_principal || 'Toque para definir'}</span>
                <span className="home__intencao-edit-icon"><IconPen size={14} /></span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
