// Arquivo: src/data/jogoData.js

// 1. Importando os logos locais
import logoNossoTime from '../assets/img/logo-pab.png';
import logoCruzeiro from '../assets/img/logos/cruzeiro-logo.png';
import logoPalmeiras from '../assets/img/logos/palmeiras-logo.png';

export const proximoJogoInfo = {
  data: new Date(2025, 8, 25),
  timeCasa: {
    nome: 'Nosso Time',
    logo: logoNossoTime, // 2. Usando a imagem local importada
  },
  adversario: {
    nome: 'Palmeiras',
    logo: logoPalmeiras, // 3. Usando a imagem local importada
  },
  campeonato: 'Liga das Campeãs',
  horario: '19:30',
  historico: [
    { id: 1, placar: '0x2', campeonato: 'Liga das Campeãs', fase: 'Fase de Grupos - Volta' },
    { id: 2, placar: '1x1', campeonato: 'Liga das Campeãs', fase: 'Fase de Grupos - Ida' },
    { id: 3, placar: '1x0', campeonato: 'Passa a Bola', fase: 'Quartas de finais - Volta' },
  ],
  elencoAdversario: {
    formacao: '4-3-3',
    atacantes: [
      { id: 7, nome: 'Beatriz Z.' },{ id: 8, nome: 'Amanda G.' },{ id: 9, nome: 'Lais E.' },
    ],
    meioCampo: [
      { id: 4, nome: 'Larissa R.' },{ id: 5, nome: 'Sabrina C.' },{ id: 6, nome: 'Luara W.' },
    ],
    defensores: [
      { id: 1, nome: 'Luana P.' },{ id: 2, nome: 'Julia S.' },{ id: 3, nome: 'Manuela C.' },{ id: 10, nome: 'Duda S.' },
    ],
    goleira: [{ id: 11, nome: 'Bia Haddad' }],
  },
};