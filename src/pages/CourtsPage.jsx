import { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import CreateChampionshipModal from '../components/CreateChampionshipModal';
import SubscriptionModal from '../components/SubscriptionModal';
import { Search, X, Filter } from 'lucide-react';

const CourtsPage = () => {
  const [championships, setChampionships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [selectedChampionship, setSelectedChampionship] = useState(null);

  const [filters, setFilters] = useState({
    city: '',
    modality: '',
    format: '',
    searchTerm: '',
  });

  useEffect(() => {
    setLoading(true);
    const championshipsCollectionRef = collection(db, 'championships');

    const unsubscribe = onSnapshot(championshipsCollectionRef, (snapshot) => {
      const champsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Ordena os campeonatos pela data do evento (campo 'date')
      champsData.sort((a, b) => new Date(a.date) - new Date(b.date));
      setChampionships(champsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ city: '', modality: '', format: '', searchTerm: '' });
  };

  const uniqueCities = useMemo(() => {
    const cities = championships.map((c) => c.city).filter(Boolean);
    return [...new Set(cities)];
  }, [championships]);

  const filteredChampionships = useMemo(() => {
    return championships.filter((champ) => {
      const matchCity = !filters.city || champ.city === filters.city;
      const matchModality =
        !filters.modality || champ.modality === filters.modality;
      const matchFormat = !filters.format || champ.format === filters.format;
      const matchSearchTerm =
        !filters.searchTerm ||
        champ.id.toLowerCase().includes(filters.searchTerm.toLowerCase());

      return matchCity && matchModality && matchFormat && matchSearchTerm;
    });
  }, [championships, filters]);

  const isAnyFilterActive =
    filters.city || filters.modality || filters.format || filters.searchTerm;

  return (
    <>
      <div className="p-4 md:p-8 bg-[var(--bg-color)] text-gray-200 min-h-full">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-white">
            Central de Campeonatos
          </h1>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)] text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            ORGANIZAR
          </button>
        </div>

        {/* Seção de Filtros */}
        <div className="bg-[var(--bg-color2)] p-4 rounded-lg mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                name="searchTerm"
                placeholder="Buscar por ID..."
                value={filters.searchTerm}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-3 py-2 bg-gray-700/50 rounded-md text-white border border-gray-600 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm"
              />
            </div>
            <select
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              className="w-full p-2 bg-gray-700/50 rounded-md text-white border border-gray-600"
            >
              <option value="">Todas as Cidades</option>
              {uniqueCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <select
              name="modality"
              value={filters.modality}
              onChange={handleFilterChange}
              className="w-full p-2 bg-gray-700/50 rounded-md text-white border border-gray-600"
            >
              <option value="">Todas as Modalidades</option>
              <option value="futsal">Futsal</option>
              <option value="society">Society</option>
              <option value="campo">Campo</option>
            </select>
            <select
              name="format"
              value={filters.format}
              onChange={handleFilterChange}
              className="w-full p-2 bg-gray-700/50 rounded-md text-white border border-gray-600"
            >
              <option value="">Todos os Formatos</option>
              <option value="rachao">Rachão</option>
              <option value="grupos-mata-mata">
                Fase de Grupos + Mata-Mata
              </option>
              <option value="mata-mata">Somente Mata-Mata</option>
              <option value="pontos-corridos">Pontos Corridos</option>
            </select>
          </div>
          {isAnyFilterActive && (
            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="text-sm text-[var(--primary-color)] hover:underline flex items-center gap-1"
              >
                <X size={16} /> Limpar Filtros
              </button>
            </div>
          )}
        </div>

        <h2 className="font-semibold text-2xl mb-4 text-white">
          Campeonatos Disponíveis
        </h2>

        {loading ? (
          <p>Carregando campeonatos...</p>
        ) : filteredChampionships.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredChampionships.map((champ) => {
              const address = champ.street
                ? `${champ.street}, ${champ.number}, ${champ.cep}, ${champ.city}`
                : 'Endereço não informado';
              const formattedDate = champ.date
                ? format(new Date(champ.date + 'T00:00:00'), 'dd MMM', {
                    locale: ptBR,
                  })
                : 'A definir';
              return (
                <button
                  key={champ.id}
                  onClick={() => setSelectedChampionship(champ)}
                  className="bg-[var(--bg-color2)] p-4 rounded-lg shadow-md flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 text-left hover:shadow-lg hover:border-[var(--primary-color)] border border-transparent transition-all"
                >
                  <div className="text-center bg-[var(--primary-color)] text-white rounded-lg p-3 w-full sm:w-auto">
                    <p className="font-bold text-xl">
                      {formattedDate.split(' ')[0]}
                    </p>
                    <p className="text-xs font-semibold uppercase">
                      {formattedDate.split(' ')[1]}
                    </p>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg text-white">
                      {champ.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-1">
                      Organizado por: {champ.organizerName}
                    </p>
                    <p className="text-sm text-gray-400">{address}</p>
                    <p className="text-sm text-gray-400 font-semibold">
                      {champ.time}
                    </p>
                    <div className="flex items-center text-xs mt-2 space-x-3 flex-wrap gap-2">
                      <span className="bg-gray-700 px-2 py-1 rounded-full text-gray-300 capitalize">
                        {champ.modality}
                      </span>
                      <span className="bg-gray-700 px-2 py-1 rounded-full text-gray-300 capitalize">
                        {champ.format.replace('-', ' ')}
                      </span>
                      <span className="bg-gray-700 px-2 py-1 rounded-full text-gray-300 font-bold">
                        {champ.participants.length}/{champ.maxCapacity} vagas
                      </span>
                      <span
                        className={`capitalize px-2 py-1 rounded-full ${
                          champ.access === 'publico'
                            ? 'bg-green-800/50 text-green-300'
                            : 'bg-red-800/50 text-red-300'
                        }`}
                      >
                        {champ.access}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-[var(--bg-color2)] rounded-lg">
            <Filter size={48} className="mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400">
              Nenhum campeonato encontrado com os filtros selecionados.
            </p>
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <CreateChampionshipModal onClose={() => setCreateModalOpen(false)} />
      )}
      {selectedChampionship && (
        <SubscriptionModal
          championship={selectedChampionship}
          onClose={() => setSelectedChampionship(null)}
        />
      )}
    </>
  );
};

export default CourtsPage;
