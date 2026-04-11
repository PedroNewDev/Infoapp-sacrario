import { useState, useRef, useEffect } from 'react';
import './PreviewPlayer.css';

export default function PreviewPlayer({ src, titulo, duracao }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => setDuration(audio.duration);
    const onTime = () => setCurrentTime(audio.currentTime);
    const onEnded = () => { setPlaying(false); setCurrentTime(0); };
    const onError = () => setErro(true);

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [src]);

  function togglePlay() {
    if (erro) return;
    const audio = audioRef.current;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => setErro(true));
    }
    setPlaying(!playing);
  }

  function formatTime(s) {
    if (!s || isNaN(s)) return '0:00';
    const min = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const tempoExibido = duration > 0 ? formatTime(duration) : (duracao || '—');

  return (
    <div className="preview-player">
      <audio ref={audioRef} src={src} preload="metadata" />

      <button
        className="preview-player__play"
        onClick={togglePlay}
        disabled={erro}
        aria-label={playing ? 'Pausar prévia' : 'Tocar prévia'}
      >
        {playing ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        )}
      </button>

      <div className="preview-player__info">
        <div className="preview-player__titulo">
          {titulo}
          <span className="preview-player__badge">PRÉVIA</span>
        </div>
        <div className="preview-player__track">
          <div className="preview-player__fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <span className="preview-player__tempo">
        {playing || currentTime > 0 ? formatTime(currentTime) : tempoExibido}
      </span>
    </div>
  );
}
