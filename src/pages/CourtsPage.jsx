import { useState, useEffect } from 'react';
import { db } from '../firebase.js';
import { collection, getDocs, query } from 'firebase/firestore';
import { ArrowRight, Search, Plus, Clock } from 'lucide-react';
import CreateChampionshipModal from '../components/CreateChampionshipModal.jsx';

const CourtsPage = () => {
  const [championships, setChampionships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

        setChampionships(champsList);
      } catch (error) {
        console.error('Erro ao buscar campeonatos:', error);
      }
      setLoading(false);
    };

    fetchChampionships();
  }, [isModalOpen]);

  const formatDate = (dateString) => {
    if (!dateString || typeof dateString !== 'string') {
      return { day: '??', month: '???' };
    }
    try {
      // Trata a data como local para evitar problemas de fuso horário
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

        <div className="mb-8">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar por ID do campeonato..."
              className="w-full pl-10 pr-3 py-3 bg-[var(--bg-color2)] rounded-md text-white border border-gray-600 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
            />
          </div>
        </div>

        <h2 className="font-semibold text-2xl mb-4 text-white">
          Campeonatos Abertos
        </h2>

        {loading ? (
          <p>Carregando campeonatos...</p>
        ) : championships.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {championships.map((champ) => {
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
              Nenhum campeonato encontrado no momento.
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
