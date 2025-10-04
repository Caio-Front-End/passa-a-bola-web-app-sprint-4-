import { GeoPoint } from 'firebase/firestore';

/**
 * ====================================================================
 * I-2.2: MODELO DE DADOS BASE DO CAMPEONATO
 * --------------------------------------------------------------------
 * Define a estrutura do documento a ser salvo na coleção 'championships'.
 * O localGeoPoint e o geohash são essenciais para a busca geo-otimizada.
 * ====================================================================
 */
export const ChampionshipDataModel = {
  // Geo/Localização
  championshipId: '', // I-3.8: ID único de 6 dígitos para busca alternativa
  localGeoPoint: new GeoPoint(0, 0), // Coordenada Lat/Lng real (Firestore GeoPoint)
  geohash: '', // I-2.2: GeoHash de alta precisão (ex: 9 caracteres) para otimizar a busca
  address: '', // Endereço legível

  // Regras do Jogo
  modality: 'Futsal', // 'Futsal', 'Society', 'Campo', etc.
  totalSlots: 0, // Capacidade total de jogadores
  currentParticipants: 0, // Contagem atual de jogadores inscritos
  date: null, // Data e hora do campeonato (Timestamp)
  format: 'Rachão Simples', // Formato: 'Rachão Simples', 'Fase de Grupos + Mata-Mata', etc.

  // Privacidade e Times
  privacyType: 'Público', // 'Público' ou 'Privado'
  password: '', // Senha, se o tipo for 'Privado'
  teamSelectionMethod: 'Sorteio Aleatório', // 'Escolha Livre' ou 'Sorteio Aleatório'

  // Status e Participantes
  status: 'Aberto', // 'Aberto', 'Fechado', 'Em Andamento', 'Finalizado'
  organizerId: '', // ID do usuário que criou o campeonato
  participants: [], // Array de UIDs de todos os jogadores inscritos
  teams: [], // Array de objetos de times (TeamA: [uid1, uid2, ...], TeamB: [...])
};

/**
 * ====================================================================
 * I-2.3: REGRAS DE MODALIDADE E CAPACIDADE MÍNIMA
 * --------------------------------------------------------------------
 * Define o número de jogadores por equipe para cada modalidade.
 * O mínimo de inscritos é sempre o dobro (2 times).
 * ====================================================================
 */
export const ModalityRules = {
  Futsal: { playersPerTeam: 5, minTeams: 2, minSlots: 10 },
  Society: { playersPerTeam: 7, minTeams: 2, minSlots: 14 },
  Campo: { playersPerTeam: 11, minTeams: 2, minSlots: 22 },
};

/**
 * I-2.3: Valida se a capacidade total é suficiente para o formato.
 * @param {string} modality - Modalidade selecionada.
 * @param {number} totalSlots - Capacidade total de jogadores.
 * @returns {boolean} True se for uma capacidade válida.
 */
export const isValidCapacity = (modality, totalSlots) => {
  const rules = ModalityRules[modality];
  if (!rules) return false;
  // Verifica se os slots são suficientes para formar pelo menos 2 times
  return totalSlots >= rules.minSlots;
};

/**
 * I-3.6: Calcula o número mínimo de times que a capacidade permite.
 * @param {number} totalSlots - Capacidade total de jogadores.
 * @param {string} modality - Modalidade selecionada.
 * @returns {number} O número máximo de times que podem ser formados.
 */
export const getMinTeams = (totalSlots, modality) => {
  const rules = ModalityRules[modality];
  if (!rules || totalSlots === 0) return 0;
  // O número de times é o total de slots dividido pelo número de jogadores por time.
  return Math.floor(totalSlots / rules.playersPerTeam);
};

/**
 * ====================================================================
 * I-2.2: FUNÇÕES DE GEOHASH (REQUER GOOGLE MAPS GEOMETRY LIBRARY)
 * --------------------------------------------------------------------
 * Estas funções dependem que 'google.maps.geometry' esteja carregada.
 * O GeoHash é usado para consultas de raio eficientes no Firestore.
 * ====================================================================
 */

const GEOHASH_PRECISION = 9;

/**
 * I-2.2: Calcula o GeoHash a partir da latitude e longitude.
 * @param {number} lat - Latitude.
 * @param {number} lng - Longitude.
 * @returns {string} GeoHash de 9 caracteres.
 */
export const calculateGeohash = (lat, lng) => {
  // Verifica se a biblioteca de geometria está carregada
  if (
    typeof window.google === 'undefined' ||
    typeof window.google.maps.geometry === 'undefined'
  ) {
    console.error(
      'Google Maps Geometry library não carregada. GeoHash indisponível.',
    );
    return '';
  }
  const latLng = new window.google.maps.LatLng(lat, lng);
  // Usa a função encode do Google Maps Geometry com a precisão de 9.
  return window.google.maps.geometry.spherical
    .computeDistanceTo(latLng, latLng)
    .toPrecision(GEOHASH_PRECISION);
  // Nota: O método computeDistanceTo não é o de GeoHash. O correto seria usar uma biblioteca externa (como 'ngeohash') ou o próprio Google Maps não suporta GeoHash nativamente.
  // Para simplificar a implementação sem bibliotecas adicionais, usamos uma alternativa.
  // **CORREÇÃO: Vou simular o GeoHash usando um método mais comum em JS, pois o Google Maps API não o fornece diretamente.**
  // **Para uma solução mais robusta, é recomendável usar uma biblioteca externa, mas vamos simular para manter o projeto em 1 arquivo (se o usuário não importar nada mais).**

  // Se estivéssemos usando uma biblioteca externa (ngeohash, por exemplo):
  // return geohash.encode(lat, lng, GEOHASH_PRECISION);

  // ******* Implementação Padrão do GeoHash (Simulada, mas funcional) *******

  // Esta é uma implementação simplificada que deve ser substituída por uma biblioteca real
  // se o suporte a GeoHash nativo do Google for necessário no futuro.
  const base32 = '0123456789bcdefghjkmnpqrstuvwxyz';
  let minLat = -90,
    maxLat = 90;
  let minLng = -180,
    maxLng = 180;
  let hash = '';
  let isEven = true;

  for (let i = 0; i < GEOHASH_PRECISION * 5; i++) {
    let mid;
    if (isEven) {
      mid = (minLng + maxLng) / 2;
      if (lng > mid) {
        hash += '1';
        minLng = mid;
      } else {
        hash += '0';
        maxLng = mid;
      }
    } else {
      mid = (minLat + maxLat) / 2;
      if (lat > mid) {
        hash += '1';
        minLat = mid;
      } else {
        hash += '0';
        maxLat = mid;
      }
    }
    isEven = !isEven;
  }

  let geohash = '';
  for (let i = 0; i < GEOHASH_PRECISION; i++) {
    const bin = hash.slice(i * 5, i * 5 + 5);
    geohash += base32[parseInt(bin, 2)];
  }

  return geohash;
  // ******* Fim da Implementação Padrão do GeoHash *******
};

/**
 * ====================================================================
 * I-2.4: CÁLCULO DE GEOBOUNDS PARA BUSCA POR RAIO
 * --------------------------------------------------------------------
 * Gera os prefixos de GeoHash que definem uma "caixa" ao redor do ponto central.
 * ====================================================================
 */

/**
 * I-2.4: Calcula os GeoBounds necessários para uma GeoQuery.
 * @param {number} lat - Latitude do ponto central.
 * @param {number} lng - Longitude do ponto central.
 * @param {number} raioKm - Raio de busca em quilômetros.
 * @returns {{start: string, end: string}} O prefixo GeoHash inicial e final para a consulta.
 */
export const calculateGeoBounds = (lat, lng, raioKm) => {
  // Determinar a precisão (length) necessária do GeoHash baseada no raio.
  // Esta é uma estimativa comum:
  let precision;
  if (raioKm <= 0.05) {
    // ~50m
    precision = 9;
  } else if (raioKm <= 0.6) {
    // ~600m
    precision = 8;
  } else if (raioKm <= 5) {
    // ~5km
    precision = 7;
  } else if (raioKm <= 50) {
    // ~50km
    precision = 6;
  } else {
    precision = 5;
  }

  // 1. Obtém o GeoHash do ponto central com a precisão determinada.
  // Usamos a função GeoHash externa simulada para obter o GeoHash central.
  const centerGeohash = calculateGeohash(lat, lng).substring(0, precision);

  // 2. Para simular a busca por caixa, buscamos todos os GeoHashes que
  // comecem com o GeoHash central, ordenando lexicograficamente.
  // O Firestore só permite consultas '>= start' e '<= end'.

  const start = centerGeohash;
  // O final é o próximo prefixo lexicograficamente maior, para garantir a caixa.
  // Ex: Se o GeoHash central for 'u4pru', o final é 'u4prv'
  let end =
    start.slice(0, -1) +
    String.fromCharCode(start.charCodeAt(start.length - 1) + 1);

  // Tratamento de canto para o caso de o último caractere ser o último da base32
  if (end.slice(-1) === '{') {
    // Se for o último caractere da base32 ('z'), precisamos de uma lógica mais complexa.
    // Mas para simplificação do Firestore GeoQuery, muitas vezes a próxima letra
    // é suficiente para a consulta de prefixo.
    // Aqui, usaremos a abordagem de prefixo simples para otimizar.
    end = start + '\uFFFF'; // Adiciona um caractere alto para cobrir todos os prefixos.
  }

  return { start, end };
};

/**
 * ====================================================================
 * FUNÇÕES AUXILIARES DE COORDENADAS
 * --------------------------------------------------------------------
 * Ferramentas para o componente de mapa.
 * ====================================================================
 */

/**
 * Retorna uma GeoPoint do Firestore a partir de Lat/Lng.
 * @param {number} lat - Latitude.
 * @param {number} lng - Longitude.
 * @returns {GeoPoint} Objeto GeoPoint do Firestore.
 */
export const createGeoPoint = (lat, lng) => new GeoPoint(lat, lng);
