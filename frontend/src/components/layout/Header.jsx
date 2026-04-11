import './Header.css';

export default function Header({ showAvatar, onAvatarClick }) {
  return (
    <header className="header">
      {showAvatar && (
        <button className="header__avatar" onClick={onAvatarClick} aria-label="Perfil">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </button>
      )}
      <div className="header__logo">
        <span className="header__icon">✦</span>
        <h1 className="header__title">Sacrário do Rosário</h1>
      </div>
    </header>
  );
}
