import { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import { ArrowRight, Search, Plus, Clock, X } from 'lucide-react';
import CreateChampionshipModal from '../components/CreateChampionshipModal';

const CourtsPage = () => {
  const [allChampionships, setAllChampionships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // States for filters
  const [searchId, setSearchId] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedModality, setSelectedModality] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');

  useEffect(() => {
    const fetchChampionships = async () => {
      setLoading(true);
      try {
        const championshipsCollection = collection(db, 'championships');
        const q = query(championshipsCollection);
        const querySnapshot = await getDocs(q);
        const champsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        champsList.sort((a, b) => {
          const dateA = a.createdAt?.toDate() || 0;
          const dateB = b.createdAt?.toDate() || 0;
          return dateB - dateA;
        });

        setAllChampionships(champsList);
      } catch (error) {
        console.error('Erro ao buscar campeonatos:', error);
      }
      setLoading(false);
    };

    fetchChampionships();
  }, [isModalOpen]);

  // Memoized lists for filters and filtered results
  const availableCities = useMemo(() => {
    const cities = allChampionships.map((champ) => champ.city).filter(Boolean);
    return [...new Set(cities)];
  }, [allChampionships]);

  const filteredChampionships = useMemo(() => {
    return allChampionships.filter((champ) => {
      const matchId = searchId
        ? champ.id.toLowerCase().includes(searchId.toLowerCase())
        : true;
      const matchCity = selectedCity ? champ.city === selectedCity : true;
      const matchModality = selectedModality
        ? champ.modality === selectedModality
        : true;
      const matchFormat = selectedFormat
        ? champ.format === selectedFormat
        : true;
      return matchId && matchCity && matchModality && matchFormat;
    });
  }, [
    allChampionships,
    searchId,
    selectedCity,
    selectedModality,
    selectedFormat,
  ]);

  const isAnyFilterActive = useMemo(() => {
    return (
      searchId !== '' ||
      selectedCity !== '' ||
      selectedModality !== '' ||
      selectedFormat !== ''
    );
  }, [searchId, selectedCity, selectedModality, selectedFormat]);

  const handleClearFilters = () => {
    setSearchId('');
    setSelectedCity('');
    setSelectedModality('');
    setSelectedFormat('');
  };

  const formatDate = (dateString) => {
    if (!dateString || typeof dateString !== 'string') {
      return { day: '??', month: '???' };
    }
    try {
      const date = new Date(dateString.replace(/-/g, '/'));
      const displayDay = date.getDate();
      const displayMonth = date
        .toLocaleString('pt-BR', { month: 'short' })
        .toUpperCase();
      return { day: displayDay, month: displayMonth };
    } catch (e) {
      console.error('Error formatting date:', e);
      return { day: '??', month: '???' };
    }
  };

  return (
    <>
      <div className="p-4 md:p-8 bg-[var(--bg-color)] text-gray-200 min-h-full">
        <header className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">
            Central de Campeonatos
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)] text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus size={20} />
            <span>ORGANIZAR</span>
          </button>
        </header>

        <div className="space-y-4 mb-8">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar por ID do campeonato..."
              className="w-full pl-10 pr-3 py-3 bg-[var(--bg-color2)] rounded-md text-white border border-gray-600 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full p-3 bg-[var(--bg-color2)] rounded-md text-white border border-gray-600 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
            >
              <option value="">Todas as Cidades</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <select
              value={selectedModality}
              onChange={(e) => setSelectedModality(e.target.value)}
              className="w-full p-3 bg-[var(--bg-color2)] rounded-md text-white border border-gray-600 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
            >
              <option value="">Todas as Modalidades</option>
              <option value="futsal">Futsal</option>
              <option value="society">Society</option>
              <option value="campo">Campo</option>
            </select>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full p-3 bg-[var(--bg-color2)] rounded-md text-white border border-gray-600 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
            >
              <option value="">Todos os Formatos</option>
              <option value="rachao">Rachão</option>
              <option value="mata-mata">Mata-Mata</option>
              <option value="grupos-mata-mata">Grupos + Mata-Mata</option>
              <option value="pontos-corridos">Pontos Corridos</option>
            </select>
          </div>
          {isAnyFilterActive && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleClearFilters}
                className="text-sm text-gray-400 hover:text-white font-semibold flex items-center gap-1 bg-[var(--bg-color2)] px-3 py-2 rounded-md"
              >
                <X size={16} />
                Limpar Filtros
              </button>
            </div>
          )}
        </div>

        <h2 className="font-semibold text-2xl mb-4 text-white">
          Campeonatos Abertos
        </h2>

        {loading ? (
          <p>Carregando campeonatos...</p>
        ) : filteredChampionships.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredChampionships.map((champ) => {
              const { day, month } = formatDate(champ.date);
              return (
                <div
                  key={champ.id}
                  className="bg-[var(--bg-color2)] p-4 rounded-lg shadow-md flex items-center space-x-4 hover:shadow-lg hover:border-[var(--primary-color)] border border-transparent transition-all cursor-pointer"
                >
                  <div className="text-center bg-[var(--primary-color)] text-white rounded-lg p-3 w-20 flex-shrink-0">
                    <p className="font-bold text-2xl">{day}</p>
                    <p className="text-xs font-semibold">{month}</p>
                  </div>
                  <div className="flex-grow overflow-hidden">
                    <h3 className="font-bold text-lg text-gray-200 truncate">
                      {champ.name}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">
                      Organizado por: {champ.organizerName}
                    </p>
                    <p className="text-sm text-gray-400 truncate">
                      {champ.street
                        ? `${champ.street}, ${champ.number || 's/n'}, ${
                            champ.cep
                          } - ${champ.city}`
                        : 'Endereço não informado'}
                    </p>
                    <div className="flex items-center text-xs mt-2 space-x-3 flex-wrap gap-y-1">
                      <span className="bg-gray-700 px-2 py-1 rounded-full text-gray-300">
                        {champ.format}
                      </span>
                      <span className="bg-gray-700 px-2 py-1 rounded-full text-gray-300">
                        {champ.participants.length}/{champ.maxCapacity} vagas
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full ${
                          champ.access === 'publico'
                            ? 'bg-green-800/50 text-green-300'
                            : 'bg-red-800/50 text-red-300'
                        }`}
                      >
                        {champ.access === 'publico' ? 'Público' : 'Privado'}
                      </span>
                      {champ.time && (
                        <span className="bg-gray-700 px-2 py-1 rounded-full text-gray-300 flex items-center gap-1">
                          <Clock size={12} /> {champ.time}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight
                    className="text-gray-400 flex-shrink-0"
                    size={20}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-[var(--bg-color2)] rounded-lg">
            <p className="text-gray-400">
              Nenhum campeonato encontrado com os filtros selecionados.
            </p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <CreateChampionshipModal onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

export default CourtsPage;
