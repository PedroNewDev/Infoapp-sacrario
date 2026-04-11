import { useState, useEffect } from 'react';
import api from '../services/api';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import './Comunidade.css';

function formatarData(dataStr) {
  const data = new Date(dataStr);
  const agora = new Date();
  const diff = agora - data;
  const horas = Math.floor(diff / (1000 * 60 * 60));
  if (horas < 1) return 'Agora há pouco';
  if (horas < 24) return `${horas}h atrás`;
  const dias = Math.floor(horas / 24);
  if (dias === 1) return 'Ontem';
  if (dias < 7) return `${dias} dias atrás`;
  return data.toLocaleDateString('pt-BR');
}

function AbaPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [rezandoPor, setRezandoPor] = useState(new Set());

  useEffect(() => {
    carregarPedidos();
  }, []);

  async function carregarPedidos() {
    try {
      const { data } = await api.get('/pedidos');
      setPedidos(data.pedidos);
    } catch {
      // silencioso
    } finally {
      setCarregando(false);
    }
  }

  async function enviarPedido(e) {
    e.preventDefault();
    if (!texto.trim() || texto.length > 250) return;

    setEnviando(true);
    setErro('');
    try {
      const { data } = await api.post('/pedidos', { texto: texto.trim() });
      setPedidos([data.pedido, ...pedidos]);
      setTexto('');
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao enviar pedido');
    }
    setEnviando(false);
  }

  async function rezarPor(pedidoId) {
    if (rezandoPor.has(pedidoId)) return;

    try {
      await api.post(`/pedidos/${pedidoId}/rezando`);
      setRezandoPor(prev => new Set([...prev, pedidoId]));
      setPedidos(prev =>
        prev.map(p =>
          p.id === pedidoId ? { ...p, contador_rezando: p.contador_rezando + 1 } : p
        )
      );
    } catch {
      // silencioso
    }
  }

  if (carregando) {
    return (
      <div className="comunidade-feed__vazio">
        <span className="loading-spinner" style={{ width: 24, height: 24 }} />
      </div>
    );
  }

  return (
    <div className="fade-in">
      <form className="comunidade-form" onSubmit={enviarPedido}>
        <textarea
          className="comunidade-form__textarea"
          placeholder="Deixe aqui seu pedido de oração..."
          value={texto}
          onChange={e => setTexto(e.target.value)}
          maxLength={250}
        />
        <div className="comunidade-form__footer">
          <span className={`comunidade-form__counter ${texto.length > 230 ? 'comunidade-form__counter--limit' : ''}`}>
            {texto.length}/250
          </span>
          <Button type="submit" disabled={enviando || !texto.trim()}>
            {enviando ? 'Enviando...' : 'Pedir Oração'}
          </Button>
        </div>
        {erro && <p className="comunidade-form__erro">{erro}</p>}
      </form>

      <div className="comunidade-feed">
        {pedidos.length === 0 ? (
          <div className="comunidade-feed__vazio">
            Nenhum pedido de oração ainda. Seja a primeira a pedir!
          </div>
        ) : (
          pedidos.map(p => (
            <div key={p.id} className="comunidade-pedido">
              <div className="comunidade-pedido__header">
                <span className="comunidade-pedido__nome">{p.nome}</span>
                <span className="comunidade-pedido__data">{formatarData(p.data_publicacao)}</span>
              </div>
              <p className="comunidade-pedido__texto">{p.texto}</p>
              <div className="comunidade-pedido__acoes">
                <button
                  className={`comunidade-pedido__rezando-btn ${rezandoPor.has(p.id) ? 'comunidade-pedido__rezando-btn--active' : ''}`}
                  onClick={() => rezarPor(p.id)}
                >
                  🙏 {rezandoPor.has(p.id) ? 'Rezando' : 'Estou rezando'}
                </button>
                <span className="comunidade-pedido__contador">
                  {p.contador_rezando} {p.contador_rezando === 1 ? 'pessoa rezando' : 'pessoas rezando'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function AbaVelas() {
  const [velas, setVelas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarVelas();
  }, []);

  async function carregarVelas() {
    try {
      const { data } = await api.get('/velas');
      setVelas(data.velas);
    } catch {
      // silencioso
    } finally {
      setCarregando(false);
    }
  }

  if (carregando) {
    return (
      <div className="comunidade-feed__vazio">
        <span className="loading-spinner" style={{ width: 24, height: 24 }} />
      </div>
    );
  }

  return (
    <div className="comunidade-altar fade-in">
      <p className="comunidade-altar__descricao">
        O altar virtual do Sacrário. Cada vela acesa representa uma intenção
        sendo elevada aos céus pela comunidade.
      </p>

      {velas.length > 0 ? (
        <div className="comunidade-altar__grade">
          {velas.map(v => (
            <div key={v.id} className="comunidade-vela" title={v.intencao}>
              <span className="comunidade-vela__chama">🕯️</span>
              <span className="comunidade-vela__nome">{v.nome}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="comunidade-altar__vazio">
          Nenhuma vela acesa no momento.
        </div>
      )}

      <div className="comunidade-altar__cta">
        <p className="comunidade-altar__cta-text">
          Acenda uma vela no altar do Sacrário e tenha sua intenção
          acompanhada em oração pela comunidade.
        </p>
        <Button
          onClick={() => window.open('https://pay.exemplo.com.br/vela', '_blank')}
          fullWidth
        >
          ACENDER MINHA VELA 🕯️
        </Button>
      </div>
    </div>
  );
}

export default function Comunidade() {
  const [aba, setAba] = useState('pedidos');

  return (
    <div className="comunidade-page">
      <Header />
      <div className="page-container">
        <div className="comunidade-page__intro fade-in">
          <div className="comunidade-page__icon">🙏</div>
          <h2 className="comunidade-page__title">Comunidade de Oração</h2>
          <div className="ornament">✦</div>
        </div>

        <div className="comunidade-page__tabs">
          <button
            className={`comunidade-page__tab ${aba === 'pedidos' ? 'comunidade-page__tab--active' : ''}`}
            onClick={() => setAba('pedidos')}
          >
            📿 Pedidos de Oração
          </button>
          <button
            className={`comunidade-page__tab ${aba === 'velas' ? 'comunidade-page__tab--active' : ''}`}
            onClick={() => setAba('velas')}
          >
            🕯️ Velas Virtuais
          </button>
        </div>

        {aba === 'pedidos' ? <AbaPedidos /> : <AbaVelas />}
      </div>
    </div>
  );
}
