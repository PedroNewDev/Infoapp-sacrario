import { useState, useRef, useEffect } from 'react';
import './AudioPlayer.css';

export default function AudioPlayer({ src, titulo }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => setDuration(audio.duration);
    const onTime = () => setCurrentTime(audio.currentTime);
    const onEnded = () => setPlaying(false);

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnded);
    };
  }, [src]);

  function togglePlay() {
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  }

  function seek(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    audioRef.current.currentTime = pct * duration;
  }

  function skip(seconds) {
    audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
  }

  function formatTime(s) {
    if (!s || isNaN(s)) return '0:00';
    const min = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={src} preload="metadata" />

      {titulo && <p className="audio-player__titulo">{titulo}</p>}

      <div className="audio-player__progress" onClick={seek}>
        <div className="audio-player__track">
          <div className="audio-player__fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="audio-player__times">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div className="audio-player__controls">
        <button className="audio-player__btn" onClick={() => skip(-10)} aria-label="Voltar 10s">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12.5 3C17.15 3 21.08 6.03 22.45 10.22L20.08 11C19.04 7.63 15.97 5.18 12.35 5.02L12.5 5V2L8 5.5L12.5 9V6C15.75 6.2 18.45 8.35 19.35 11.29L21.69 10.52C20.54 6.54 16.86 3.68 12.5 3.02V3ZM11 16.5V10.5H12.5V16.5H11ZM7.5 16.5V12.5H6V11.5L7.5 10.5H9V16.5H7.5Z"/></svg>
        </button>
        <button className="audio-player__btn audio-player__btn--play" onClick={togglePlay} aria-label={playing ? 'Pausar' : 'Tocar'}>
          {playing ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>
        <button className="audio-player__btn" onClick={() => skip(10)} aria-label="Avançar 10s">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M11.5 3V2L16 5.5L11.5 9V6C8.25 6.2 5.55 8.35 4.65 11.29L2.31 10.52C3.46 6.54 7.14 3.68 11.5 3.02V3ZM11.5 5.02L11.65 5C8.03 5.18 4.96 7.63 3.92 11L1.55 10.22C2.92 6.03 6.85 3 11.5 3V5.02ZM13 10.5H14.5V16.5H13V10.5ZM16 12.5V16.5H17.5V10.5L16 11.5V12.5Z"/></svg>
        </button>
      </div>
    </div>
  );
}
