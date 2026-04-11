import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import api from '../services/api';
import Button from '../components/ui/Button';
import './Onboarding.css';

export default function Onboarding() {
  const { usuario, atualizarUsuario } = useUser();
  const navigate = useNavigate();
  const [passo, setPasso] = useState(1);
  const [nome, setNome] = useState(usuario?.nome || '');
  const [intencao, setIntencao] = useState('');
  const [horario, setHorario] = useState('07:00');
  const [carregando, setCarregando] = useState(false);

  async function concluirOnboarding() {
    setCarregando(true);
    try {
      await api.put('/usuario/onboarding', {
        nome,
        intencao_principal: intencao,
        horario_notificacao: horario
      });
      await atualizarUsuario({
        nome,
        intencao_principal: intencao,
        horario_notificacao: horario,
        onboarding_completo: true
      });
      navigate('/');
    } catch {
      navigate('/');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="onboarding">
      <div className="onboarding__progress">
        {[1, 2, 3, 4].map(n => (
          <div key={n} className={`onboarding__dot ${n <= passo ? 'onboarding__dot--active' : ''}`} />
        ))}
      </div>

      <div className="onboarding__content fade-in" key={passo}>
        {passo === 1 && (
          <>
            <h2 className="onboarding__heading">Você é a {usuario?.nome || 'devota'}?</h2>
            <p className="onboarding__sub">Confirme ou edite seu nome</p>
            <div className="onboarding__field">
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Seu nome"
                autoFocus
              />
            </div>
            <Button onClick={() => setPasso(2)} fullWidth disabled={!nome.trim()}>
              CONTINUAR »
            </Button>
          </>
        )}

        {passo === 2 && (
          <>
            <h2 className="onboarding__heading">Qual a sua maior intenção de oração?</h2>
            <p className="onboarding__sub">Escreva livremente o que traz ao seu coração</p>
            <div className="onboarding__field">
              <textarea
                value={intencao}
                onChange={e => setIntencao(e.target.value)}
                placeholder="Ex: Paz na minha família, cura de um ente querido..."
                rows={4}
                maxLength={250}
                autoFocus
              />
              <span className="onboarding__count">{intencao.length}/250</span>
            </div>
            <Button onClick={() => setPasso(3)} fullWidth disabled={!intencao.trim()}>
              CONTINUAR »
            </Button>
            <button className="onboarding__back" onClick={() => setPasso(1)}>Voltar</button>
          </>
        )}

        {passo === 3 && (
          <>
            <h2 className="onboarding__heading">Que horário deseja receber o lembrete diário?</h2>
            <p className="onboarding__sub">Escolha o melhor momento para a sua oração</p>
            <div className="onboarding__field">
              <input
                type="time"
                value={horario}
                onChange={e => setHorario(e.target.value)}
                className="onboarding__time"
              />
            </div>
            <Button onClick={() => setPasso(4)} fullWidth>
              CONTINUAR »
            </Button>
            <button className="onboarding__back" onClick={() => setPasso(2)}>Voltar</button>
          </>
        )}

        {passo === 4 && (
          <div className="onboarding__final">
            <div className="onboarding__final-icon">🌹</div>
            <h2 className="onboarding__heading">Maria está esperando por você...</h2>
            <p className="onboarding__sub">
              Nos próximos 21 dias, você vai sintonizar na Frequência de Maria.
              Cada oração, cada silêncio, cada conta do terço — tudo constrói esse encontro.
            </p>
            <div className="ornament">✦</div>
            <Button onClick={concluirOnboarding} fullWidth disabled={carregando}>
              {carregando ? <span className="loading-spinner" style={{ width: 20, height: 20 }} /> : 'COMEÇAR MINHA JORNADA »'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
