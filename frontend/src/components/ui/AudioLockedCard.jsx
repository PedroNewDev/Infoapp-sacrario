import { useUser } from '../../context/UserContext';
import './AudioLockedCard.css';

const PAYT_AUDIO_URL = 'https://pay.exemplo.com.br/audio';

export default function AudioLockedCard({ dia, titulo }) {
  const { usuario } = useUser();

  // Não mostrar se já tem módulo de áudio
  if (usuario?.modulo_audio) return null;

  return (
    <div className="audio-locked-card">
      <div className="audio-locked-card__header">
        <span className="audio-locked-card__lock">🔒</span>
        <div className="audio-locked-card__info">
          <strong>Meditação guiada do Dia {dia}</strong>
          <span>{titulo || 'Aprofunde este mistério com a voz que guia'}</span>
        </div>
      </div>
      <div className="audio-locked-card__wave">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="audio-locked-card__wave-bar"
            style={{ height: `${8 + Math.sin(i * 0.8) * 8}px` }}
          />
        ))}
      </div>
      <button
        className="audio-locked-card__cta"
        onClick={() => window.open(PAYT_AUDIO_URL, '_blank')}
      >
        Desbloquear meditações →
      </button>
    </div>
  );
}
