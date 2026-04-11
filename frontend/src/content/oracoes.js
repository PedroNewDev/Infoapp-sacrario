// Orações do Rosário — textos completos
// Usados no Rosário Virtual interativo

export const oracoes = {
  sinalDaCruz: {
    nome: 'Sinal da Cruz',
    texto: 'Em nome do Pai, do Filho e do Espírito Santo. Amém.'
  },
  credo: {
    nome: 'Credo Apostólico',
    texto: 'Creio em Deus Pai Todo-Poderoso, Criador do Céu e da Terra. E em Jesus Cristo, seu único Filho, nosso Senhor, que foi concebido pelo poder do Espírito Santo, nasceu da Virgem Maria, padeceu sob Pôncio Pilatos, foi crucificado, morto e sepultado. Desceu à mansão dos mortos, ressuscitou ao terceiro dia, subiu aos Céus, está sentado à direita de Deus Pai Todo-Poderoso, de onde há de vir a julgar os vivos e os mortos. Creio no Espírito Santo, na Santa Igreja Católica, na comunhão dos Santos, na remissão dos pecados, na ressurreição da carne, na vida eterna. Amém.'
  },
  paiNosso: {
    nome: 'Pai Nosso',
    texto: 'Pai Nosso que estais nos Céus, santificado seja o vosso Nome, venha a nós o vosso Reino, seja feita a vossa vontade assim na Terra como no Céu. O pão nosso de cada dia nos dai hoje, perdoai-nos as nossas ofensas assim como nós perdoamos a quem nos tem ofendido, e não nos deixeis cair em tentação, mas livrai-nos do Mal. Amém.'
  },
  aveMaria: {
    nome: 'Ave Maria',
    texto: 'Ave Maria, cheia de graça, o Senhor é convosco, bendita sois vós entre as mulheres e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém.'
  },
  gloria: {
    nome: 'Glória ao Pai',
    texto: 'Glória ao Pai, ao Filho e ao Espírito Santo. Como era no princípio, agora e sempre e por todos os séculos dos séculos. Amém.'
  },
  oMeuJesus: {
    nome: 'Ó Meu Jesus',
    texto: 'Ó meu Jesus, perdoai-nos, livrai-nos do fogo do Inferno, levai as almas todas para o Céu e socorrei principalmente as que mais precisarem. Amém.'
  },
  salveRainha: {
    nome: 'Salve Rainha',
    texto: 'Salve, Rainha, Mãe de misericórdia, vida, doçura, esperança nossa, salve! A vós bradamos, os degredados filhos de Eva. A vós suspiramos, gemendo e chorando neste vale de lágrimas. Eia, pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei. E depois deste desterro, mostrai-nos Jesus, bendito fruto do vosso ventre. Ó clemente, ó piedosa, ó doce sempre Virgem Maria. Rogai por nós, Santa Mãe de Deus, para que sejamos dignos das promessas de Cristo. Amém.'
  }
};

export const misterios = {
  gozosos: {
    nome: 'Mistérios Gozosos',
    subtitulo: 'Os Mistérios da Alegria',
    diaSemana: [1, 6], // Segunda e Sábado
    dezenas: [
      {
        numero: 1,
        titulo: 'A Anunciação do Anjo a Maria',
        contemplacao: 'O anjo Gabriel anuncia a Maria que ela será a Mãe do Salvador. Maria, em sua humildade, diz sim ao plano de Deus: "Faça-se em mim segundo a Tua palavra."'
      },
      {
        numero: 2,
        titulo: 'A Visitação de Maria a Santa Isabel',
        contemplacao: 'Maria vai apressada ao encontro de sua prima Isabel, grávida de João Batista. No encontro, Isabel exclama: "Bendita és tu entre as mulheres e bendito é o fruto do teu ventre."'
      },
      {
        numero: 3,
        titulo: 'O Nascimento de Jesus em Belém',
        contemplacao: 'Em uma noite fria, numa manjedoura humilde, o Filho de Deus nasce. Maria o envolve em panos e o acolhe nos braços, aquecendo com seu amor o Criador do universo.'
      },
      {
        numero: 4,
        titulo: 'A Apresentação de Jesus no Templo',
        contemplacao: 'Maria e José levam o Menino Jesus ao Templo. O idoso Simeão profetiza: "Uma espada traspassará a tua alma." Maria guarda essas palavras no coração.'
      },
      {
        numero: 5,
        titulo: 'O Encontro do Menino Jesus no Templo',
        contemplacao: 'Aos doze anos, Jesus é encontrado no Templo após três dias de busca angustiante. Maria guardava todas essas coisas no coração, meditando sobre os mistérios de Deus.'
      }
    ]
  },
  luminosos: {
    nome: 'Mistérios Luminosos',
    subtitulo: 'Os Mistérios da Luz',
    diaSemana: [4], // Quinta
    dezenas: [
      {
        numero: 1,
        titulo: 'O Batismo de Jesus no Jordão',
        contemplacao: 'Jesus entra nas águas do rio Jordão e o céu se abre. A voz do Pai ecoa: "Este é o meu Filho amado, em quem me comprazo." O Espírito desce como pomba.'
      },
      {
        numero: 2,
        titulo: 'As Bodas de Caná',
        contemplacao: 'Numa festa de casamento, o vinho acaba. Maria intercede junto a Jesus e orienta os servos: "Fazei tudo o que Ele vos disser." A água se transforma no melhor vinho.'
      },
      {
        numero: 3,
        titulo: 'O Anúncio do Reino de Deus',
        contemplacao: 'Jesus percorre a Galileia anunciando: "O Reino de Deus está próximo. Convertei-vos e crede no Evangelho." Cada palavra é luz para os que caminham na escuridão.'
      },
      {
        numero: 4,
        titulo: 'A Transfiguração de Jesus',
        contemplacao: 'No Monte Tabor, Jesus se transfigura diante de Pedro, Tiago e João. Seu rosto brilha como o sol, suas vestes ficam brancas como a luz. A glória de Deus se revela.'
      },
      {
        numero: 5,
        titulo: 'A Instituição da Eucaristia',
        contemplacao: 'Na Última Ceia, Jesus toma o pão e diz: "Isto é o meu corpo, entregue por vós." Toma o cálice: "Este é o meu sangue, derramado para a remissão dos pecados."'
      }
    ]
  },
  dolorosos: {
    nome: 'Mistérios Dolorosos',
    subtitulo: 'Os Mistérios da Dor',
    diaSemana: [2, 5], // Terça e Sexta
    dezenas: [
      {
        numero: 1,
        titulo: 'A Agonia de Jesus no Horto das Oliveiras',
        contemplacao: 'Na noite antes de morrer, Jesus sua sangue no Jardim das Oliveiras. Pede ao Pai que afaste o cálice, mas aceita: "Não a minha vontade, mas a Tua."'
      },
      {
        numero: 2,
        titulo: 'A Flagelação de Jesus',
        contemplacao: 'Amarrado à coluna, Jesus recebe açoites cruéis. Cada golpe carrega os pecados do mundo. Em silêncio, Ele suporta a dor por amor a cada um de nós.'
      },
      {
        numero: 3,
        titulo: 'A Coroação de Espinhos',
        contemplacao: 'Os soldados tecem uma coroa de espinhos e a cravam na cabeça de Jesus, zombando: "Salve, Rei dos Judeus!" O sangue escorre pelo rosto do verdadeiro Rei.'
      },
      {
        numero: 4,
        titulo: 'Jesus Carrega a Cruz',
        contemplacao: 'Pelas ruas de Jerusalém, Jesus carrega a pesada cruz. Cai e levanta. Maria acompanha cada passo, com o coração traspassado pela espada da dor.'
      },
      {
        numero: 5,
        titulo: 'A Crucificação e Morte de Jesus',
        contemplacao: 'Pregado na cruz, Jesus diz: "Pai, perdoa-lhes." A Maria e João: "Eis a tua mãe." E ao entregar o espírito: "Está consumado." Maria permanece de pé ao lado da cruz.'
      }
    ]
  },
  gloriosos: {
    nome: 'Mistérios Gloriosos',
    subtitulo: 'Os Mistérios da Glória',
    diaSemana: [0, 3], // Domingo e Quarta
    dezenas: [
      {
        numero: 1,
        titulo: 'A Ressurreição de Jesus',
        contemplacao: 'Ao terceiro dia, a pedra do sepulcro é rolada. Jesus ressuscita, vencendo a morte para sempre. O que estava morto agora vive. A esperança renasce.'
      },
      {
        numero: 2,
        titulo: 'A Ascensão de Jesus ao Céu',
        contemplacao: 'Quarenta dias após a Ressurreição, Jesus sobe ao Céu diante dos discípulos. Dois anjos dizem: "Por que ficais olhando para o céu? Ele voltará."'
      },
      {
        numero: 3,
        titulo: 'A Descida do Espírito Santo',
        contemplacao: 'No Cenáculo, com Maria presente, o Espírito Santo desce como línguas de fogo sobre os apóstolos. O medo se transforma em coragem. A Igreja nasce.'
      },
      {
        numero: 4,
        titulo: 'A Assunção de Maria ao Céu',
        contemplacao: 'Ao final de sua vida terrena, Maria é elevada ao Céu de corpo e alma. A Mãe de Deus é acolhida na glória eterna, inteira, sem deixar nada para trás.'
      },
      {
        numero: 5,
        titulo: 'A Coroação de Maria como Rainha do Céu',
        contemplacao: 'Maria é coroada Rainha do Céu e da Terra. A menina de Nazaré que disse sim agora reina ao lado do Filho, intercedendo por todos os seus filhos.'
      }
    ]
  }
};

// Ordem dos conjuntos no Rosário completo
export const ordemConjuntos = ['gozosos', 'luminosos', 'dolorosos', 'gloriosos'];

// Gera a sequência completa de contas para um conjunto de mistérios
// Estrutura do Rosário por conjunto:
// Início: Credo → Pai Nosso → 3 Ave Maria → Glória → Ó Meu Jesus
// 5 Dezenas: [Enunciado Mistério → Pai Nosso → 10 Ave Maria → Glória → Ó Meu Jesus]
// Final do último conjunto: Salve Rainha
export function gerarContasConjunto(conjuntoKey, conjuntoIndex) {
  const conjunto = misterios[conjuntoKey];
  const contas = [];
  const isFirst = conjuntoIndex === 0;
  const isLast = conjuntoIndex === 3;

  // Introdução (só no primeiro conjunto)
  if (isFirst) {
    contas.push({ tipo: 'sinalDaCruz', oracao: oracoes.sinalDaCruz, grande: true });
    contas.push({ tipo: 'credo', oracao: oracoes.credo, grande: true });
    contas.push({ tipo: 'paiNosso', oracao: oracoes.paiNosso, grande: true });
    contas.push({ tipo: 'aveMaria', oracao: oracoes.aveMaria, numero: 1 });
    contas.push({ tipo: 'aveMaria', oracao: oracoes.aveMaria, numero: 2 });
    contas.push({ tipo: 'aveMaria', oracao: oracoes.aveMaria, numero: 3 });
    contas.push({ tipo: 'gloria', oracao: oracoes.gloria, grande: true });
  }

  // 5 Dezenas
  conjunto.dezenas.forEach((dezena, i) => {
    contas.push({
      tipo: 'misterio',
      dezena: i + 1,
      titulo: dezena.titulo,
      contemplacao: dezena.contemplacao,
      grande: true
    });
    contas.push({ tipo: 'paiNosso', oracao: oracoes.paiNosso, grande: true, dezena: i + 1 });
    for (let j = 1; j <= 10; j++) {
      contas.push({ tipo: 'aveMaria', oracao: oracoes.aveMaria, numero: j, dezena: i + 1 });
    }
    contas.push({ tipo: 'gloria', oracao: oracoes.gloria, dezena: i + 1 });
    contas.push({ tipo: 'oMeuJesus', oracao: oracoes.oMeuJesus, dezena: i + 1 });
  });

  // Final (só no último conjunto)
  if (isLast) {
    contas.push({ tipo: 'salveRainha', oracao: oracoes.salveRainha, grande: true });
    contas.push({ tipo: 'sinalDaCruz', oracao: oracoes.sinalDaCruz, grande: true });
  }

  return contas;
}
