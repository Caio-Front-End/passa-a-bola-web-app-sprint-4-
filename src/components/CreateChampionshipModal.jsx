import { useState, useRef, useEffect } from 'react';
import ModalWrapper from './ModalWrapper';
import { db } from '../firebase'; // Importar o Firestore
import {
  collection,
  addDoc,
  serverTimestamp,
  GeoPoint,
} from 'firebase/firestore'; // Incluir GeoPoint
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

/*
 *  SUB-COMPONENTE: LocationStep
 *  Mapa Interativo e Places Autocomplete
 *  Geocoding Reverso e Cálculo do GeoHash
 */
const LocationStep = ({ formData, setFormData, setError }) => {
  const mapRef = useRef(null);
  const autocompleteInputRef = useRef(null);
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

  // Reversa Geocoding: Converte Lat/Lng para Endereço
  const reverseGeocode = async (latLng) => {
    if (typeof window.google === 'undefined' || !window.google.maps.Geocoder)
      return;

    const geocoder = new window.google.maps.Geocoder();
    try {
      const lat = latLng.lat();
      const lng = latLng.lng();

      const response = await geocoder.geocode({ location: latLng });

      let address = 'Localização não reconhecida';

      if (response.results[0]) {
        address = response.results[0].formatted_address;
      }

      setFormData((prev) => ({
        ...prev,
        address: address,
        localGeoPoint: createGeoPoint(lat, lng),
        // Calcula GeoHash
        geohash: calculateGeohash(lat, lng),
      }));
      setError('');
    } catch (e) {
      console.error('Erro no Geocoding Reverso:', e);
      setError('Erro ao carregar endereço. Tente novamente.');
    }
  };

  // Inicialização do Mapa e Listeners
  useEffect(() => {
    // Garantir que a API do Google Maps esteja carregada
    if (typeof window.google === 'undefined' || !mapRef.current) return;

    const mapOptions = {
      center: initialPosition,
      zoom: 14,
      fullscreenControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      // Desabilita UI padrão e permite apenas arrastar o mapa ou o marcador
      disableDefaultUI: true,
      zoomControl: true,
    };

    const map = new window.google.maps.Map(mapRef.current, mapOptions);
    setMapInstance(map);

    const marker = new window.google.maps.Marker({
      position: initialPosition,
      map: map,
      // Permite arrastar
      draggable: true,
      title: 'Local do Campeonato',
    });
    setMarkerInstance(marker);

    // Listener: Arrastar marcador
    marker.addListener('dragend', () => {
      const newPos = marker.getPosition();
      reverseGeocode(newPos);
    });

    // Inicialização do Autocomplete
    const autocomplete = new window.google.maps.places.Autocomplete(
      autocompleteInputRef.current,
      {
        // Filtro para estabelecimentos de esporte
        types: ['establishment', 'point_of_interest'],
        fields: ['geometry', 'formatted_address'],
        // Focado no Brasil
        componentRestrictions: { country: 'br' },
      },
    );

    // Listener: Seleção do Autocomplete
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      const newPos = place.geometry.location;

      // Centraliza o mapa e move o marcador
      map.setCenter(newPos);
      marker.setPosition(newPos);

      // Atualiza o formulário com o endereço formatado e as coordenadas
      reverseGeocode(newPos);
    });

    // Realiza o geocoding reverso inicial caso a posição seja a padrão
    if (!formData.address) {
      reverseGeocode(new window.google.maps.LatLng(initialPosition));
    }
  }, []); // Executa apenas uma vez na montagem

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white flex items-center gap-2">
        <MapPin size={20} /> Passo 1: Localização
      </h3>
      <p className="text-sm text-gray-400">
        Arraste o marcador no mapa ou use a busca de endereço abaixo.
      </p>

      {/* Input para Places Autocomplete */}
      <input
        ref={autocompleteInputRef}
        type="text"
        placeholder="Busque o endereço (ex: Arena Society, Ginásio)"
        defaultValue={formData.address}
        // O valor é primariamente atualizado pelo listener do Autocomplete e Reverse Geocoding
        // A função onChange é mantida para garantir que o Autocomplete funcione com a digitação
        className="w-full p-3 bg-[var(--bg-color2)] rounded-lg border border-gray-600 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] text-white"
      />

      {/* Mapa Interativo */}
      <div
        ref={mapRef}
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

// Componente Principal CreateChampionshipModal

const CreateChampionshipModal = ({ onClose }) => {
  const { currentUser } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    ...ChampionshipDataModel,
    modality: 'Futsal',
    organizerId: currentUser?.uid,
    organizerName: currentUser?.name || currentUser?.displayName,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleNextStep = () => {
    setError('');
    if (step < STEP_COUNT) {
      // Validação Passo 1: Localização
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    // Validação final da senha
    if (formData.privacyType === 'Privado' && !formData.password) {
      setError('A senha é obrigatória para campeonatos privados.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Gerar ID único de 6 dígitos
      // Garante que o ID seja único em escopo global (pequena chance de colisão, mas suficiente para MVP)
      const championshipId = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

      // Criar novo documento no Firestore
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

      // O documento deve ser salvo na coleção pública para ser acessível a todos os usuários
      // Caminho sugerido: /artifacts/{appId}/public/championships/{documentId}
      // Como não temos o __app_id, usaremos a coleção padrão 'championships'
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
        // Regras e Capacidade
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
        // Privacidade e Times
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
