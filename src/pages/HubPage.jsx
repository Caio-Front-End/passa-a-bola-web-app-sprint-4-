import { Trophy, ShieldCheck, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AgendaCalendario from '../components/AgendaCalendario';

const HubPage = () => {
  const { currentUser } = useAuth();

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
    { name: 'Copa Sulsanca', progress: 75 },
    { name: 'Liga da Zona Leste', progress: 40 },
  ];

  const nextGame = {
    day: '25',
    month: 'SET',
    opponent: 'Time Rivais FC',
    time: '19:30',
  };

  // É uma boa prática verificar se currentUser já foi carregado
  if (!currentUser) {
    return <div className="p-8">Carregando dados da atleta...</div>;
  }

  return (
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
          {/* Próximo Jogo */}

            <h2 className="font-semibold text-2xl mb-3 text-gray-900 dark:text-white">
              Calendário de Jogos
            </h2>

          <AgendaCalendario /> 

                      <h2 className="font-semibold text-2xl mb-3 text-gray-900 dark:text-white">
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
          <div>
            <h2 className="font-semibold text-2xl mb-3 text-gray-900 dark:text-white">
              Meus Campeonatos
            </h2>
            <div className="space-y-4">
              {currentChampionships.map((champ) => (
                <div
                  key={champ.name}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
                >
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {champ.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {champ.progress}%
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-[#b554b5] h-2.5 rounded-full"
                      style={{ width: `${champ.progress}%` }}
                    ></div>
                  </div>
                </div>
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
  );
};

export default HubPage;
