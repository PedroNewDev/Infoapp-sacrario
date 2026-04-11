import './ProgressBar.css';

export default function ProgressBar({ percentual }) {
  return (
    <div className="progress-bar">
      <div className="progress-bar__track">
        <div className="progress-bar__fill" style={{ width: `${percentual}%` }} />
      </div>
      <span className="progress-bar__label">{percentual}% Concluído</span>
    </div>
  );
}
