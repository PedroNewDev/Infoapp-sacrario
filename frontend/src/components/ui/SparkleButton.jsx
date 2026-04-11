import './SparkleButton.css';

export default function SparkleButton({ children, onClick, fullWidth }) {
  return (
    <button
      className={`sparkle-btn ${fullWidth ? 'sparkle-btn--full' : ''}`}
      onClick={onClick}
    >
      <span className="sparkle-btn__label">{children}</span>
      <span className="sparkle-btn__p sp-1" aria-hidden="true">✦</span>
      <span className="sparkle-btn__p sp-2" aria-hidden="true">✦</span>
      <span className="sparkle-btn__p sp-3" aria-hidden="true">✦</span>
      <span className="sparkle-btn__p sp-4" aria-hidden="true">✦</span>
      <span className="sparkle-btn__p sp-5" aria-hidden="true">✦</span>
      <span className="sparkle-btn__p sp-6" aria-hidden="true">✦</span>
    </button>
  );
}
