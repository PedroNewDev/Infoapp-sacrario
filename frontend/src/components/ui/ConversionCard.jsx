import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import './ConversionCard.css';

export default function ConversionCard({ variante = 'pos-oracao' }) {
  const { usuario } = useUser();
  const navigate = useNavigate();

  if (!usuario || usuario.acesso_vitalicio) return null;

  const frases = {
    'pos-oracao': {
      texto: 'Este momento de paz pode ser eterno.',
      subtexto: 'Consagre sua jornada para sempre.',
      cta: 'Conhecer acesso eterno →'
    },
    'pos-jornada': {
      texto: 'Sua consagração foi concluída.',
      subtexto: 'Mas a graça não precisa ter fim.',
      cta: 'Eternize sua consagração →'
    },
    'pos-rosario': {
      texto: 'Maria sorriu por cada Ave Maria.',
      subtexto: 'Continue rezando para sempre no seu sacrário.',
      cta: 'Proteja sua jornada →'
    },
    'audio-bloqueado': {
      texto: 'Esta meditação aguarda sua consagração.',
      subtexto: 'Aprofunde cada mistério com áudio guiado.',
      cta: 'Desbloquear meditações →'
    }
  };

  const frase = frases[variante] || frases['pos-oracao'];

  return (
    <div
      className="conversion-card"
      onClick={() => navigate('/consagracao-eterna')}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') navigate('/consagracao-eterna'); }}
    >
      <div className="conversion-card__glow" />
      <p className="conversion-card__texto">{frase.texto}</p>
      <p className="conversion-card__subtexto">{frase.subtexto}</p>
      <span className="conversion-card__cta">{frase.cta}</span>
    </div>
  );
}
