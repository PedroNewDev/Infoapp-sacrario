import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import './CountdownBar.css';

export default function CountdownBar() {
  const { usuario } = useUser();
  const navigate = useNavigate();

  if (!usuario || usuario.acesso_vitalicio) return null;

  const diasRestantes = usuario.diasRestantes;
  if (diasRestantes == null || diasRestantes < 0) return null;

  const totalDias = 45;
  const diasPassados = totalDias - diasRestantes;
  const percentualRestante = Math.max(0, Math.min(100, Math.round((diasRestantes / totalDias) * 100)));

  let faixa, texto, icone;

  if (diasRestantes <= 0) {
    faixa = 'urgente';
    icone = '🕯️';
    texto = 'Seu tempo se cumpriu · Garanta seu acesso eterno »';
  } else if (diasRestantes === 1) {
    faixa = 'urgente';
    icone = '🕯️';
    texto = 'Último dia de graça · Sua chama precisa de você »';
  } else if (diasRestantes <= 3) {
    faixa = 'urgente';
    icone = '🕯️';
    texto = `Restam ${diasRestantes} dias de graça · Não deixe a chama se apagar »`;
  } else if (diasRestantes <= 7) {
    faixa = 'alerta';
    icone = '🕯️';
    texto = `${diasRestantes} dias de graça restam · Eternize sua consagração »`;
  } else if (diasRestantes <= 14) {
    faixa = 'atencao';
    icone = '🕯️';
    texto = `${diasRestantes} auroras restam neste sacrário · Proteja sua chama`;
  } else if (diasRestantes <= 30) {
    faixa = 'desperta';
    icone = '✦';
    texto = `${diasRestantes} dias de bênção restam nesta jornada`;
  } else {
    faixa = 'sereno';
    icone = '✦';
    texto = `Sua graça caminha por mais ${diasRestantes} dias`;
  }

  function handleClick() {
    navigate('/consagracao-eterna');
  }

  return (
    <div
      className={`countdown-bar countdown-bar--${faixa}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') handleClick(); }}
    >
      <div className="countdown-bar__content">
        <span className="countdown-bar__icon">{icone}</span>
        <span className="countdown-bar__text">{texto}</span>
      </div>
      <div className="countdown-bar__progress-track">
        <div
          className={`countdown-bar__progress-fill countdown-bar__progress-fill--${faixa}`}
          style={{ width: `${percentualRestante}%` }}
        />
      </div>
    </div>
  );
}
