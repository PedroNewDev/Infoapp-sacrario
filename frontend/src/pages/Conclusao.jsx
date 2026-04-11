import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/ui/Button';
import './Conclusao.css';

export default function Conclusao() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ dias: 0, rosarios: 0, intencoes: 0 });
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const [jornadaRes, rosarioRes] = await Promise.all([
          api.get('/jornada/progresso'),
          api.get('/rosario/contagem')
        ]);

        const progresso = jornadaRes.data.progresso || [];
        const diasConcluidos = progresso.filter(p => p.concluido).length;
        const intencoes = progresso.filter(p => p.intencao_texto).length;
        const rosarios = rosarioRes.data.total || 0;

        setStats({ dias: diasConcluidos, rosarios, intencoes });
      } catch {
        // silencioso
      } finally {
        setCarregando(false);
      }
    }
    carregarDados();
  }, []);

  if (carregando) {
    return (
      <div className="conclusao-page">
        <span className="loading-spinner" style={{ width: 32, height: 32 }} />
      </div>
    );
  }

  return (
    <div className="conclusao-page">
      <div className="conclusao-page__content fade-in">
        <div className="conclusao-page__selo">🌹</div>

        <h1 className="conclusao-page__title">Consagrada ao Imaculado Coração de Maria</h1>
        <p className="conclusao-page__subtitle">21 Dias de Oração — Jornada Completa</p>
        <div className="ornament">✦</div>

        <div className="conclusao-page__stats">
          <div className="conclusao-page__stat">
            <span className="conclusao-page__stat-valor">{stats.dias}</span>
            <span className="conclusao-page__stat-label">Dias concluídos</span>
          </div>
          <div className="conclusao-page__stat">
            <span className="conclusao-page__stat-valor">{stats.rosarios}</span>
            <span className="conclusao-page__stat-label">Rosários rezados</span>
          </div>
          <div className="conclusao-page__stat">
            <span className="conclusao-page__stat-valor">{stats.intencoes}</span>
            <span className="conclusao-page__stat-label">Intenções</span>
          </div>
        </div>

        <p className="conclusao-page__texto">
          Você completou os 21 dias de consagração. Cada Ave Maria foi ouvida.
          Cada intenção, acolhida. A Frequência de Maria agora vibra forte no seu coração.
          A jornada não acaba aqui — ela se torna parte de quem você é.
        </p>

        <div className="conclusao-page__acoes">
          <Button onClick={() => navigate('/rosario')} fullWidth>
            CONTINUAR REZANDO »
          </Button>
          <Button variant="secondary" onClick={() => navigate('/home')} fullWidth>
            Voltar ao Início
          </Button>
        </div>

        <p className="conclusao-page__footer">
          Imaculado Coração de Maria, sede o nosso refúgio e o caminho que nos conduz a Deus.
        </p>
      </div>
    </div>
  );
}
