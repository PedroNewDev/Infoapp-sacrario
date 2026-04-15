import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import api from '../services/api';
import Header from '../components/layout/Header';
import './Jornada.css';

export default function Jornada() {
  const [progresso, setProgresso] = useState(null);
  const navigate = useNavigate();
  const { usuario } = useUser();

  useEffect(() => {
    api.get('/jornada/progresso').then(r => setProgresso(r.data)).catch(() => {});
  }, []);

  const diasConcluidos = progresso?.diasConcluidos || [];
  const diaAtual = progresso?.diaAtual || 1;

  function getStatus(dia) {
    if (diasConcluidos.includes(dia)) return 'concluido';
    if (dia === diaAtual) return 'atual';
    if (dia < diaAtual) return 'disponivel';
    return 'bloqueado';
  }

  function handleClick(dia) {
    const status = getStatus(dia);
    if (status !== 'bloqueado') {
      navigate(`/jornada/${dia}`);
    }
  }

  const blocos = [
    { nome: 'Acolhimento', sub: '"Nos Braços de Maria"', dias: [1, 2, 3, 4, 5, 6, 7] },
    { nome: 'Transformação', sub: '"A Frequência da Oração"', dias: [8, 9, 10, 11, 12, 13, 14] },
    { nome: 'Consagração', sub: '"A Frequência de Maria"', dias: [15, 16, 17, 18, 19, 20, 21] },
  ];

  return (
    <div className="jornada-page">
      <Header />
      <div className="page-container">
        <h2 className="jornada-page__title">Sua Jornada de 21 Dias</h2>
        <div className="ornament">✦</div>

        {blocos.map(bloco => (
          <div key={bloco.nome} className="jornada-page__bloco fade-in">
            <h3 className="jornada-page__bloco-nome">{bloco.nome}</h3>
            <p className="jornada-page__bloco-sub">{bloco.sub}</p>

            <div className="jornada-page__grid">
              {bloco.dias.map(dia => {
                const status = getStatus(dia);
                return (
                  <button
                    key={dia}
                    className={`jornada-page__dia jornada-page__dia--${status}`}
                    onClick={() => handleClick(dia)}
                    disabled={status === 'bloqueado'}
                  >
                    {status === 'concluido' && <span className="jornada-page__check">✓</span>}
                    {status === 'bloqueado' && <span className="jornada-page__lock">🔒</span>}
                    {(status === 'atual' || status === 'disponivel') && <span className="jornada-page__num">{dia}</span>}
                    {status === 'concluido' && <span className="jornada-page__num">{dia}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Mistérios Extras — conteúdo bloqueado pós-jornada */}
        {progresso?.jornadaCompleta && !usuario?.acesso_vitalicio && (
          <div className="jornada-page__extras fade-in">
            <h3 className="jornada-page__extras-title">Mistérios Extras</h3>
            <p className="jornada-page__extras-sub">Conteúdos exclusivos para consagradas</p>

            {['Oração de Entrega Total', 'Meditação dos 7 Dons', 'Consagração Perpétua'].map((titulo, i) => (
              <div key={i} className="jornada-page__extra-card">
                <span className="jornada-page__extra-lock">🔒</span>
                <div className="jornada-page__extra-info">
                  <strong>{titulo}</strong>
                  <span>Este mistério aguarda sua consagração eterna</span>
                </div>
                <button
                  className="jornada-page__extra-cta"
                  onClick={() => navigate('/consagracao-eterna')}
                >
                  Desbloquear
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
