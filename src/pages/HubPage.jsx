import { useState } from 'react';
import { Trophy, ShieldCheck, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AgendaCalendario from '../components/AgendaCalendario';
import CopaBravasModal from '../components/CopaBravasModal';
import LigaDasEstrelasModal from '../components/LigaDasEstrelasModal';

// IMPORTAÇÃO DAS IMAGENS LOCAIS COM OS NOVOS NOMES
import fotoEquipe1 from '../assets/img/FotoEquipe1.png'; // Caminho para a primeira imagem
import fotoEquipe2 from '../assets/img/FotoEquipe2.png'; // Caminho para a segunda imagem


const HubPage = () => {
  const { currentUser } = useAuth();
  const [activeModal, setActiveModal] = useState(null);

  const stats = [
    {
      icon: <Trophy size={24} className="text-[#b554b5]" />,
      value: '12',
      label: 'Gols',
    },
    {
      icon: <ShieldCheck size={24} className="text-[#b554b5]" />,
      value: '8',
      label: 'Assistências',
    },
    {
      icon: <Calendar size={24} className="text-[#b554b5]" />,
      value: '25',
      label: 'Jogos',
    },
  ];

  const currentChampionships = [
    {
      name: 'Liga das Campeãs',
      progress: 75,
      modal: 'copaBravas',
      phase: 'Semi-Finais',
      image: fotoEquipe1, // Usando a primeira imagem importada
    },
    {
      name: 'Passa a Bola',
      progress: 40,
      modal: 'ligaDasEstrelas',
      phase: 'Fase de Grupos',
      image: fotoEquipe2, // Usando a segunda imagem importada
    },
  ];

  const nextGame = {
    day: '25',
    month: 'SET',
    opponent: 'Time Rivais FC',
    time: '19:30',
  };

  const handleOpenModal = (modalName) => setActiveModal(modalName);
  const handleCloseModal = () => setActiveModal(null);

  if (!currentUser) {
    return <div className="p-8">Carregando dados da atleta...</div>;
  }

  return (
    <>
      <div className="p-4 md:p-8 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-full">
        <header className="mb-6">
          <p className="text-md text-gray-600 dark:text-gray-400">
            Bem-vinda de volta,
          </p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {currentUser.name}
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-semibold text-2xl mb-3 text-gray-900 dark:text-white">
              Calendário de Jogos
            </h2>
            <AgendaCalendario />

            <h2 className="font-semibold text-2xl pt-6 mb-3 text-gray-900 dark:text-white">
              Próximo Jogo
            </h2>
            <div className="bg-[#b554b5] text-white p-5 rounded-lg shadow-lg flex items-center space-x-4">
              <div className="text-center">
                <p className="text-4xl font-bold">{nextGame.day}</p>
                <p className="text-md font-semibold">{nextGame.month}</p>
              </div>
              <div className="border-l-2 border-pink-400/50 pl-4 flex-grow">
                <p className="font-semibold">Próximo Jogo</p>
                <p className="text-xl font-bold">vs {nextGame.opponent}</p>
                <p className="text-sm">{nextGame.time}</p>
              </div>
            </div>

            {/* Meus Campeonatos */}
            <div className="pt-6">
              <h2 className="font-semibold text-2xl mb-3 text-gray-900 dark:text-white">
                Meus Campeonatos
              </h2>
              <div className="space-y-4">
                {currentChampionships.map((champ) => (
                  <button
                    key={champ.name}
                    onClick={() => handleOpenModal(champ.modal)}
                    className="w-full text-left bg-white dark:bg-gray-800 rounded-lg shadow border border-transparent hover:shadow-lg cursor-pointer hover:border-[#b554b5] transition-all duration-300 overflow-hidden hover:scale-101"
                  >
                    {/* Imagem do Campeonato */}
                    <div className="w-full h-48 md:h-56 lg:h-64 overflow-hidden rounded-t-lg">
                      <img
                        src={champ.image}
                        alt={`Time do campeonato ${champ.name}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <p className="font-semibold text-gray-900 dark:text-white mb-1">
                        {champ.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {champ.phase}
                      </p>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div
                          className="bg-[#b554b5] h-2.5 rounded-full"
                          style={{ width: `${champ.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna Lateral (Estatísticas) */}
          <div className="lg:col-span-1">
            <h2 className="font-semibold text-2xl mb-3 text-gray-900 dark:text-white">
              Estatísticas
            </h2>
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex lg:flex-row flex-col items-center lg:space-x-4 text-center lg:text-left"
                >
                  {stat.icon}
                  <div className="mt-2 lg:mt-0">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Renderização Condicional dos Modais */}
      {activeModal === 'copaBravas' && (
        <CopaBravasModal onClose={handleCloseModal} />
      )}
      {activeModal === 'ligaDasEstrelas' && (
        <LigaDasEstrelasModal onClose={handleCloseModal} />
      )}
    </>
  );
};

export default HubPage;