import { useState, useRef, useEffect } from 'react';
import ModalWrapper from './ModalWrapper';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  GeoPoint,
} from 'firebase/firestore';
import { User, MapPin, Settings, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import {
  ChampionshipDataModel,
  ModalityRules,
  isValidCapacity,
  getMinTeams,
  calculateGeohash,
  createGeoPoint,
} from '../utils/geoUtils';

const STEP_COUNT = 3;

/**
 * ========================================================================================
 * SUB-COMPONENTE: LocationStep (Passo 1)
 * I-3.3: Mapa Interativo e Places Autocomplete (MIGRADO para Advanced Marker/PlaceAutocompleteElement)
 * I-3.4: Geocoding Reverso e Cálculo do GeoHash
 * ========================================================================================
 */
const LocationStep = ({ formData, setFormData, setError }) => {
  const mapContainerRef = useRef(null); // Referência para o container do mapa
  const autocompleteContainerRef = useRef(null); // Referência para o container do Autocomplete Element

  const [mapInstance, setMapInstance] = useState(null);
  const [markerInstance, setMarkerInstance] = useState(null);

  // Posição padrão (Ex: Centro de São Paulo, se não houver posição prévia)
  const defaultPosition = { lat: -23.55052, lng: -46.633309 };
  const initialPosition = formData.localGeoPoint
    ? {
        lat: formData.localGeoPoint.latitude,
        lng: formData.localGeoPoint.longitude,
      }
    : defaultPosition;

  // I-3.4: Reversa Geocoding: Converte Lat/Lng para Endereço
  const reverseGeocode = async (latLng) => {
    if (typeof window.google === 'undefined' || !window.google.maps.Geocoder)
      return;

    const geocoder = new window.google.maps.Geocoder();
    try {
      const lat = latLng.lat;
      const lng = latLng.lng;

      // O Geocoder usa o formato {lat, lng} simples
      const response = await geocoder.geocode({ location: { lat, lng } });

      let address = 'Localização não reconhecida';

      if (response.results[0]) {
        address = response.results[0].formatted_address;
      }

      setFormData((prev) => ({
        ...prev,
        address: address,
        localGeoPoint: createGeoPoint(lat, lng),
        geohash: calculateGeohash(lat, lng), // I-3.4: Calcula GeoHash
      }));
      setError('');
    } catch (e) {
      console.error('Erro no Geocoding Reverso:', e);
      setError('Erro ao carregar endereço. Tente novamente.');
    }
  };

  // I-3.3: Inicialização do Mapa, Marcador e Autocomplete (MIGRADO)
  useEffect(() => {
    const initMapAndServices = async () => {
      // Verifica se a API do Google Maps está carregada
      if (typeof window.google === 'undefined' || !mapContainerRef.current)
        return;

      // Carrega as bibliotecas dinamicamente
      // Assegure-se que as bibliotecas 'maps', 'marker' e 'places' estão carregadas no index.html
      const { Map } = await window.google.maps.importLibrary('maps');
      const { AdvancedMarkerElement, PinElement } =
        await window.google.maps.importLibrary('marker');
      const { PlaceAutocompleteElement } =
        await window.google.maps.importLibrary('places');

      // --- 1. Inicializa o Mapa ---
      const mapOptions = {
        center: initialPosition,
        zoom: 14,
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        disableDefaultUI: true,
        zoomControl: true,
        mapId: 'DEMO_MAP_ID', // Requerido para Advanced Markers
      };

      const map = new Map(mapContainerRef.current, mapOptions);
      setMapInstance(map);

      // --- 2. Inicializa o Marcador Avançado (I-3.3) ---
      const pinElement = new PinElement({
        background: '#b554b5', // Cor primária do seu projeto
        borderColor: '#863D86',
        glyphColor: '#FFFFFF',
      });

      const marker = new AdvancedMarkerElement({
        position: initialPosition,
        map: map,
        content: pinElement.element,
        gmpDraggable: true, // Permite arrastar no AdvancedMarkerElement
      });
      setMarkerInstance(marker);

      // Listener: Arrastar marcador (I-3.4)
      marker.addListener('dragend', () => {
        // A posição do Advanced Marker já é um objeto {lat, lng} simples
        const newPos = {
          lat: marker.position.lat,
          lng: marker.position.lng,
        };
        reverseGeocode(newPos);
      });

      // --- 3. Inicializa o PlaceAutocompleteElement (I-3.3) ---
      const autocompleteElement = new PlaceAutocompleteElement({
        type: 'establishment', // Filtro de tipo para estabelecimentos (quadras, ginásios)
        inputElement: document.createElement('input'),
        fields: ['geometry', 'formatted_address'],
        componentRestrictions: { country: 'br' },
      });

      // Adiciona a classe Tailwind para estilização
      autocompleteElement.inputElement.className =
        'w-full p-3 bg-[var(--bg-color2)] rounded-lg border border-gray-600 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] text-white placeholder-gray-400';
      autocompleteElement.inputElement.placeholder =
        'Busque o endereço (ex: Arena Society, Ginásio)';

      // Limpa o container e anexa o novo elemento
      autocompleteContainerRef.current.innerHTML = '';
      autocompleteContainerRef.current.appendChild(
        autocompleteElement.inputElement,
      );

      // Listener: Seleção do Autocomplete (I-3.4)
      autocompleteElement.addListener('placechange', async () => {
        const place = autocompleteElement.getPlace();

        if (!place.geometry) {
          setError('Local selecionado inválido. Tente novamente.');
          return;
        }

        const newPos = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        // Centraliza o mapa e move o marcador
        map.setCenter(newPos);
        marker.position = newPos;

        // Atualiza o formulário
        reverseGeocode(newPos);
      });

      // --- 4. Inicialização do Endereço ---
      // Realiza o geocoding reverso inicial caso a posição seja a padrão
      if (!formData.address) {
        reverseGeocode(initialPosition);
      }
    };

    // Adiciona um timeout para garantir que o script do Google Maps foi deferido
    // Isso é uma prática comum em aplicações React/Vite com Google Maps
    const timer = setTimeout(initMapAndServices, 500);

    return () => clearTimeout(timer); // Limpa o timer
  }, []);

  // Atualiza a posição do marcador no mapa sempre que as coordenadas mudam no formData
  useEffect(() => {
    if (mapInstance && markerInstance && formData.localGeoPoint) {
      const newPos = {
        lat: formData.localGeoPoint.latitude,
        lng: formData.localGeoPoint.longitude,
      };
      // Atualiza o marcador e o centro do mapa se a posição no estado for diferente
      if (
        markerInstance.position.lat !== newPos.lat ||
        markerInstance.position.lng !== newPos.lng
      ) {
        markerInstance.position = newPos;
        mapInstance.setCenter(newPos);
      }
    }
  }, [formData.localGeoPoint, mapInstance, markerInstance]);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white flex items-center gap-2">
        <MapPin size={20} /> Passo 1: Localização
      </h3>
      <p className="text-sm text-gray-400">
        Arraste o marcador no mapa ou use a busca de endereço abaixo.
      </p>

      {/* Container para o Place Autocomplete Element (I-3.3) */}
      {/* O Google Maps injetará o input aqui */}
      <div ref={autocompleteContainerRef} className="w-full">
        {/* Placeholder para o Autocomplete Element enquanto carrega */}
        <input
          type="text"
          placeholder="Carregando busca..."
          className="w-full p-3 bg-[var(--bg-color2)] rounded-lg border border-gray-600 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] text-white placeholder-gray-400"
          disabled
        />
      </div>

      {/* Mapa Interativo (I-3.3) */}
      <div
        ref={mapContainerRef}
        className="h-64 rounded-lg shadow-inner border border-gray-700 bg-gray-800"
      >
        {/* O mapa do Google Maps será renderizado aqui */}
      </div>

      <div className="p-3 bg-gray-800/50 rounded-lg text-xs text-gray-300 border border-gray-700">
        <p className="font-semibold mb-1">Localização Atual:</p>
        <p className="truncate">
          {formData.address || 'Arraste o marcador para definir a posição'}
        </p>
      </div>
    </div>
  );
};

// ========================================================================================
// Componente Principal CreateChampionshipModal
// ========================================================================================

const CreateChampionshipModal = ({ onClose }) => {
  const { currentUser } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    ...ChampionshipDataModel,
    modality: 'Futsal',
    totalSlots: 10, // Define um valor inicial válido para testes
    organizerId: currentUser?.uid,
    organizerName: currentUser?.name || currentUser?.displayName,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleNextStep = () => {
    setError('');
    if (step < STEP_COUNT) {
      // I-3.4: Validação Passo 1: Localização
      if (step === 1) {
        if (!formData.localGeoPoint || !formData.address || !formData.geohash) {
          setError(
            'Por favor, defina a localização no mapa e certifique-se de que o GeoHash foi gerado.',
          );
          return;
        }
      }

      // Validação Passo 2: Regras e Capacidade (A ser expandida na Parte 3)
      if (step === 2) {
        // Validação de teste simples até a implementação completa
        if (
          !formData.modality ||
          !formData.totalSlots ||
          !isValidCapacity(formData.modality, formData.totalSlots)
        ) {
          setError(
            'A capacidade mínima de jogadores não foi atingida para a modalidade escolhida.',
          );
          return;
        }
      }

      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
    }
  };

  // Mantido para os próximos passos (2 e 3)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    // I-3.7: Validação final da senha
    if (formData.privacyType === 'Privado' && !formData.password) {
      setError('A senha é obrigatória para campeonatos privados.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // I-3.8: 1. Gerar ID único de 6 dígitos
      const championshipId = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

      // I-3.8: 2. Criar novo documento no Firestore
      const newChampionship = {
        ...formData,
        championshipId,
        status: 'Aberto',
        createdAt: serverTimestamp(),
        participants: [],
        teams: [],
      };

      // Remove a senha se o tipo for Público
      if (newChampionship.privacyType !== 'Privado') {
        delete newChampionship.password;
      }

      // Usa a coleção 'championships' conforme o plano
      await addDoc(collection(db, 'championships'), newChampionship);

      setSuccess(`Campeonato criado com sucesso! ID: ${championshipId}`);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (e) {
      console.error('Erro ao criar campeonato:', e);
      setError('Erro ao publicar o campeonato. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <LocationStep
            formData={formData}
            setFormData={setFormData}
            setError={setError}
          />
        );
      case 2:
        // Passo 2: Regras e Capacidade (Próxima parte)
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Settings size={20} /> Passo 2: Regras e Formato
            </h3>
            <p className="text-sm text-gray-400">
              Defina a modalidade, capacidade total, data e o formato da
              competição.
            </p>
            <div className="h-48 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
              [IMPLEMENTAÇÃO DO PASSO 2 AQUI]
            </div>
          </div>
        );
      case 3:
        // Passo 3: Privacidade e Times (Próxima parte)
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Lock size={20} /> Passo 3: Privacidade e Times
            </h3>
            <p className="text-sm text-gray-400">
              Escolha como os times serão formados e quem pode participar.
            </p>
            <div className="h-48 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
              [IMPLEMENTAÇÃO DO PASSO 3 AQUI]
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ModalWrapper
      title={`Criar Campeonato (Passo ${step}/${STEP_COUNT})`}
      onClose={onClose}
    >
      <div className="p-4 sm:p-6 space-y-4">
        {error && (
          <p className="text-red-500 text-center bg-red-900/30 p-2 rounded-lg">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-500 text-center bg-green-900/30 p-2 rounded-lg">
            {success}
          </p>
        )}

        {renderStepContent()}

        <div className="flex justify-between pt-4 border-t border-gray-700/50">
          <button
            onClick={handlePreviousStep}
            disabled={step === 1 || isSubmitting}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-30"
          >
            Voltar
          </button>
          <button
            onClick={handleNextStep}
            disabled={isSubmitting}
            className="bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)] text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {step < STEP_COUNT
              ? 'Próximo'
              : isSubmitting
              ? 'Publicando...'
              : 'Finalizar'}
          </button>
        </div>
        <div className="text-xs text-gray-500 text-right">
          Campos obrigatórios: Passo 1: Localização; Passo 2: Modalidade e
          Capacidade.
        </div>
      </div>
    </ModalWrapper>
  );
};

export default CreateChampionshipModal;
