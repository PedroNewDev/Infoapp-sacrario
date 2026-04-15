import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useUser } from '../context/UserContext';
import { diasConteudo } from '../content/dias';
import AudioPlayer from '../components/ui/AudioPlayer';
import AudioLockedCard from '../components/ui/AudioLockedCard';
import ConversionCard from '../components/ui/ConversionCard';
import Button from '../components/ui/Button';
import './DiaDaJornada.css';

export default function DiaDaJornada() {
  const { dia: diaParam } = useParams();
  const dia = parseInt(diaParam);
  const navigate = useNavigate();
  const { usuario } = useUser();
  const [intencao, setIntencao] = useState('');
  const [concluido, setConcluido] = useState(false);
  const [concluindo, setConcluindo] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [voltouDoRosario, setVoltouDoRosario] = useState(false);

  const conteudo = diasConteudo[dia - 1];

  useEffect(() => {
    // Verificar se o dia já foi concluído
    api.get('/jornada/progresso').then(r => {
      const jaFez = r.data.diasConcluidos?.includes(dia);
      if (jaFez) setConcluido(true);
      // Verificar se voltou do rosário (via sessionStorage)
      if (sessionStorage.getItem(`rosario_dia_${dia}`)) {
        setVoltouDoRosario(true);
        sessionStorage.removeItem(`rosario_dia_${dia}`);
      }
    }).catch(() => {});
  }, [dia]);

  async function concluirDia() {
    if (!intencao.trim()) return;
    setConcluindo(true);
    try {
      const { data } = await api.post('/jornada/concluir', { dia, intencao_texto: intencao });
      setConcluido(true);
      setShowCelebration(true);
      if (data.jornadaCompleta) {
        setTimeout(() => navigate('/conclusao'), 2500);
      } else {
        setTimeout(() => setShowCelebration(false), 2500);
      }
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao concluir o dia');
    } finally {
      setConcluindo(false);
    }
  }

  function irParaRosario() {
    sessionStorage.setItem(`rosario_dia_${dia}`, '1');
    navigate('/rosario', { state: { misterioDestaque: conteudo?.misterio_destaque, fromJornada: dia } });
  }

  if (!conteudo) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: 80 }}>
        <p>Dia não encontrado</p>
        <Button onClick={() => navigate('/jornada')}>Voltar à Jornada</Button>
      </div>
    );
  }

  return (
    <div className="dia-page">
      {showCelebration && (
        <div className="dia-page__celebration">
          <div className="dia-page__celebration-content fade-in">
            <span style={{ fontSize: 64 }}>✓</span>
            <h2>Dia {dia} Concluído!</h2>
            <p>Maria sorriu por cada Ave Maria que você rezou hoje.</p>
          </div>
        </div>
      )}

      <div className="page-container">
        {/* Header */}
        <div className="dia-page__header fade-in">
          <button className="dia-page__back" onClick={() => navigate('/jornada')}>←</button>
          <div className="dia-page__header-center">
            <span className="dia-page__ornament">— ✦ —</span>
            <h1 className="dia-page__dia">Dia {dia}</h1>
            <span className="dia-page__ornament">— ✦ —</span>
          </div>
        </div>

        <h2 className="dia-page__titulo fade-in">{conteudo.titulo}</h2>
        <p className="dia-page__misterio fade-in">Mistério em Destaque: {conteudo.misterio_destaque}</p>

        {/* Imagem devocional (placeholder) */}
        <div className="dia-page__imagem fade-in">
          <div className="dia-page__imagem-placeholder">
            <span>🌹</span>
          </div>
        </div>

        {/* Player de áudio */}
        <div className="fade-in">
          <AudioPlayer
            src={`/media/audio/dia_${String(dia).padStart(2, '0')}.mp3`}
            titulo={conteudo.titulo_audio || conteudo.titulo}
          />
        </div>

        {/* Reflexão */}
        <div className="dia-page__reflexao fade-in">
          <h3>Reflexão</h3>
          {conteudo.reflexao.split('\n\n').map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {/* Botão rezar rosário */}
        {!concluido && (
          <div className="fade-in">
            <Button onClick={irParaRosario} fullWidth>
              REZAR O ROSÁRIO »
            </Button>
          </div>
        )}

        {/* Intenção (aparece após voltar do rosário ou sempre se dia concluído) */}
        {(voltouDoRosario || concluido) && (
          <div className="dia-page__intencao fade-in">
            <h3>Minha Intenção Hoje</h3>
            {concluido ? (
              <p className="dia-page__intencao-salva">Dia concluído ✓</p>
            ) : (
              <>
                <div className="dia-page__intencao-field">
                  <span className="dia-page__intencao-icon">🌹</span>
                  <textarea
                    value={intencao}
                    onChange={e => setIntencao(e.target.value)}
                    placeholder={conteudo.sugestao_intencao || 'Escreva aqui a sua intenção de oração...'}
                    maxLength={250}
                    rows={3}
                  />
                </div>
                <span className="dia-page__intencao-count">{intencao.length}/250</span>

                <Button onClick={concluirDia} fullWidth disabled={!intencao.trim() || concluindo}>
                  {concluindo ? <span className="loading-spinner" style={{ width: 20, height: 20 }} /> : 'CONCLUIR E REZAR »'}
                </Button>
              </>
            )}
          </div>
        )}

        {/* Sugestão para rezar o rosário primeiro */}
        {!voltouDoRosario && !concluido && (
          <p className="dia-page__hint fade-in">
            Após ouvir a meditação, reze o Rosário completo e volte para registrar sua intenção.
          </p>
        )}

        {/* Card de áudio bloqueado */}
        {!usuario?.modulo_audio && (
          <div className="fade-in" style={{ marginTop: 'var(--space-md)' }}>
            <AudioLockedCard dia={dia} titulo={conteudo.titulo} />
          </div>
        )}

        {/* Conversion card pós-conclusão do dia */}
        {concluido && !showCelebration && (
          <div className="fade-in" style={{ marginTop: 'var(--space-md)' }}>
            <ConversionCard variante="pos-oracao" />
          </div>
        )}
      </div>
    </div>
  );
}
