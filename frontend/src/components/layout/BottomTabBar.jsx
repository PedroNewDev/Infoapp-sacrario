import { useLocation, useNavigate } from 'react-router-dom';
import './BottomTabBar.css';

const tabs = [
  { path: '/', label: 'Início', icon: 'home' },
  { path: '/jornada', label: 'Jornada', icon: 'calendar' },
  { path: '/rosario', label: 'Rosário', icon: 'rosary' },
  { path: '/comunidade', label: 'Comunidade', icon: 'people' },
  { path: '/perfil', label: 'Perfil', icon: 'perfil' },
];

const icons = {
  home: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
  calendar: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/></svg>,
  rosary: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="3" r="2"/><circle cx="12" cy="21" r="2"/><circle cx="3" cy="12" r="2"/><circle cx="21" cy="12" r="2"/><circle cx="12" cy="12" r="3"/></svg>,
  people: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>,
  perfil: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>,
};

export default function BottomTabBar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="tab-bar">
      {tabs.map(tab => {
        const active = location.pathname === tab.path ||
          (tab.path !== '/' && location.pathname.startsWith(tab.path));
        return (
          <button
            key={tab.path}
            className={`tab-bar__item ${active ? 'tab-bar__item--active' : ''}`}
            onClick={() => navigate(tab.path)}
            aria-label={tab.label}
          >
            <span className="tab-bar__icon">{icons[tab.icon]}</span>
            <span className="tab-bar__label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
