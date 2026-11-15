import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Animated, StyleSheet, ScrollView, StatusBar, ImageBackground, Vibration, Modal, Dimensions, Easing} from 'react-native';

const { width: LARGURA_TELA, height: ALTURA_TELA } = Dimensions.get('window');

const CORES_CONFETE_AZUL = ['#38BDF8', '#7DD3FC', '#BAE6FD', '#0EA5E9', '#E0F2FE', '#60A5FA'];

function ChuvaConfeteAzul({ ativo }) {
  const pecas = useRef(
    Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      xInicial: Math.random() * LARGURA_TELA,
      tamanhoLargura: 8 + Math.random() * 8,
      tamanhoAltura: 12 + Math.random() * 10,
      cor: CORES_CONFETE_AZUL[i % CORES_CONFETE_AZUL.length],
      atraso: Math.random() * 1200,
      duracao: 2400 + Math.random() * 1600,
      desvioLateral: (Math.random() - 0.5) * 90,
      quedaY: new Animated.Value(-40),
      oscilacaoX: new Animated.Value(0),
      rotacao: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    if (!ativo) return;

    const animacoes = pecas.map((p) => {
      p.quedaY.setValue(-40);
      p.oscilacaoX.setValue(0);
      p.rotacao.setValue(0);

      return Animated.loop(
        Animated.sequence([
          Animated.delay(p.atraso),
          Animated.parallel([
            Animated.timing(p.quedaY, {
              toValue: ALTURA_TELA + 60,
              duration: p.duracao,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(p.oscilacaoX, {
              toValue: p.desvioLateral,
              duration: p.duracao,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(p.rotacao, {
              toValue: 1,
              duration: p.duracao,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    });

    animacoes.forEach((a) => a.start());
    return () => animacoes.forEach((a) => a.stop());
  }, [ativo, pecas]);

  if (!ativo) return null;

  return (
    <View style={styles.confettiContainer} pointerEvents="none">
      {pecas.map((p) => {
        const giro = p.rotacao.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '720deg'],
        });
        return (
          <Animated.View
            key={p.id}
            style={{
              position: 'absolute',
              left: p.xInicial,
              top: 0,
              width: p.tamanhoLargura,
              height: p.tamanhoAltura,
              backgroundColor: p.cor,
              borderRadius: 3,
              transform: [
                { translateY: p.quedaY },
                { translateX: p.oscilacaoX },
                { rotate: giro },
              ],
            }}
          />
        );
      })}
    </View>
  );
}

function BotaoAnimado({ onPress, style, children, scaleTo = 1.08, disabled = false }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animarEntrada = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, {
      toValue: scaleTo,
      useNativeDriver: true,
      speed: 50,
      bounciness: 12,
    }).start();
  };

  const animarSaida = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 8,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={animarEntrada}
      onPressOut={animarSaida}
      onHoverIn={animarEntrada}
      onHoverOut={animarSaida}
      disabled={disabled}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.96 : 1 }],
        },
      ]}>
      <Animated.View style={[style, { transform: [{ scale: scaleAnim }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

const CREDITOS_GRUPO = {
  instituicao: 'UniLaSalle - RJ',
  curso: 'Sistemas de Informação',
  disciplina: 'Desenvolvimento Mobile',
  professor: 'João Paulo Baptista Voigtlaender',
  livro: 'Pense Bem: Walt Disney World & Epcot Center (1993)',
  alunos: [
    { nome: 'Carlos Gabriel Anselmo da Silva', ra: 'RA: 1013760' },
    { nome: 'Nathan Silva Cardoso', ra: 'RA: 1015078' },
    { nome: 'Pâmela Cristina Ribeiro de Souza', ra: 'RA: 1016180' },
  ],
};

const URL_CASTELO_EXTERNO = 'https://images.unsplash.com/photo-1548783307-f63adc3f200b?auto=format&fit=crop&w=1200&q=85';
let FONTE_IMAGEM_FUNDO = { uri: URL_CASTELO_EXTERNO };
try {
  FONTE_IMAGEM_FUNDO = require('./assets/castelo.jpge');
} catch (e) {
  try {
    FONTE_IMAGEM_FUNDO = require('./castelo.jpge');
  } catch (err) {
    FONTE_IMAGEM_FUNDO = { uri: URL_CASTELO_EXTERNO };
  }
}

const BOTOES_ALTERNATIVAS = [
  {
    letra: 'A',
    idx: 0,
    corFundo: '#E53935',
    corBorda: '#B71C1C',
    corTexto: '#FFFFFF',
    corBadge: 'rgba(0,0,0,0.25)',
  },
  {
    letra: 'B',
    idx: 1,
    corFundo: '#FDD835',
    corBorda: '#F57F17',
    corTexto: '#FFFFFF',
    corBadge: 'rgba(0,0,0,0.25)',
  },
  {
    letra: 'C',
    idx: 2,
    corFundo: '#1E88E5',
    corBorda: '#0D47A1',
    corTexto: '#FFFFFF',
    corBadge: 'rgba(0,0,0,0.25)',
  },
  {
    letra: 'D',
    idx: 3,
    corFundo: '#43A047',
    corBorda: '#1B5E20',
    corTexto: '#FFFFFF',
    corBadge: 'rgba(0,0,0,0.25)',
  },
];

const PROGRAMAS = {
  '081': {
    codigo: '081',
    titulo: 'Magic Kingdom & Main Street',
    corTema: '#4361EE',
    questoes: [
      { n: 1, p: 'O Disney World foi criado por .....', op: ['Peter Pan', 'Margarida', 'Clarabela', 'Walt Disney'], r: 'D' },
      { n: 2, p: 'Este aqui é o símbolo do Walt Disney World: Ele lembra um personagem muito conhecido, o .....', op: ['Mickey', 'Pluto', 'Pato Donald', 'Pateta'], r: 'A' },
      { n: 3, p: 'O Disney World fica perto de ....., que é uma cidade da Flórida.', op: ['Orlando', 'Fernando', 'Hildebrando', 'São Paulo'], r: 'A' },
      { n: 4, p: 'A Flórida é um dos estados de um país chamado .....', op: ['Itália', 'Argentina', 'Brasil', 'Estados Unidos'], r: 'D' },
      { n: 5, p: 'Os Estados Unidos ficam na .....', op: ['Austrália', 'América do Sul', 'América do Norte', 'Europa'], r: 'C' },
      { n: 6, p: 'Nos Estados Unidos as pessoas falam .....', op: ['francês', 'inglês', 'italiano', 'português'], r: 'B' },
      { n: 7, p: 'A Rua Principal mostra como eram as ..... e os veículos de antigamente.', op: ['edifícios', 'casas', 'foguetes', 'estrelas'], r: 'B' },
      { n: 8, p: 'Na Terra da Aventura você passeia de barco no meio da .....', op: ['avenida', 'estrada', 'selva', 'cidade'], r: 'C' },
      { n: 9, p: 'O barco passa pertinho dos ..... selvagens!', op: ['bichos', 'sorvetes', 'peixes', 'animais'], r: 'D' },
      { n: 10, p: 'A Terra da Fronteira lembra o Velho Oeste, onde viviam os .....', op: ['esquimós', 'marcianos', 'anões', 'caubóis'], r: 'D' },
      { n: 11, p: 'O Vôo de Peter Pan fica na linda .....', op: ['Venezuela', 'Terra da Fantasia', 'Europa', 'Lua'], r: 'B' },
      { n: 12, p: 'O ..... da Cinderela tem torres imponentes.', op: ['castelo', 'vestido', 'baile', 'sapatinho'], r: 'A' },
      { n: 13, p: 'Aqui é a Terra do Mickey, o ..... mais famoso do mundo.', op: ['camundongo', 'pato', 'esquilo', 'urso'], r: 'A' },
      { n: 14, p: 'É uma delícia passear pela ..... da Vovó Donalda.', op: ['praia', 'montanha', 'pedra', 'fazenda'], r: 'D' },
      { n: 15, p: 'Você vai conhecer o futuro na Terra do .....', op: ['Passado', 'Terror', 'Amanhã', 'Nunca'], r: 'C' },
      { n: 16, p: 'De ..... podemos ver tudo lá do alto.', op: ['sorvete', 'teleférico', 'submarino', 'carrossel'], r: 'B' },
      { n: 17, p: 'Na Montanha Espacial você entra num ..... e viaja pelo espaço cósmico.', op: ['foguete', 'calhambeque', 'trem', 'navio'], r: 'A' },
      { n: 18, p: 'O Reino Mágico também tem ..... com todos os tipos de comida.', op: ['hospitais', 'restaurantes', 'igrejas', 'escolas'], r: 'B' },
      { n: 19, p: 'Indique o nome das partes do trem (Farol dianteiro):', op: ['rabanete', 'veleiro', 'lanterna', 'cortina'], r: 'C' },
      { n: 20, p: 'Indique o nome das partes do trem (Saída de fumaça):', op: ['chaminé', 'estrela', 'avião', 'joelho'], r: 'A' },
      { n: 21, p: 'Indique o nome das partes do trem (Faz barulho no topo):', op: ['abajur', 'caixa', 'sino', 'sabão'], r: 'C' },
      { n: 22, p: 'Indique o nome das partes do trem (Puxa o trem):', op: ['locomotiva', 'colher', 'pedra', 'cotovelo'], r: 'A' },
      { n: 23, p: 'Indique o nome das partes do trem (Caminho de ferro):', op: ['rádio', 'testa', 'trilho', 'carvão'], r: 'C' },
      { n: 24, p: 'Indique o nome das partes do trem (Onde vão os passageiros):', op: ['bola', 'travesseiro', 'moeda', 'vagão'], r: 'D' },
      { n: 25, p: 'Indique o nome das partes do trem (Abertura na cabine):', op: ['bota', 'lençol', 'janela', 'almofada'], r: 'C' },
      { n: 26, p: 'Indique o nome das partes do trem (Gira sobre os trilhos):', op: ['roda', 'cesta', 'chupeta', 'macaco'], r: 'A' },
      { n: 27, p: 'Qual o sujeito da frase? "PEDRO PASSEOU NO CALHAMBEQUE"', op: ['PEDRO', 'PASSEOU', 'NO', 'CALHAMBEQUE'], r: 'A' },
      { n: 28, p: 'Qual o sujeito da frase? "A CARRUAGEM LEVOU CINDERELA"', op: ['A', 'CARRUAGEM', 'LEVOU', 'CINDERELA'], r: 'B' },
      { n: 29, p: 'Qual o sujeito da frase? "RITA SUBIU NO TRICICLO"', op: ['RITA', 'SUBIU', 'NO', 'TRICICLO'], r: 'A' },
      { n: 30, p: 'Qual o sujeito da frase? "A LOCOMOTIVA ESTÁ APITANDO"', op: ['A', 'LOCOMOTIVA', 'ESTÁ', 'APITANDO'], r: 'B' },
    ],
  },
  '082': {
    codigo: '082',
    titulo: 'Adventureland & Frontierland',
    corTema: '#4361EE',
    questoes: [
      { n: 31, p: 'Quem tem listras brancas e pretas é a .....', op: ['galinha', 'zebra', 'rato', 'cachorro'], r: 'B' },
      { n: 32, p: 'Quem tem o pescoço bem comprido é a .....', op: ['gorila', 'girafa', 'cavalo', 'cobra'], r: 'B' },
      { n: 33, p: 'O animal com um só chifre é o .....', op: ['canguru', 'tubarão', 'rinoceronte', 'camelo'], r: 'C' },
      { n: 34, p: 'O ..... usa a tromba para tomar banho.', op: ['onça', 'elefante', 'tigre', 'gato'], r: 'B' },
      { n: 35, p: 'Uma grande juba enfeita a cabeça do .....', op: ['leão', 'anta', 'caranguejo', 'pata'], r: 'A' },
      { n: 36, p: 'Quando abre a boca, o ..... mostra seus dentes pontudos.', op: ['macaco', 'urubu', 'jacaré', 'beija-flor'], r: 'C' },
      { n: 37, p: 'Associe cada animal ao lugar onde ele vive (Girafa):', op: ['Estados Unidos', 'África', 'Índia', 'Austrália'], r: 'B' },
      { n: 38, p: 'Associe cada animal ao lugar onde ele vive (Onça-pintada):', op: ['África', 'Estados Unidos', 'Polo Norte', 'Brasil'], r: 'D' },
      { n: 39, p: 'Associe cada animal ao lugar onde ele vive (Canguru):', op: ['Polo Norte', 'Índia', 'África', 'Austrália'], r: 'D' },
      { n: 40, p: 'Associe cada animal ao lugar onde ele vive (Urso Polar):', op: ['Brasil', 'Austrália', 'Estados Unidos', 'Polo Norte'], r: 'D' },
      { n: 41, p: 'Associe cada animal ao lugar onde ele vive (Raposa):', op: ['Índia', 'Estados Unidos', 'Polo Norte', 'África'], r: 'B' },
      { n: 42, p: 'Associe cada animal ao lugar onde ele vive (Elefante Indiano):', op: ['Austrália', 'Polo Norte', 'Estados Unidos', 'Índia'], r: 'D' },
      { n: 43, p: 'Qual destes bota o maior ovo?', op: ['avestruz', 'beija-flor', 'pardal', 'canário'], r: 'A' },
      { n: 44, p: 'Qual destes tem uma bela cauda colorida?', op: ['urubu', 'pavão', 'pinguim', 'águia'], r: 'B' },
      { n: 45, p: 'Qual destes gosta de comer peixe?', op: ['periquito', 'martim-pescador', 'tucano', 'sabiá'], r: 'B' },
      { n: 46, p: 'Qual destes tem o bico mais comprido?', op: ['papagaio', 'águia', 'periquito', 'tucano'], r: 'D' },
      { n: 47, p: 'Qual destes mora numa casinha de barro?', op: ['sabiá', 'joão-de-barro', 'coruja', 'pinguim'], r: 'B' },
      { n: 48, p: 'Qual destes aprende a falar como gente?', op: ['arara', 'canário', 'papagaio', 'tucano'], r: 'C' },
      { n: 49, p: 'Em cada linha, qual a figura que pertence ao caubói?', op: ['Chapéu de caubói', 'Chapéu de chef', 'Cartola', 'Boné'], r: 'A' },
      { n: 50, p: 'Em cada linha, qual a figura que pertence ao caubói?', op: ['Bota com espora', 'Chinelo', 'Tênis', 'Sapato de salto'], r: 'A' },
      { n: 51, p: 'Em cada linha, qual a figura que pertence ao caubói?', op: ['Estetoscópio', 'Cinto', 'Máscara de mergulho', 'Luneta'], r: 'B' },
      { n: 52, p: 'Em cada linha, qual a figura que lembra o Velho Oeste?', op: ['Esquimó', 'Chinês', 'Índio americano', 'Havaiana'], r: 'C' },
      { n: 53, p: 'Em cada linha, qual a figura que lembra o Velho Oeste?', op: ['Cavalo', 'Camelo', 'Elefante', 'Baleia'], r: 'A' },
      { n: 54, p: 'Em cada linha, qual a figura que lembra o Velho Oeste?', op: ['Carroça', 'Carro de corrida', 'Moto', 'Lancha'], r: 'A' },
      { n: 55, p: 'Qual a palavra que combina com cada figura? (Teia)', op: ['lagarto', 'aranha', 'rato', 'leão'], r: 'B' },
      { n: 56, p: 'Qual a palavra que combina com cada figura? (Lua e estrelas)', op: ['noite', 'dia', 'chuva', 'relógio'], r: 'A' },
      { n: 57, p: 'Qual a palavra que combina com cada figura? (Chapéu e vassoura)', op: ['fada', 'gnomo', 'rei', 'bruxa'], r: 'D' },
      { n: 58, p: 'Qual a palavra que combina com cada figura? (Osso)', op: ['armário', 'esqueleto', 'floresta', 'sorvete'], r: 'B' },
      { n: 59, p: 'Qual a palavra que combina com cada figura? (Criatura peluda)', op: ['futebol', 'monstro', 'sapo', 'gato'], r: 'B' },
      { n: 60, p: 'Qual a palavra que combina com cada figura? (Sarcófago)', op: ['tesoura', 'múmia', 'papel', 'lápis'], r: 'B' },
    ],
  },
  '083': {
    codigo: '083',
    titulo: 'Terra do Mickey & Fantasyland',
    corTema: '#4361EE',
    questoes: [
      { n: 61, p: 'Vamos ajudar cada um deles a encontrar seu par? (Minnie)', op: ['Pato Donald', 'Vovó Donalda', 'Mickey', 'Pluto'], r: 'C' },
      { n: 62, p: 'Vamos ajudar cada um deles a encontrar seu par? (Margarida)', op: ['Mickey', 'Pluto', 'Vovó Donalda', 'Pato Donald'], r: 'D' },
      { n: 63, p: 'Vamos ajudar cada um deles a encontrar seu par? (Ganso Gus)', op: ['Mickey', 'Pato Donald', 'Vovó Donalda', 'Pluto'], r: 'C' },
      { n: 64, p: 'Vamos ajudar cada um deles a encontrar seu par? (Casinha do Pluto)', op: ['Mickey', 'Pato Donald', 'Vovó Donalda', 'Pluto'], r: 'D' },
      { n: 65, p: 'Vamos ajudar cada um deles a encontrar seu par? (Clarabela)', op: ['Zezinho e Luisinho', 'Mickey', 'Pato Donald', 'Pateta'], r: 'D' },
      { n: 66, p: 'Vamos ajudar cada um deles a encontrar seu par? (Huguinho)', op: ['Pato Donald', 'Pluto', 'Vovó Donalda', 'Zezinho e Luisinho'], r: 'D' },
      { n: 67, p: 'Aponte o objeto que FLUTUA na água (67):', op: ['bola de isopor', 'prego', 'pedra', 'moeda'], r: 'A' },
      { n: 68, p: 'Aponte o objeto que FLUTUA na água (68):', op: ['trem', 'ônibus', 'canoa', 'trator'], r: 'C' },
      { n: 69, p: 'Aponte o objeto que FLUTUA na água (69):', op: ['pato', 'elefante', 'dinossauro', 'casa'], r: 'A' },
      { n: 70, p: 'Complete: A água é um .....', op: ['líquido', 'mamífero', 'computador', 'substantivo'], r: 'A' },
      { n: 71, p: 'Complete: A água é .....', op: ['colorida', 'incolor', 'redonda', 'sorvete'], r: 'B' },
      { n: 72, p: 'Complete: Todos os seres vivos precisam de .....', op: ['remédios', 'hortaliça', 'água', 'dinheiro'], r: 'C' },
      { n: 73, p: 'Informe a história que figura te lembra (Sapatinho de Cristal):', op: ['Cinderela', 'A Bela e a Fera', 'Aladdin', 'Bambi'], r: 'A' },
      { n: 74, p: 'Informe a história que figura te lembra (Maçã):', op: ['Branca de Neve', 'A Pequena Sereia', 'A Bela Adormecida', 'Aristogatas'], r: 'A' },
      { n: 75, p: 'Informe a história que figura te lembra (Lâmpada Mágica):', op: ['Peter Pan', 'Aladdin', 'Dumbo', 'A Dama e o Vagabundo'], r: 'B' },
      { n: 76, p: 'Informe a história que figura te lembra (Gancho):', op: ['Alice no País das Maravilhas', 'Peter Pan', 'Branca de Neve', 'Cinderela'], r: 'B' },
      { n: 77, p: 'Informe a história que figura te lembra (Ratinho com roupa de circo):', op: ['Bambi', 'Dumbo', 'Os 101 Dálmatas', 'Mogli, o Menino Lobo'], r: 'B' },
      { n: 78, p: 'Informe a história que figura te lembra (Gambá):', op: ['Beleza Negra', 'A Bela Adormecida', 'Cinderela', 'Bambi'], r: 'D' },
      { n: 79, p: 'Informe a história que figura te lembra (Dragão):', op: ['Aristogatas', 'Robin Hood', 'Peter Pan', 'A Bela Adormecida'], r: 'D' },
      { n: 80, p: 'Quebra-cabeça: Mickey e Pluto estão esperando as cartas dos fãs! (Peça 80)', op: ['A', 'F', 'E', 'B'], r: 'C' },
      { n: 81, p: 'Quebra-cabeça: Mickey e Pluto estão esperando as cartas dos fãs! (Peça 81)', op: ['C', 'A', 'D', 'F'], r: 'C' },
      { n: 82, p: 'Quebra-cabeça: Mickey e Pluto estão esperando as cartas dos fãs! (Peça 82)', op: ['E', 'B', 'F', 'C'], r: 'B' },
      { n: 83, p: 'Quebra-cabeça: Mickey e Pluto estão esperando as cartas dos fãs! (Peça 83)', op: ['A', 'F', 'B', 'C'], r: 'A' },
      { n: 84, p: 'Quebra-cabeça: Mickey e Pluto estão esperando as cartas dos fãs! (Peça 84)', op: ['D', 'E', 'A', 'F'], r: 'D' },
      { n: 85, p: 'Quebra-cabeça: Mickey e Pluto estão esperando as cartas dos fãs! (Peça 85)', op: ['A', 'C', 'E', 'B'], r: 'B' },
      { n: 86, p: 'O astronauta viaja no .....', op: ['foguete', 'trem', 'navio', 'satélite'], r: 'A' },
      { n: 87, p: 'A comida esquenta rápido no .....', op: ['computador', 'freezer', 'liquidificador', 'micro-ondas'], r: 'D' },
      { n: 88, p: 'A tv transmite programas via .....', op: ['fogão', 'satélite', 'abajur', 'lanterna'], r: 'B' },
      { n: 89, p: 'Para fazer contas eu uso a .....', op: ['banheira', 'calculadora', 'torradeira', 'almôndega'], r: 'B' },
      { n: 90, p: 'O Pense Bem é um jogo .....', op: ['mamífero', 'inseto', 'pré-histórico', 'eletrônico'], r: 'D' },
    ],
  },
  '084': {
    codigo: '084',
    titulo: 'Epcot Center Especial',
    corTema: '#4361EE',
    questoes: [
      { n: 91, p: 'Nossos antepassados da pré-história moravam em .....', op: ['apartamentos', 'iglus', 'cavernas', 'palácios'], r: 'C' },
      { n: 92, p: 'Eles caçavam ..... para comer.', op: ['borboletas', 'ladrões', 'animais', 'autógrafos'], r: 'C' },
      { n: 93, p: 'O homem das cavernas descobriu uma coisa muito importante: como fazer .....!', op: ['bolo', 'gelo', 'fogo', 'chiclete'], r: 'C' },
      { n: 94, p: 'Os antigos egípcios inventaram uma escrita com sinais chamados .....', op: ['asteriscos', 'hieroglifos', 'carrapatos', 'chips'], r: 'B' },
      { n: 95, p: 'Cristóvão Colombo descobriu um novo continente, a .....', op: ['América', 'Europa', 'Austrália', 'Ásia'], r: 'A' },
      { n: 96, p: 'No século 20, os homens conquistaram o .....', op: ['prêmio', 'campeonato', 'jogo', 'espaço'], r: 'D' },
      { n: 97, p: 'Os astronautas chegaram até a .....', op: ['Terra', 'Lua', 'Vênus', 'Plutão'], r: 'B' },
      { n: 98, p: 'Os cientistas modernos inventaram os .....', op: ['computadores', 'mamutes', 'sorvetes', 'chocolates'], r: 'A' },
      { n: 99, p: 'Indique o objeto que produz um som (99):', op: ['mesa', 'cadeira', 'lâmpada', 'piano'], r: 'D' },
      { n: 100, p: 'Indique o objeto que produz um som (100):', op: ['lápis', 'violão', 'régua', 'bolsa'], r: 'B' },
      { n: 101, p: 'Indique o objeto que produz um som (101):', op: ['maçã', 'sino', 'óculos', 'livro'], r: 'B' },
      { n: 102, p: 'Qual a ordem certa das notas musicais?', op: ['dó sol fá mi', 'sol lá si fá', 'fá lá dó ré', 'dó ré mi fá'], r: 'D' },
      { n: 103, p: 'Na sequência DÓ RÉ MI ___ SOL, qual a nota que está faltando?', op: ['lá', 'fá', 'si', 'dó'], r: 'B' },
      { n: 104, p: 'Qual destes instrumentos produz o som mais forte?', op: ['trombone', 'triângulo', 'flauta', 'gaita'], r: 'A' },
      { n: 105, p: 'No fundo do mar (105):', op: ['submarino', 'navio', 'piloto', 'veleiro'], r: 'A' },
      { n: 106, p: 'No fundo do mar (106):', op: ['escotilha', 'porta', 'janela', 'alçapão'], r: 'A' },
      { n: 107, p: 'No fundo do mar (107):', op: ['lagosta', 'polvo', 'caramujo', 'siri'], r: 'B' },
      { n: 108, p: 'No fundo do mar (108):', op: ['asa', 'barbatana', 'antena', 'tentáculo'], r: 'D' },
      { n: 109, p: 'No fundo do mar (109):', op: ['alga', 'capim', 'árvore', 'flor'], r: 'A' },
      { n: 110, p: 'No fundo do mar (110):', op: ['rubi', 'pérola', 'esmeralda', 'diamante'], r: 'B' },
      { n: 111, p: 'Assinale a capital de cada país (França):', op: ['Alagoas', 'Paris', 'Oceano', 'China'], r: 'B' },
      { n: 112, p: 'Assinale a capital de cada país (Japão):', op: ['Nova York', 'Tóquio', 'Disney', 'Arábia'], r: 'B' },
      { n: 113, p: 'Assinale a capital de cada país (Canadá):', op: ['Paris', 'Amazonas', 'Atlântico', 'Ottawa'], r: 'D' },
      { n: 114, p: 'Assinale a capital de cada país (Estados Unidos):', op: ['Londres', 'Brasília', 'Roma', 'Washington'], r: 'D' },
      { n: 115, p: 'Assinale a capital de cada país (Reino Unido):', op: ['Buenos Aires', 'Londres', 'Kripton', 'Rio de Janeiro'], r: 'B' },
      { n: 116, p: 'Assinale a capital de cada país (Alemanha):', op: ['Berlim', 'Moscou', 'Macuco', 'Seattle'], r: 'A' },
      { n: 117, p: 'Quebra-cabeça Kitchen Kabaret (Peça 117):', op: ['B', 'A', 'D', 'C'], r: 'D' },
      { n: 118, p: 'Quebra-cabeça Kitchen Kabaret (Peça 118):', op: ['C', 'B', 'D', 'A'], r: 'D' },
      { n: 119, p: 'Quebra-cabeça Kitchen Kabaret (Peça 119):', op: ['D', 'C', 'B', 'A'], r: 'A' },
      { n: 120, p: 'Quebra-cabeça Kitchen Kabaret (Peça 120):', op: ['B', 'D', 'C', 'A'], r: 'A' },
    ],
  },
  '085': {
    codigo: '085',
    titulo: 'MGM Studios',
    corTema: '#4361EE',
    questoes: [
      { n: 121, p: 'Filmes são feitos em .....', op: ['escolas', 'hospitais', 'estúdios', 'cozinhas'], r: 'C' },
      { n: 122, p: 'Plantamos flores no .....', op: ['quarto', 'elevador', 'sorvete', 'jardim'], r: 'D' },
      { n: 123, p: 'Colhemos verduras na .....', op: ['sala', 'cinema', 'horta', 'teatro'], r: 'C' },
      { n: 124, p: 'Guardamos as roupas no .....', op: ['fogão', 'congelador', 'armário', 'lixo'], r: 'C' },
      { n: 125, p: 'Usamos roupas quentes no .....', op: ['sótão', 'cabelo', 'aniversário', 'inverno'], r: 'D' },
      { n: 126, p: 'Para tratar dos dentes vamos ao .....', op: ['geladeira', 'gaveta', 'escorregador', 'dentista'], r: 'D' },
      { n: 127, p: 'A comida preferida das Tartarugas Ninjas é .....', op: ['sorvete', 'pizza', 'pipoca', 'hambúrguer'], r: 'B' },
      { n: 128, p: 'Tartarugas de verdade são .....', op: ['aves', 'répteis', 'mamíferos', 'insetos'], r: 'B' },
      { n: 129, p: 'Existem três grupos de tartarugas: as marinhas, as de água doce e as .....', op: ['voadoras', 'invisíveis', 'plastificadas', 'terrestres'], r: 'D' },
      { n: 130, p: 'Quando está em perigo, a tartaruga esconde sua cabeça embaixo do .....', op: ['casco', 'travesseiro', 'sofá', 'asa'], r: 'A' },
      { n: 131, p: 'A tartaruga marinha faz seu ninho na .....', op: ['árvore', 'areia', 'pedra', 'lagoa'], r: 'B' },
      { n: 132, p: 'O filhote da tartaruga sai do ovo e corre para o .....', op: ['cinema', 'metrô', 'deserto', 'mar'], r: 'D' },
      { n: 133, p: 'Várias espécies de tartarugas estão ameaçadas de .....', op: ['extinção', 'explosão', 'solução', 'alçapão'], r: 'A' },
      { n: 134, p: 'A gasolina é inflamável, isto é, ela é uma substância que pega .....', op: ['sarampo', 'fogo', 'doenças', 'moscas'], r: 'B' },
      { n: 135, p: 'Indique a substância que NÃO é inflamável:', op: ['papel', 'álcool', 'água', 'gás de cozinha'], r: 'C' },
      { n: 136, p: 'Aponte o que NÃO é líquido:', op: ['mesa', 'sangue', 'água', 'suco de laranja'], r: 'A' },
      { n: 137, p: 'Qual destas é uma substância NATURAL?', op: ['madeira', 'plástico', 'isopor', 'refrigerante'], r: 'A' },
      { n: 138, p: 'Qual é o mais leve?', op: ['caminhão', 'elefante', 'borboleta', 'casa'], r: 'C' },
      { n: 139, p: 'Qual é o mais duro?', op: ['maionese', 'queijo', 'banana', 'tijolo'], r: 'D' },
      { n: 140, p: 'Qual é o mais macio?', op: ['alfinete', 'prego', 'espinho', 'algodão'], r: 'D' },
      { n: 141, p: 'Uma coisa muito grande é .....', op: ['alegre', 'vazia', 'enorme', 'perto'], r: 'C' },
      { n: 142, p: 'Uma coisa muito pequena é .....', op: ['atrás', 'longe', 'azul', 'minúscula'], r: 'D' },
      { n: 143, p: 'Muitas pessoas formam uma .....', op: ['praia', 'casal', 'multidão', 'dupla'], r: 'C' },
      { n: 144, p: 'Muitos peixes formam um .....', op: ['pescador', 'cardume', 'aeroporto', 'hotel'], r: 'B' },
      { n: 145, p: 'Muitas estrelas formam uma .....', op: ['assombração', 'constelação', 'mansão', 'canção'], r: 'B' },
      { n: 146, p: 'Muitos livros formam uma .....', op: ['discoteca', 'biblioteca', 'peteca', 'marreca'], r: 'B' },
      { n: 147, p: 'O filme Aladdin é um desenho .....', op: ['animado', 'salgado', 'prateado', 'calçado'], r: 'A' },
      { n: 148, p: 'O primeiro parque criado por Walt Disney se chamava .....', op: ['Playcenter', 'Playland', 'Disneyland', 'Waltland'], r: 'C' },
      { n: 149, p: 'Criado em 1928, ele é o mais antigo personagem de Walt Disney.', op: ['Mickey', 'Pateta', 'Donald', 'Margarida'], r: 'A' },
      { n: 150, p: 'O herói do filme "Os Caçadores da Arca Perdida" se chama ..... Jones.', op: ['Sabrina', 'Tom', 'Montana', 'Indiana'], r: 'D' },
    ],
  },
};

function CabecalhoPadrao() {
  return (
    <View style={styles.headerWrapperTransparent}>
      <View style={styles.brandHeader}>
        <View style={styles.tectoyBadge}>
          <Text style={styles.tectoyLogoText}>TEC TOY</Text>
        </View>
        <Text style={styles.penseBemLogoText}>Pense Bem® • Disney</Text>
      </View>
      <View style={styles.titlesBlock}>
        <Text style={styles.disneyTitle}>WALT DISNEY WORLD</Text>
        <Text style={styles.epcotSubtitle}>EPCOT CENTER EDITION</Text>
      </View>
    </View>
  );
}

function CabecalhoSolido() {
  return (
    <View style={styles.topHeaderSolidBand}>
      <View style={styles.headerWrapperSolid}>
        <View style={styles.brandHeader}>
          <View style={styles.tectoyBadge}>
            <Text style={styles.tectoyLogoText}>TEC TOY</Text>
          </View>
          <Text style={styles.penseBemLogoText}>Pense Bem® • Disney</Text>
        </View>
      </View>
    </View>
  );
}

function BotaoSetaVoltar({ onPress }) {
  return (
    <BotaoAnimado style={styles.arrowBackBtn} onPress={onPress} scaleTo={1.15}>
      <View style={styles.arrowIconWrapper}>
        <View style={styles.arrowHead} />
        <View style={styles.arrowStem} />
      </View>
    </BotaoAnimado>
  );
}

export default function App() {
  const [tela, setTela] = useState('MENU');
  const [codigoDigitado, setCodigoDigitado] = useState('');
  const [programaAtual, setProgramaAtual] = useState('081');
  const [indiceQuestao, setIndiceQuestao] = useState(0);
  const [tentativa, setTentativa] = useState(1);
  const [pontos, setPontos] = useState(0);
  const [statusResposta, setStatusResposta] = useState('NEUTRO');
  const [bloqueado, setBloqueado] = useState(false);

  const [modalErroVisivel, setModalErroVisivel] = useState(false);
  const [mensagemErroModal, setMensagemErroModal] = useState('');

  const [modalConfirmVisivel, setModalConfirmVisivel] = useState(false);
  const [mensagemConfirm, setMensagemConfirm] = useState('');
  const [acaoConfirm, setAcaoConfirm] = useState(null);

  const prog = PROGRAMAS[programaAtual];
  const questaoObj = prog.questoes[indiceQuestao];

  const iniciarPrograma = (cod) => {
    if (!PROGRAMAS[cod]) {
      setMensagemErroModal('Código inválido! Por favor, utilize os programas de 081 a 085.');
      setModalErroVisivel(true);
      return;
    }
    setProgramaAtual(cod);
    setIndiceQuestao(0);
    setTentativa(1);
    setPontos(0);
    setStatusResposta('NEUTRO');
    setBloqueado(false);
    setTela('JOGO');
  };

  const solicitarVoltarMenu = () => {
    setMensagemConfirm('Você deseja realmente voltar para o menu principal?');
    setAcaoConfirm(() => () => setTela('MENU'));
    setModalConfirmVisivel(true);
  };

  const solicitarTrocarPrograma = () => {
    setMensagemConfirm('Você deseja realmente trocar de programa?');
    setAcaoConfirm(() => () => {
      setCodigoDigitado('');
      setTela('LIVRO');
    });
    setModalConfirmVisivel(true);
  };

  const renderizarModalConfirmacao = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalConfirmVisivel}
      onRequestClose={() => setModalConfirmVisivel(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalIconCircle}>
            <Text style={styles.modalIconExclamation}>?</Text>
          </View>
          <Text style={styles.modalMessage}>{mensagemConfirm}</Text>

          <View style={styles.modalButtonRow}>
            <View style={{ flex: 1, marginRight: 6 }}>
              <BotaoAnimado
                style={[styles.modalHalfButton, { backgroundColor: '#F05995' }]}
                onPress={() => setModalConfirmVisivel(false)}>
                <Text style={styles.modalCloseButtonText}>NÃO</Text>
              </BotaoAnimado>
            </View>

            <View style={{ flex: 1, marginLeft: 6 }}>
              <BotaoAnimado
                style={[styles.modalHalfButton, { backgroundColor: '#F05995' }]}
                onPress={() => {
                  setModalConfirmVisivel(false);
                  if (acaoConfirm) acaoConfirm();
                }}>
                <Text style={styles.modalCloseButtonText}>SIM</Text>
              </BotaoAnimado>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );

  const avancarQuestao = () => {
    if (indiceQuestao + 1 < prog.questoes.length) {
      setIndiceQuestao((prev) => prev + 1);
      setTentativa(1);
      setStatusResposta('NEUTRO');
      setBloqueado(false);
    } else {
      setBloqueado(false);
      setStatusResposta('NEUTRO');
      setTela('RESULTADO');
    }
  };

  const responder = (letraEscolhida) => {
    if (bloqueado) return;
    setBloqueado(true);

    try {
      Vibration.vibrate(40);
    } catch (e) {}

    const acertou = letraEscolhida === questaoObj.r;

    if (acertou) {
      const ptsGanhos = tentativa === 1 ? 3 : tentativa === 2 ? 2 : 1;
      setPontos((prev) => prev + ptsGanhos);
      setStatusResposta('ACERTO');
      setTimeout(() => {
        avancarQuestao();
      }, 950);
    } else {
      setStatusResposta('ERRO');
      if (tentativa < 3) {
        setTimeout(() => {
          setTentativa((prev) => prev + 1);
          setStatusResposta('NEUTRO');
          setBloqueado(false);
        }, 900);
      } else {
        setTimeout(() => {
          avancarQuestao();
        }, 1100);
      }
    }
  };

  const pressionarDigito = (dig) => {
    if (codigoDigitado.length < 3) {
      setCodigoDigitado((prev) => prev + dig);
    } else {
      setCodigoDigitado(dig);
    }
  };

  const renderizarVisorLivro = () => {
    const digitosAtuais = codigoDigitado.split('');
    return (
      <View style={styles.displayLedContainer}>
        {Array.from({ length: 3 }).map((_, index) => {
          const caractere = digitosAtuais[index];
          return (
            <Text
              key={index}
              style={[
                styles.letraVisorTraco,
                caractere ? styles.letraDigitada : styles.letraVazia,
              ]}>
              {caractere ? caractere : '_'}
            </Text>
          );
        })}
      </View>
    );
  };

  if (tela === 'MENU') {
    return (
      <View style={styles.fullScreenRoot}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        <ImageBackground
          source={FONTE_IMAGEM_FUNDO}
          style={styles.fullScreenBgImage}
          imageStyle={styles.bgImageCentered}
          resizeMode="cover">
          <View style={styles.menuOverlayContainer}>
            <CabecalhoPadrao />

            <View style={styles.menuBottomContent}>
              <View style={styles.menuButtonsContainer}>
                <View style={styles.menuBtnWrapper}>
                  <BotaoAnimado
                    style={[styles.menuBtnBox, { backgroundColor: '#F05995', borderColor: '#C23B73' }]}
                    onPress={() => {
                      setCodigoDigitado('');
                      setTela('LIVRO');
                    }}>
                    <Text style={styles.menuBtnCompactText}>INICIAR JOGO</Text>
                  </BotaoAnimado>
                </View>

                <View style={styles.menuBtnWrapper}>
                  <BotaoAnimado
                    style={[styles.menuBtnBox, { backgroundColor: '#9359F0', borderColor: '#6D35C7' }]}
                    onPress={() => setTela('REGRAS')}>
                    <Text style={styles.menuBtnCompactText}>REGRAS</Text>
                  </BotaoAnimado>
                </View>

                <View style={styles.menuBtnWrapper}>
                  <BotaoAnimado
                    style={[styles.menuBtnBox, { backgroundColor: '#5664F5', borderColor: '#3744C9' }]}
                    onPress={() => setTela('CREDITOS')}>
                    <Text style={styles.menuBtnCompactText}>CRÉDITOS</Text>
                  </BotaoAnimado>
                </View>
              </View>

              <Text style={styles.footerCopyrightText}>
                2026 © copyright todos os direitos reservados
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }

  if (tela === 'LIVRO') {
    return (
      <View style={styles.fullScreenContainer}>
        <StatusBar barStyle="light-content" translucent backgroundColor="#160B2E" />
        <CabecalhoSolido />
        {renderizarModalConfirmacao()}

        <ScrollView contentContainerStyle={styles.scrollFullContent}>
          <View style={styles.topBarWithArrow}>
            <BotaoSetaVoltar onPress={solicitarVoltarMenu} />
            <Text style={styles.screenSectionHeader}>PROGRAMA</Text>
          </View>

          <View style={styles.ledBezelLivro}>
            <Text style={styles.ledSubLabelGreen}>DIGITE O PROGRAMA:</Text>
            {renderizarVisorLivro()}
          </View>

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalErroVisivel}
            onRequestClose={() => setModalErroVisivel(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <View style={styles.modalIconCircle}>
                  <Text style={styles.modalIconExclamation}>!</Text>
                </View>
                <Text style={styles.modalTitle}>ATENÇÃO</Text>
                <Text style={styles.modalMessage}>{mensagemErroModal}</Text>
                <BotaoAnimado
                  style={styles.modalCloseButton}
                  onPress={() => setModalErroVisivel(false)}>
                  <Text style={styles.modalCloseButtonText}>ENTENDI</Text>
                </BotaoAnimado>
              </View>
            </View>
          </Modal>

          <View style={styles.retroKeypadBox}>
            <View style={styles.keypadNumbersGrid}>
              {['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <View key={num} style={styles.numKeyWrapper}>
                  <BotaoAnimado
                    style={styles.numKey}
                    scaleTo={1.14}
                    onPress={() => pressionarDigito(num)}>
                    <Text style={styles.numKeyText}>{num}</Text>
                  </BotaoAnimado>
                </View>
              ))}
            </View>

            <View style={styles.keypadActionRow}>
              <View style={styles.funcKeyWrapper}>
                <BotaoAnimado
                  style={[styles.funcKey, { backgroundColor: '#F05995' }]}
                  onPress={() => setCodigoDigitado('')}>
                  <Text style={styles.funcKeyText}>LIMPAR</Text>
                </BotaoAnimado>
              </View>

              <View style={styles.funcKeyWrapper}>
                <BotaoAnimado
                  style={[styles.funcKey, { backgroundColor: '#9359F0' }]}
                  onPress={() => iniciarPrograma(codigoDigitado)}>
                  <Text style={styles.funcKeyText}>CONFIRMAR</Text>
                </BotaoAnimado>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitleLight}>ESCOLHA O PROGRAMA DISNEY:</Text>
          {Object.values(PROGRAMAS).map((item) => (
            <BotaoAnimado
              key={item.codigo}
              scaleTo={1.04}
              style={[
                styles.programCardClean,
                codigoDigitado === item.codigo && {
                  borderColor: '#F05995',
                  borderWidth: 2.5,
                  backgroundColor: '#3B0764',
                },
              ]}
              onPress={() => setCodigoDigitado(item.codigo)}>
              <Text style={styles.programCardTitleClean}>{item.titulo}</Text>
              <View style={[styles.codeBadge, { backgroundColor: item.corTema }]}>
                <Text style={styles.codeBadgeText}>{item.codigo}</Text>
              </View>
            </BotaoAnimado>
          ))}
        </ScrollView>
      </View>
    );
  }

  if (tela === 'JOGO') {
    const textoVisorPadrao = prog.titulo;
    const corTextoVisor = statusResposta === 'ERRO' ? '#FF1744' : '#00E676';
    const textoMensagemVisor =
      statusResposta === 'ACERTO'
        ? `* ACERTOU! +${tentativa === 1 ? '3' : tentativa === 2 ? '2' : '1'} PTS *`
        : statusResposta === 'ERRO' && tentativa === 3
        ? `* 0 PT (RESP: ${questaoObj.r}) *`
        : statusResposta === 'ERRO'
        ? '* ERROU! TENTE NOV. *'
        : '';

    return (
      <View style={styles.fullScreenContainer}>
        <StatusBar barStyle="light-content" translucent backgroundColor="#160B2E" />
        <CabecalhoSolido />
        {renderizarModalConfirmacao()}

        <ScrollView contentContainerStyle={styles.scrollFullContent}>
          <View style={styles.topMenuRow}>
            <BotaoAnimado
              style={styles.menuTopBtn}
              scaleTo={1.1}
              onPress={solicitarVoltarMenu}>
              <Text style={styles.menuTopBtnText}>MENU</Text>
            </BotaoAnimado>
          </View>

          <View style={styles.ledBezel}>
            <View style={styles.ledTopRow}>
              <Text style={styles.ledSmallIndicator}>QUESTÃO {questaoObj.n}</Text>
              <Text style={styles.ledSmallIndicator}>
                PTS: {String(pontos).padStart(2, '0')}
              </Text>
            </View>

            <Text
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              style={[
                styles.ledMainText,
                {
                  color: corTextoVisor,
                  fontSize: 20,
                  letterSpacing: 1,
                },
              ]}>
              {textoMensagemVisor !== '' ? textoMensagemVisor : textoVisorPadrao}
            </Text>
          </View>

          <View style={styles.attemptBar}>
            <Text style={styles.attemptText}>Tentativa {tentativa} de 3</Text>
            <Text style={styles.attemptWorthText}>
              (Vale {tentativa === 1 ? '3 pts' : tentativa === 2 ? '2 pts' : '1 pt'})
            </Text>
          </View>

          <View style={styles.bookCard}>
            <View>
              <Text style={styles.bookQuestionNumber}>
                Questão {questaoObj.n} do Programa {programaAtual}
              </Text>
              <Text style={styles.bookQuestionText}>{questaoObj.p}</Text>
            </View>

            <View style={styles.bookOptionsList}>
              {BOTOES_ALTERNATIVAS.map((btn) => (
                <BotaoAnimado
                  key={btn.letra}
                  scaleTo={1.04}
                  disabled={bloqueado}
                  style={[
                    styles.optionAnswerButton,
                    {
                      backgroundColor: btn.corFundo,
                      borderColor: btn.corBorda,
                    },
                  ]}
                  onPress={() => responder(btn.letra)}>
                  <View
                    style={[
                      styles.optionLetterBadge,
                      { backgroundColor: btn.corBadge },
                    ]}>
                    <Text style={[styles.optionLetterText, { color: btn.corTexto }]}>
                      {btn.letra}
                    </Text>
                  </View>
                  <Text style={[styles.optionAnswerLabel, { color: btn.corTexto }]}>
                    {questaoObj.op[btn.idx]}
                  </Text>
                </BotaoAnimado>
              ))}
            </View>
          </View>

          <BotaoAnimado
            style={styles.changeBookBtn}
            scaleTo={1.05}
            onPress={solicitarTrocarPrograma}>
            <Text style={styles.changeBookBtnText}>TROCAR PROGRAMA</Text>
          </BotaoAnimado>
        </ScrollView>
      </View>
    );
  }

  if (tela === 'RESULTADO') {
    const percentual = Math.round((pontos / 90) * 100);
    const atingiuOitentaPorcento = pontos >= 72;

    return (
      <View style={styles.fullScreenContainer}>
        <StatusBar barStyle="light-content" translucent backgroundColor="#160B2E" />
        <CabecalhoSolido />
        {renderizarModalConfirmacao()}
        <ChuvaConfeteAzul ativo={atingiuOitentaPorcento} />

        <ScrollView contentContainerStyle={styles.scrollFullContent}>
          <View style={styles.topBarWithArrow}>
            <BotaoSetaVoltar onPress={solicitarVoltarMenu} />
            <Text style={styles.screenSectionHeader}>FIM DO PROGRAMA {programaAtual}</Text>
          </View>

          <View style={styles.ledBezel}>
            <Text style={styles.ledSubLabelGreen}>TOTAL DE PONTOS OBTIDOS:</Text>
            <Text style={styles.ledMainTextGreen}>
              {pontos} / 90
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>RESULTADO FINAL</Text>
            <Text style={styles.infoParagraph}>
              Você concluiu as 30 perguntas do programa {prog.titulo} e marcou {pontos} de 90 pontos.
            </Text>
            {atingiuOitentaPorcento && (
              <Text style={styles.congratsBlueText}>Parabéns!</Text>
            )}
          </View>

          <View style={styles.menuBtnWrapper}>
            <BotaoAnimado
              style={[styles.menuBtnBox, { backgroundColor: '#F05995', borderColor: '#C23B73' }]}
              onPress={() => iniciarPrograma(programaAtual)}>
              <Text style={styles.menuBtnCompactText}>JOGAR NOVAMENTE</Text>
            </BotaoAnimado>
          </View>

          <View style={styles.menuBtnWrapper}>
            <BotaoAnimado
              style={[styles.menuBtnBox, { backgroundColor: '#5664F5', borderColor: '#3744C9' }]}
              onPress={solicitarTrocarPrograma}>
              <Text style={styles.menuBtnCompactText}>TROCAR PROGRAMA</Text>
            </BotaoAnimado>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (tela === 'REGRAS') {
    return (
      <View style={styles.fullScreenContainer}>
        <StatusBar barStyle="light-content" translucent backgroundColor="#160B2E" />
        <CabecalhoSolido />

        <ScrollView contentContainerStyle={styles.scrollFullContent}>
          <View style={styles.topBarWithArrow}>
            <BotaoSetaVoltar onPress={() => setTela('MENU')} />
            <Text style={styles.screenSectionHeader}>REGRAS</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Como Funciona o Pense Bem</Text>
            <Text style={styles.infoParagraph}>
              Baseado no clássico brinquedo eletrônico Pense Bem da TecToy e na edição
              "Walt Disney World & Epcot Center", este aplicativo contém os 5 programas
              oficiais: 081 até 085.
            </Text>

            <Text style={styles.infoTitle}>Regras de Pontuação</Text>
            <Text style={styles.infoBullet}>• Cada programa possui exatamente 30 perguntas.</Text>
            <Text style={styles.infoBullet}>
              • Para cada pergunta, o jogador tem até 3 tentativas de resposta (botões A, B, C ou D).
            </Text>
            <Text style={styles.infoBullet}>• Acerto na 1ª tentativa: ganha 3 pontos.</Text>
            <Text style={styles.infoBullet}>• Acerto na 2ª tentativa: ganha 2 pontos.</Text>
            <Text style={styles.infoBullet}>• Acerto na 3ª tentativa: ganha 1 ponto.</Text>
            <Text style={styles.infoBullet}>
              • Caso erre as 3 tentativas: não ganha pontos (0 pt) e o jogo avança para a pergunta seguinte.
            </Text>
            <Text style={styles.infoBullet}>
              • Ao atingir 80% ou mais (72+ pontos), uma chuva de confetes celebra sua conquista!
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (tela === 'CREDITOS') {
    return (
      <View style={styles.fullScreenContainer}>
        <StatusBar barStyle="light-content" translucent backgroundColor="#160B2E" />
        <CabecalhoSolido />

        <ScrollView contentContainerStyle={styles.scrollFullContent}>
          <View style={styles.topBarWithArrow}>
            <BotaoSetaVoltar onPress={() => setTela('MENU')} />
            <Text style={styles.screenSectionHeader}>CRÉDITOS</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Dados Acadêmicos</Text>
            <Text style={styles.infoBullet}>• Instituição: {CREDITOS_GRUPO.instituicao}</Text>
            <Text style={styles.infoBullet}>• Curso: {CREDITOS_GRUPO.curso}</Text>
            <Text style={styles.infoBullet}>• Disciplina: {CREDITOS_GRUPO.disciplina}</Text>
            <Text style={styles.infoBullet}>• Professor: {CREDITOS_GRUPO.professor}</Text>

            <Text style={styles.infoTitle}>Integrantes do Grupo</Text>
            {CREDITOS_GRUPO.alunos.map((al, i) => (
              <Text key={i} style={styles.infoBullet}>
                • {al.nome} ({al.ra})
              </Text>
            ))}

            <Text style={styles.infoTitle}>Edição Temática</Text>
            <Text style={styles.infoBullet}>• Obra base: {CREDITOS_GRUPO.livro}</Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  fullScreenRoot: {
    flex: 1,
    backgroundColor: '#000000',
  },
  fullScreenBgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  bgImageCentered: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  menuOverlayContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 50,
    justifyContent: 'space-between',
  },
  headerWrapperTransparent: {
    width: '100%',
    paddingTop: 60,
    paddingBottom: 8,
    backgroundColor: 'transparent',
  },
  topHeaderSolidBand: {
    paddingTop: 44,
    backgroundColor: '#160B2E',
  },
  headerWrapperSolid: {
    backgroundColor: '#160B2E',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
  },
  brandHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tectoyBadge: {
    backgroundColor: '#EC5393',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tectoyLogoText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  penseBemLogoText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#93C5FD',
    letterSpacing: 0.4,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  menuBottomContent: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 4,
  },
  titlesBlock: {
    alignItems: 'center',
    marginTop: 14,
  },
  disneyTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.2,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  epcotSubtitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#E2E8F0',
    letterSpacing: 2,
    marginTop: 6,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  menuButtonsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 22,
  },
  menuBtnWrapper: {
    width: '72%',
    alignSelf: 'center',
    marginBottom: 12,
  },
  menuBtnBox: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderBottomWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBtnCompactText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  footerCopyrightText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#1E0B36',
  },
  scrollFullContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
    backgroundColor: '#1E0B36',
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    elevation: 999,
  },
  arrowBackBtn: {
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 5,
    marginBottom: 8,
  },
  arrowIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 16,
  },
  arrowHead: {
    width: 12,
    height: 12,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: '#9CA3AF',
    transform: [{ rotate: '45deg' }],
    marginRight: -10,
  },
  arrowStem: {
    width: 30,
    height: 3,
    backgroundColor: '#9CA3AF',
    borderRadius: 0,
  },
  topBarWithArrow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  screenSectionHeader: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F05995',
    letterSpacing: 1,
    marginBottom: 8,
  },
  ledBezelLivro: {
    backgroundColor: '#050505',
    borderRadius: 12,
    paddingTop: 14,
    paddingBottom: 6,
    paddingHorizontal: 16,
    borderWidth: 3.5,
    borderColor: '#9359F0',
    alignItems: 'center',
    marginBottom: 14,
    elevation: 5,
  },
  displayLedContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 0,
  },
  letraVisorTraco: {
    fontFamily: 'monospace',
    fontSize: 56,
    fontWeight: '900',
    textAlign: 'center',
    marginHorizontal: 8,
    lineHeight: 55,
  },
  letraVazia: {
    color: '#1F2937',
  },
  letraDigitada: {
    color: '#00E676',
    textShadowColor: 'rgba(0, 230, 118, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#2E1065',
    width: '100%',
    maxWidth: 340,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#F05995',
  },
  modalIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F05995',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIconExclamation: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E2E8F0',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  modalCloseButton: {
    backgroundColor: '#F05995',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    borderBottomWidth: 4,
    borderColor: '#C23B73',
  },
  modalCloseButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalHalfButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderColor: 'rgba(0,0,0,0.3)',
  },
  ledBezel: {
    backgroundColor: '#050505',
    borderRadius: 10,
    paddingHorizontal: 14,
    justifyContent: 'center',
    height: 85,
    borderWidth: 3,
    borderColor: '#9359F0',
    alignItems: 'center',
    marginBottom: 12,
  },
  ledTopRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  ledSmallIndicator: {
    color: '#38BDF8',
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: 'bold',
  },
  ledSubLabelGreen: {
    color: '#69F0AE',
    fontFamily: 'monospace',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  ledMainTextGreen: {
    color: '#00E676',
    fontFamily: 'monospace',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
    marginVertical: 4,
  },
  ledMainText: {
    fontFamily: 'monospace',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 2.5,
    textAlign: 'center',
    marginVertical: 4,
  },
  retroKeypadBox: {
    backgroundColor: '#2E1065',
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#9359F0',
  },
  keypadNumbersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  numKeyWrapper: {
    width: '18%',
    marginBottom: 6,
  },
  numKey: {
    backgroundColor: '#F5F3FF',
    width: '100%',
    height: 42,
    borderRadius: 6,
    justifyContent: 'center',
    alignContent: 'center',
    borderBottomWidth: 3,
    borderColor: '#C4B5FD',
  },
  numKeyText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#4C1D95',
    textAlign: 'center',
  },
  keypadActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  funcKeyWrapper: {
    width: '48%',
  },
  funcKey: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  funcKeyText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.8,
  },
  sectionTitleLight: {
    fontSize: 13,
    fontWeight: '900',
    color: '#F9A8D4',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  programCardClean: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2E1065',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#5664F5',
    marginBottom: 8,
  },
  programCardTitleClean: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 8,
  },
  codeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  codeBadgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
  },
  topMenuRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  menuTopBtn: {
    backgroundColor: '#F05995',
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#F9A8D4',
  },
  menuTopBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1,
  },
  attemptBar: {
    backgroundColor: '#2E1065',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#9359F0',
  },
  attemptText: {
    color: '#FFFFFF',
    fontFamily: 'monospace',
    fontSize: 15,
    fontWeight: 'bold',
  },
  attemptWorthText: {
    color: '#F05995',
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  bookCard: {
    backgroundColor: '#F5F3FF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: '#F05995',
    marginBottom: 12,
    height: 400,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  bookQuestionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6D28D9',
    marginBottom: 4,
  },
  bookQuestionText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1E1B4B',
    marginBottom: 12,
  },
  bookOptionsList: {
    marginTop: 4,
  },
  optionAnswerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderBottomWidth: 4,
    marginBottom: 8,
  },
  optionLetterBadge: {
    width: 30,
    height: 30,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionLetterText: {
    fontWeight: '900',
    fontSize: 16,
  },
  optionAnswerLabel: {
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
  },
  changeBookBtn: {
    backgroundColor: '#5664F5',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderColor: '#3744C9',
  },
  changeBookBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
  infoCard: {
    backgroundColor: '#F5F3FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#F05995',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#4C1D95',
    marginTop: 8,
    marginBottom: 6,
  },
  infoParagraph: {
    fontSize: 14,
    color: '#1E1B4B',
    lineHeight: 20,
    marginBottom: 8,
  },
  congratsBlueText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0284C7',
    marginTop: 6,
  },
  infoBullet: {
    fontSize: 14,
    color: '#1E1B4B',
    lineHeight: 22,
    marginBottom: 4,
  },
});
