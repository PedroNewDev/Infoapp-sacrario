import { useState } from 'react';
import Header from '../components/layout/Header';
import {
  oracoesTradicionais,
  oracoesEspeciais,
  reflexoesSantos,
  oracoesAudio
} from '../content/biblioteca';
import AudioPlayer from '../components/ui/AudioPlayer';
import PreviewPlayer from '../components/ui/PreviewPlayer';
import AudioLockedCard from '../components/ui/AudioLockedCard';
import { useUser } from '../context/UserContext';
import './BibliotecaEspiritual.css';

function CardAudio({ oracao, temAcesso }) {
  const [aberto, setAberto] = useState(false);

  return (
    <div className="biblioteca-audio-card">
      <button className="biblioteca-audio-card__header" onClick={() => setAberto(!aberto)}>
        <span className="biblioteca-audio-card__icone">
          {temAcesso ? '🎵' : oracao.previewUrl ? '▶' : '🔒'}
        </span>
        <div className="biblioteca-audio-card__meta">
          <span className="biblioteca-audio-card__titulo">{oracao.titulo}</span>
          <span className="biblioteca-audio-card__desc">{oracao.descricao}</span>
        </div>
        <div className="biblioteca-audio-card__right">
          <span className="biblioteca-audio-card__duracao">{oracao.duracao}</span>
          <span className={`biblioteca-audio-card__chevron ${aberto ? 'biblioteca-audio-card__chevron--open' : ''}`}>▼</span>
        </div>
      </button>

      {aberto && (
        <div className="biblioteca-audio-card__player fade-in">
          {temAcesso ? (
            <AudioPlayer src={oracao.url} titulo={null} />
          ) : oracao.previewUrl ? (
            <PreviewPlayer src={oracao.previewUrl} titulo={null} duracao={oracao.duracao} />
          ) : (
            <p className="biblioteca-audio-card__bloqueado">🔒 Disponível no Módulo de Áudio Sacro</p>
          )}
        </div>
      )}
    </div>
  );
}

function SecaoColapsavel({ icone, titulo, contagem, children }) {
  const [aberta, setAberta] = useState(false);

  return (
    <div className="biblioteca-section">
      <button className="biblioteca-section__header" onClick={() => setAberta(!aberta)}>
        <div className="biblioteca-section__header-left">
          <span className="biblioteca-section__header-icon">{icone}</span>
          <span className="biblioteca-section__header-title">
            {titulo}
            <span className="biblioteca-section__header-count"> ({contagem})</span>
          </span>
        </div>
        <span className={`biblioteca-section__chevron ${aberta ? 'biblioteca-section__chevron--open' : ''}`}>
          ▼
        </span>
      </button>
      {aberta && (
        <div className="biblioteca-section__content fade-in">
          {children}
        </div>
      )}
    </div>
  );
}

function CardOracao({ titulo, texto, santo }) {
  const [aberto, setAberto] = useState(false);

  return (
    <div className="biblioteca-card">
      <div className="biblioteca-card__header" onClick={() => setAberto(!aberto)}>
        <div>
          <div className="biblioteca-card__titulo">{titulo}</div>
          {santo && <div className="biblioteca-card__santo">{santo}</div>}
        </div>
        <span className="biblioteca-card__toggle">{aberto ? '▲' : '▼'}</span>
      </div>
      {aberto && (
        <div className="biblioteca-card__texto fade-in">{texto}</div>
      )}
    </div>
  );
}

export default function BibliotecaEspiritual() {
  const { usuario } = useUser();
  const temModuloAudio = !!usuario?.modulo_audio;

  return (
    <div className="biblioteca-page">
      <Header />
      <div className="page-container">
        <div className="biblioteca-page__intro fade-in">
          <div className="biblioteca-page__icon">📖</div>
          <h2 className="biblioteca-page__title">Biblioteca Espiritual</h2>
          <div className="ornament">✦</div>
        </div>

        {/* Seção de Áudio */}
        <div className="biblioteca-audio-section fade-in">
          <div className="biblioteca-audio-section__header">
            <span className="biblioteca-audio-section__icon">🎵</span>
            <div>
              <div className="biblioteca-audio-section__titulo">Orações em Áudio</div>
              <div className="biblioteca-audio-section__subtitulo">
                {temModuloAudio ? `${oracoesAudio.length} orações disponíveis` : 'Módulo de Áudio Sacro'}
              </div>
            </div>
            {temModuloAudio && (
              <span className="biblioteca-audio-section__badge">✓ Ativo</span>
            )}
          </div>

          <div className="biblioteca-audio-section__list">
            {oracoesAudio.map(o => (
              <CardAudio key={o.id} oracao={o} temAcesso={temModuloAudio} />
            ))}
          </div>

          {!temModuloAudio && (
            <AudioLockedCard />
          )}
        </div>

        <SecaoColapsavel icone="🙏" titulo="Orações Tradicionais" contagem={oracoesTradicionais.length}>
          {oracoesTradicionais.map(o => (
            <CardOracao key={o.id} titulo={o.titulo} texto={o.texto} />
          ))}
        </SecaoColapsavel>

        <SecaoColapsavel icone="💛" titulo="Orações Especiais" contagem={oracoesEspeciais.length}>
          {oracoesEspeciais.map(o => (
            <CardOracao key={o.id} titulo={o.titulo} texto={o.texto} />
          ))}
        </SecaoColapsavel>

        <SecaoColapsavel icone="✝️" titulo="Reflexões de Santos" contagem={reflexoesSantos.length}>
          {reflexoesSantos.map(r => (
            <CardOracao key={r.id} titulo={r.titulo} texto={r.texto} santo={r.santo} />
          ))}
        </SecaoColapsavel>
      </div>
    </div>
  );
}
