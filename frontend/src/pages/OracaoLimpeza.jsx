import { useUser } from '../context/UserContext';
import Header from '../components/layout/Header';
import Button from '../components/ui/Button';
import './OracaoLimpeza.css';

const oracaoLimpeza = {
  abertura: `Em nome do Pai, do Filho e do Espírito Santo. Amém.

Senhor Deus, Pai Todo-Poderoso, eu me coloco diante de Vós neste momento com humildade e confiança. Venho pedir a Vossa proteção e a purificação de todo o meu ser.

Pelo Sangue precioso de Jesus Cristo, cobre-me, Senhor. Pelo Vosso Santo Espírito, purifica-me.`,

  limpeza: `Jesus, Senhor da minha vida, eu Vos peço que purifiqueis a minha mente de todo pensamento negativo, de toda ansiedade, de todo medo, de toda dúvida que não vem de Vós.

Purificai o meu coração de toda mágoa, de toda amargura, de toda raiva guardada, de todo ressentimento. Lavai-me com o Vosso Sangue e fazei-me nova.

Purificai o meu corpo de toda enfermidade, de todo cansaço que oprime, de toda dor que não me pertence.

Purificai a minha casa, a minha família, o meu trabalho. Afastai todo espírito de confusão, de discórdia, de inveja, de tristeza sem causa.

Em nome de Jesus, eu rejeito toda influência maligna, toda palavra de maldição, toda energia negativa que alguém tenha direcionado contra mim, consciente ou inconscientemente. Nada disso tem poder sobre mim, porque eu pertenço a Cristo.`,

  protecao: `Maria, Mãe de Deus e minha Mãe, cobri-me com o Vosso manto sagrado. Protegei os meus de todo mal visível e invisível.

São Miguel Arcanjo, defendei-me no combate. Sede a minha proteção contra as maldades e ciladas do demônio. Ordene-lhe Deus, instantemente o pedimos, e vós, Príncipe da Milícia Celeste, pelo poder divino, precipitai no inferno a Satanás e todos os espíritos malignos que vagam pelo mundo para a perdição das almas. Amém.

Anjo da Guarda, não me desampares. Guarda os meus passos, protege o meu sono, ilumina o meu caminho.`,

  encerramento: `Senhor, eu confio em Vós. Sei que estou protegida porque Vós estais comigo. Nenhum mal me atingirá, nenhuma praga chegará à minha tenda, porque Vós enviastes os Vossos anjos para me guardarem em todos os meus caminhos.

Eu me cubro com o Sangue de Jesus.
Eu me entrego ao Imaculado Coração de Maria.
Eu confio na proteção de São José e de São Miguel.

Em nome do Pai, do Filho e do Espírito Santo. Amém.`
};

const previewTexto = oracaoLimpeza.abertura;

function ConteudoCompleto() {
  return (
    <div className="limpeza-page__conteudo fade-in">
      <div>
        <h3 className="limpeza-page__secao-titulo">Abertura</h3>
        <div className="limpeza-page__texto">{oracaoLimpeza.abertura}</div>
      </div>

      <div>
        <h3 className="limpeza-page__secao-titulo">Oração de Limpeza</h3>
        <div className="limpeza-page__texto">{oracaoLimpeza.limpeza}</div>
      </div>

      <div>
        <h3 className="limpeza-page__secao-titulo">Oração de Proteção</h3>
        <div className="limpeza-page__texto">{oracaoLimpeza.protecao}</div>
      </div>

      <div>
        <h3 className="limpeza-page__secao-titulo">Encerramento</h3>
        <div className="limpeza-page__texto">{oracaoLimpeza.encerramento}</div>
      </div>

      <div className="limpeza-page__audio-placeholder">
        🎵 Áudio guiado em breve disponível
      </div>
    </div>
  );
}

function Paywall() {
  return (
    <div className="limpeza-page__paywall fade-in">
      <p className="limpeza-page__paywall-descricao">
        Uma oração poderosa de limpeza espiritual e proteção, guiada passo a passo,
        para purificar sua mente, coração, corpo e lar de toda influência negativa.
      </p>

      <div className="limpeza-page__preview">
        <div className="limpeza-page__preview-text">{previewTexto}</div>
        <div className="limpeza-page__preview-fade">
          <span className="limpeza-page__preview-lock">🔒</span>
        </div>
      </div>

      <div className="limpeza-page__beneficios">
        <div className="limpeza-page__beneficio">
          <span>✦</span>
          <span>Oração completa de limpeza e proteção espiritual</span>
        </div>
        <div className="limpeza-page__beneficio">
          <span>✦</span>
          <span>Áudio guiado com fundo musical sacro</span>
        </div>
        <div className="limpeza-page__beneficio">
          <span>✦</span>
          <span>Invocação a São Miguel Arcanjo e ao Anjo da Guarda</span>
        </div>
        <div className="limpeza-page__beneficio">
          <span>✦</span>
          <span>Acesso permanente — reze quando precisar</span>
        </div>
      </div>

      <Button
        onClick={() => window.open('https://pay.exemplo.com.br/limpeza', '_blank')}
        fullWidth
      >
        DESBLOQUEAR ORAÇÃO COMPLETA »
      </Button>
    </div>
  );
}

export default function OracaoLimpeza() {
  const { usuario } = useUser();
  const desbloqueado = usuario?.upsell_limpeza || false;

  return (
    <div className="limpeza-page">
      <Header />
      <div className="page-container">
        <div className="limpeza-page__intro fade-in">
          <div className="limpeza-page__icon">🛡️</div>
          <h2 className="limpeza-page__title">Oração de Limpeza e Proteção</h2>
          <div className="ornament">✦</div>
          <p className="limpeza-page__subtitle">
            Purifique sua mente, coração e lar com esta oração poderosa
          </p>
        </div>

        {desbloqueado ? <ConteudoCompleto /> : <Paywall />}
      </div>
    </div>
  );
}
