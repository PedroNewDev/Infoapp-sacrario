import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useUser } from '../context/UserContext';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import { misterios, ordemConjuntos, gerarContasConjunto } from '../content/oracoes';
import './Rosario.css';

export default function Rosario() {
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario } = useUser();
  const misterioDestaque = location.state?.misterioDestaque || null;
  const fromJornada = location.state?.fromJornada || null;

  const [conjuntoAtual, setConjuntoAtual] = useState(0); // 0=gozosos, 1=luminosos, 2=dolorosos, 3=gloriosos
  const [contas, setContas] = useState([]);
  const [contaIndex, setContaIndex] = useState(0);
  const [modoSilencioso, setModoSilencioso] = useState(false);
  const [totalRosarios, setTotalRosarios] = useState(0);
  const [concluido, setConcluido] = useState(false);
  const [conjuntosConcluidos, setConjuntosConcluidos] = useState([]);

  // Carregar contagem de rosários
  useEffect(() => {
    api.get('/rosario/contagem').then(r => setTotalRosarios(r.data.totalRosarios)).catch(() => {});
  }, []);

  // Gerar contas quando muda o conjunto
  useEffect(() => {
    const novasContas = gerarContasConjunto(ordemConjuntos[conjuntoAtual], conjuntoAtual);
    setContas(novasContas);
    setContaIndex(0);
  }, [conjuntoAtual]);

  const contaAtual = contas[contaIndex];

  // Calcular dezena atual e progresso
  const dezenaAtual = contaAtual?.dezena || 0;
  const contasNaDezena = contas.filter(c => c.dezena === dezenaAtual && c.tipo === 'aveMaria');
  const aveMariasRezadas = contas
    .slice(0, contaIndex + 1)
    .filter(c => c.dezena === dezenaAtual && c.tipo === 'aveMaria').length;

  // Verificar se o mistério atual é o destaque da jornada
  function isMisterioDestaque(dezenaNum) {
    if (!misterioDestaque) return false;
    const conjunto = misterios[ordemConjuntos[conjuntoAtual]];
    const dezena = conjunto.dezenas[dezenaNum - 1];
    if (!dezena) return false;
    return misterioDestaque.includes(dezena.titulo) || misterioDestaque.includes(`${dezenaNum}º`);
  }

  // Avançar para próxima conta
  async function registrarConjunto(conjuntoKey) {
    try {
      const { data } = await api.post('/rosario/registrar', { misterio: conjuntoKey });
      setTotalRosarios(data.totalRosarios);
    } catch {}
  }

  const avancar = useCallback(() => {
    if (contaIndex < contas.length - 1) {
      setContaIndex(prev => prev + 1);
    } else {
      // Conjunto concluído — registrar como 1 rosário
      const conjuntoKey = ordemConjuntos[conjuntoAtual];
      registrarConjunto(conjuntoKey);

      const novosConcluidos = [...conjuntosConcluidos, conjuntoAtual];
      setConjuntosConcluidos(novosConcluidos);

      if (conjuntoAtual < 3) {
        setConjuntoAtual(prev => prev + 1);
      } else {
        setConcluido(true);
      }
    }
  }, [contaIndex, contas.length, conjuntoAtual, conjuntosConcluidos]);

  function voltarParaJornada() {
    if (fromJornada) {
      navigate(`/jornada/${fromJornada}`);
    } else {
      navigate('/');
    }
  }

  // Dev: expor funções de teste no window
  useEffect(() => {
    if (import.meta.env.DEV) {
      window.__DEV_COMPLETE_ROSARIO = async () => {
        for (const key of ordemConjuntos) {
          try { await api.post('/rosario/registrar', { misterio: key }); } catch {}
        }
        const { data } = await api.get('/rosario/contagem');
        setTotalRosarios(data.totalRosarios);
        setConjuntosConcluidos([0, 1, 2, 3]);
        setConcluido(true);
      };
      window.__DEV_SKIP_TO_CONJUNTO = (i) => {
        const concluidos = Array.from({ length: i }, (_, idx) => idx);
        setConjuntosConcluidos(concluidos);
        setConjuntoAtual(i);
      };
    }
    return () => {
      delete window.__DEV_COMPLETE_ROSARIO;
      delete window.__DEV_SKIP_TO_CONJUNTO;
    };
  }, []);

  // Tela de conclusão — celebração completa
  if (concluido) {
    return (
      <div className="rosario-page">
        <div className="page-container">
          <div className="rosario-page__conclusao fade-in">
            {/* Partículas douradas */}
            <div className="rosario-page__particulas">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} className="rosario-page__particula" style={{ animationDelay: `${i * 0.3}s`, left: `${8 + (i * 7.5)}%` }}>✦</span>
              ))}
            </div>

            <div className="rosario-page__selo-conclusao">🌹</div>

            <h2>Rosário Completo!</h2>
            <p className="rosario-page__conclusao-frase">
              Você rezou os 4 Mistérios do Santo Rosário.<br />
              Maria sorriu por cada Ave Maria que saiu do seu coração.
            </p>

            <div className="ornament">✦</div>

            <div className="rosario-page__conclusao-stats">
              <div className="rosario-page__conclusao-stat">
                <span className="rosario-page__conclusao-stat-valor">4</span>
                <span className="rosario-page__conclusao-stat-label">Mistérios</span>
              </div>
              <div className="rosario-page__conclusao-stat">
                <span className="rosario-page__conclusao-stat-valor">20</span>
                <span className="rosario-page__conclusao-stat-label">Dezenas</span>
              </div>
              <div className="rosario-page__conclusao-stat">
                <span className="rosario-page__conclusao-stat-valor">200</span>
                <span className="rosario-page__conclusao-stat-label">Ave Marias</span>
              </div>
            </div>

            <div className="rosario-page__conclusao-total-box">
              <span>📿</span>
              <p>Total de Rosários rezados: <strong>{totalRosarios}</strong></p>
            </div>

            <p className="rosario-page__conclusao-mensagem">
              "Nunca recitarás o Rosário sem receber alguma graça."
            </p>
            <p className="rosario-page__conclusao-autor">— São Luís de Montfort</p>

            {/* Oferta — só aparece se não tem acesso vitalício */}
            {!usuario?.acesso_vitalicio && (
              <div className="rosario-page__oferta fade-in">
                <span className="rosario-page__oferta-icon">👑</span>
                <h3 className="rosario-page__oferta-titulo">Continue rezando para sempre</h3>
                <p className="rosario-page__oferta-texto">
                  Garanta seu acesso vitalício ao Sacrário e nunca perca seu progresso, suas intenções e seus rosários.
                </p>
                <Button onClick={() => window.open('https://pay.exemplo.com.br/vitalicio', '_blank')} fullWidth>
                  GARANTIR ACESSO VITALÍCIO »
                </Button>
              </div>
            )}

            <div className="rosario-page__conclusao-acoes">
              {fromJornada ? (
                <Button onClick={voltarParaJornada} fullWidth>
                  VOLTAR AO DIA {fromJornada} »
                </Button>
              ) : (
                <Button onClick={() => navigate('/')} fullWidth>
                  VOLTAR AO INÍCIO »
                </Button>
              )}
              <Button variant="ghost" onClick={() => {
                setConcluido(false);
                setConjuntosConcluidos([]);
                setConjuntoAtual(0);
              }} fullWidth>
                Rezar Novamente
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const conjuntoKey = ordemConjuntos[conjuntoAtual];
  const conjuntoInfo = misterios[conjuntoKey];

  return (
    <div className="rosario-page">
      <Header />
      <div className="page-container">
        <h2 className="rosario-page__title fade-in">Rosário Virtual</h2>
        <p className="rosario-page__contador">Rosários rezados: {totalRosarios}</p>

        {/* Seletor de modo */}
        <div className="rosario-page__modo fade-in">
          <button
            className={`rosario-page__modo-btn ${!modoSilencioso ? 'rosario-page__modo-btn--active' : ''}`}
            onClick={() => setModoSilencioso(false)}
          >
            Com Texto
          </button>
          <button
            className={`rosario-page__modo-btn ${modoSilencioso ? 'rosario-page__modo-btn--active' : ''}`}
            onClick={() => setModoSilencioso(true)}
          >
            Silencioso
          </button>
        </div>

        {/* Seletor de Mistérios (indicador do conjunto atual) */}
        <div className="rosario-page__misterios fade-in">
          {ordemConjuntos.map((key, i) => (
            <button
              key={key}
              className={`rosario-page__misterio-btn ${i === conjuntoAtual ? 'rosario-page__misterio-btn--active' : ''} ${conjuntosConcluidos.includes(i) ? 'rosario-page__misterio-btn--done' : ''}`}
              onClick={() => {
                if (i === conjuntoAtual) return;
                setConjuntoAtual(i);
              }}
            >
              {conjuntosConcluidos.includes(i) ? '✓ ' : ''}
              {misterios[key].nome.replace('Mistérios ', '')}
            </button>
          ))}
        </div>

        {/* Info do mistério/conjunto atual */}
        <div className="rosario-page__misterio-info fade-in">
          <h3 className="rosario-page__misterio-nome">{conjuntoInfo.nome}</h3>
          <p className="rosario-page__misterio-desc">{conjuntoInfo.subtitulo}</p>
        </div>

        {/* Progresso das dezenas */}
        <div className="rosario-page__dezena-progresso fade-in">
          {[1, 2, 3, 4, 5].map(d => {
            const dezenaContas = contas.filter(c => c.dezena === d);
            const ultimaConta = dezenaContas[dezenaContas.length - 1];
            const ultimoIndex = contas.indexOf(ultimaConta);
            const done = ultimoIndex >= 0 && contaIndex > ultimoIndex;
            const current = dezenaAtual === d;
            return (
              <div
                key={d}
                className={`rosario-page__dezena-dot ${done ? 'rosario-page__dezena-dot--done' : ''} ${current ? 'rosario-page__dezena-dot--current' : ''}`}
              />
            );
          })}
        </div>

        {/* Contas visuais da dezena atual */}
        {dezenaAtual > 0 && (
          <div className="rosario-page__contas fade-in">
            {contas
              .filter(c => c.dezena === dezenaAtual && c.tipo === 'aveMaria')
              .map((c, i) => {
                const globalIndex = contas.indexOf(c);
                const rezada = globalIndex < contaIndex;
                const atual = globalIndex === contaIndex;
                return (
                  <div
                    key={i}
                    className={`rosario-page__conta ${rezada ? 'rosario-page__conta--rezada' : ''} ${atual ? 'rosario-page__conta--atual' : ''}`}
                  >
                    {rezada ? '✓' : i + 1}
                  </div>
                );
              })}
          </div>
        )}

        {/* Enunciado do Mistério */}
        {contaAtual?.tipo === 'misterio' && (
          <div className={`rosario-page__oracao fade-in ${isMisterioDestaque(contaAtual.dezena) ? 'rosario-page__oracao--destaque' : ''}`}>
            <p className="rosario-page__oracao-nome">
              {contaAtual.dezena}ª Dezena — {conjuntoInfo.nome.replace('Mistérios ', '')}
            </p>
            <h3 className="rosario-page__oracao-nome" style={{ fontSize: 18, marginBottom: 8 }}>
              {contaAtual.titulo}
            </h3>
            {!modoSilencioso && (
              <p className="rosario-page__oracao-texto">{contaAtual.contemplacao}</p>
            )}
            {isMisterioDestaque(contaAtual.dezena) && (
              <p style={{ fontSize: 12, color: 'var(--gold-primary)', marginTop: 8, fontWeight: 600 }}>
                ✦ Mistério em Destaque do Dia ✦
              </p>
            )}
          </div>
        )}

        {/* Oração atual */}
        {contaAtual?.oracao && !modoSilencioso && (
          <div className="rosario-page__oracao fade-in">
            <p className="rosario-page__oracao-nome">{contaAtual.oracao.nome}</p>
            <p className="rosario-page__oracao-texto">{contaAtual.oracao.texto}</p>
          </div>
        )}

        {/* Nome da oração em modo silencioso */}
        {contaAtual?.oracao && modoSilencioso && (
          <div className="rosario-page__oracao fade-in">
            <p className="rosario-page__oracao-nome">{contaAtual.oracao.nome}</p>
            {contaAtual.tipo === 'aveMaria' && dezenaAtual > 0 && (
              <p className="rosario-page__oracao-texto" style={{ fontSize: 13 }}>
                Ave Maria {contaAtual.numero} de 10
              </p>
            )}
          </div>
        )}

        {/* Status */}
        <p className="rosario-page__status fade-in">
          {contaIndex + 1} de {contas.length} — {conjuntoInfo.nome}
        </p>

        {/* Botão de avançar */}
        <div className="rosario-page__avancar fade-in">
          <button className="rosario-page__avancar-btn" onClick={avancar}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
