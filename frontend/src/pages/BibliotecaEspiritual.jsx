import { useState } from 'react';
import Header from '../components/layout/Header';
import {
  oracoesTradicionais,
  oracoesEspeciais,
  reflexoesSantos
} from '../content/biblioteca';
import './BibliotecaEspiritual.css';

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
  return (
    <div className="biblioteca-page">
      <Header />
      <div className="page-container">
        <div className="biblioteca-page__intro fade-in">
          <div className="biblioteca-page__icon">📖</div>
          <h2 className="biblioteca-page__title">Biblioteca Espiritual</h2>
          <div className="ornament">✦</div>
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
