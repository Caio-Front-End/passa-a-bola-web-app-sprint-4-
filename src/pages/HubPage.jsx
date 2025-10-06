import { useState, useEffect } from 'react';
import {
  Trophy,
  ShieldCheck,
  Calendar,
  Users,
  ListChecks,
  Trash2,
} from 'lucide-react';
import { SoccerBall } from 'phosphor-react';
import { useAuth } from '../hooks/useAuth.js';
import AgendaCalendario from '../components/AgendaCalendario.jsx';
import JogoModal from '../components/JogoModal.jsx';
import ManagementModal from '../components/ManagementModal.jsx';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { db } from '../firebase.js';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  arrayRemove,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';

const HubPage = () => {
  const { currentUser } = useAuth();
  const [activeModal, setActiveModal] = useState(null);
  const [selectedChampionship, setSelectedChampionship] = useState(null);
  const [userStats, setUserStats] = useState({
    goals: 0,
    assists: 0,
    games: 0,
    victories: 0,
  });
  const [createdChampionships, setCreatedChampionships] = useState([]);
  const [participatingChampionships, setParticipatingChampionships] = useState(
    [],
  );
  const [activeTab, setActiveTab] = useState('participating');
  const [loadingChampionships, setLoadingChampionships] = useState(true);
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [nextGame, setNextGame] = useState(null);
  const [selectedGameForModal, setSelectedGameForModal] = useState(null);

  // --- CORREÇÃO ESTÁ AQUI ---
  useEffect(() => {
    // Se o usuário não estiver logado, não faça nada e retorne uma função vazia de limpeza.
    if (!currentUser) {
      setLoadingChampionships(false);
      return () => {};
    }

    setLoadingChampionships(true);
    const championshipsRef = collection(db, 'championships');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Listener para campeonatos CRIADOS
    const createdQuery = query(
      championshipsRef,
      where('organizerUid', '==', currentUser.uid)
    );
    const unsubscribeCreated = onSnapshot(createdQuery, (snapshot) => {
      const createdChamps = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCreatedChampionships(createdChamps);
      updateGames(createdChamps, participatingChampionships);
    });

    // Listener para campeonatos PARTICIPANDO
    const participatingQuery = query(
      championshipsRef,
      where('participants', 'array-contains', { // 'array-contains' é mais eficiente aqui
        uid: currentUser.uid,
        name: currentUser.displayName || currentUser.name,
      })
    );
    const unsubscribeParticipating = onSnapshot(participatingQuery, (snapshot) => {
      const participatingChamps = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((champ) => champ.organizerUid !== currentUser.uid);
      setParticipatingChampionships(participatingChamps);
      updateGames(createdChampionships, participatingChamps);
    });

    // Função auxiliar para atualizar jogos futuros
    const updateGames = (created, participating) => {
      const allUserChamps = [...created, ...participating];
      const futureGames = allUserChamps
        .filter((champ) => champ.date && parseISO(champ.date) >= today)
        .sort((a, b) => parseISO(a.date) - parseISO(b.date));

      setUpcomingGames(futureGames);
      setNextGame(futureGames.length > 0 ? futureGames[0] : null);
      setLoadingChampionships(false);
    };
    
    // Função de limpeza: será chamada quando o usuário sair da conta.
    return () => {
      unsubscribeCreated();
      unsubscribeParticipating();
    };
  }, [currentUser]); // A dependência do currentUser é crucial

  const handleLeaveChampionship = async (championship) => {
    const championshipRef = doc(db, 'championships', championship.id);
    const userParticipant = {
      uid: currentUser.uid,
      name: currentUser.displayName || currentUser.name,
    };

    try {
      if (championship.teamFormation === 'manual' && championship.teams) {
        const docSnap = await getDoc(championshipRef);
        if (docSnap.exists()) {
          const currentData = docSnap.data();
          const updatedTeams = currentData.teams.map((team) => ({
            ...team,
            players: team.players.filter(
              (player) => player.uid !== currentUser.uid,
            ),
          }));
          await updateDoc(championshipRef, {
            teams: updatedTeams,
            participants: arrayRemove(userParticipant),
          });
        }
      } else {
        await updateDoc(championshipRef, {
          participants: arrayRemove(userParticipant),
        });
      }
    } catch (error) {
      console.error('Erro ao sair do campeonato:', error);
    }
  };

  const handleDeleteChampionship = async (championshipId) => {
    // A confirmação customizada deve ser implementada aqui
    const championshipRef = doc(db, 'championships', championshipId);
    try {
      await deleteDoc(championshipRef);
    } catch (error) {
      console.error('Erro ao excluir campeonato:', error);
    }
  };

  const stats = [
    {
      icon: <SoccerBall size={24} className="text-[var(--primary-color)]" />,
      value: userStats.goals,
      label: 'Gols',
    },
    {
      icon: <ShieldCheck size={24} className="text-[var(--primary-color)]" />,
      value: userStats.assists,
      label: 'Assistências',
    },
    {
      icon: <Calendar size={24} className="text-[var(--primary-color)]" />,
      value: userStats.games,
      label: 'Jogos',
    },
    {
      icon: <Trophy size={24} className="text-[var(--primary-color)]" />,
      value: userStats.victories,
      label: 'Vitórias',
    },
  ];

  const handleOpenChampionshipModal = (champ) => {
    setSelectedChampionship(champ);
    setActiveModal('management');
  };

  const handleOpenGameModal = (game) => {
    if (!game) return;
    const gameInfo = {
      data: parseISO(game.date),
      timeCasa: { nome: 'Seu Time' },
      adversario: { nome: 'Time B' },
      campeonato: game.name,
      horario: game.time,
      historico: [],
      elencoAdversario: {
        atacantes: [],
        meioCampo: [],
        defensores: [],
        goleira: [],
      },
    };
    setSelectedGameForModal(gameInfo);
    setActiveModal('jogo');
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedChampionship(null);
    setSelectedGameForModal(null);
  };

  if (!currentUser && !loadingChampionships) { // Condição ligeiramente ajustada para clareza
    return (
      <div className="p-8 bg-[var(--bg-color)] text-white min-h-screen">
        Carregando dados...
      </div>
    );
  }

  const ChampionshipCard = ({ champ, onClick, onAction, actionType }) => (
    <div className="relative group">
      <button
        onClick={() => onClick(champ)}
        className="w-full text-left bg-[var(--bg-color2)] rounded-lg shadow border border-transparent hover:shadow-lg cursor-pointer hover:border-[var(--primary-color)] transition-all duration-300 overflow-hidden"
      >
        <div className="p-4">
          <p className="font-semibold text-white mb-1 truncate pr-8">
            {champ.name}
          </p>
          <p className="text-sm text-gray-400 mb-2">
            Organizado por: {champ.organizerName}
          </p>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-[var(--primary-color)] h-2.5 rounded-full"
              style={{
                width: `${
                  (champ.participants.length / champ.maxCapacity) * 100
                }%`,
              }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {champ.participants.length} / {champ.maxCapacity} vagas
          </p>
        </div>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAction(actionType === 'delete' ? champ.id : champ);
        }}
        className="absolute top-2 right-2 p-2 text-gray-500 hover:text-red-500 bg-transparent hover:bg-red-500/10 rounded-full transition-colors"
        aria-label={
          actionType === 'delete' ? 'Excluir campeonato' : 'Sair do campeonato'
        }
      >
        <Trash2 size={18} />
      </button>
    </div>
  );

  return (
    <>
      <div className="p-4 md:p-8 pb-34 bg-[var(--bg-color)] text-gray-200 min-h-full">
        <header className="mb-6">
          <p className="text-md text-gray-400">Bem-vinda de volta,</p>
          <h1 className="text-3xl font-bold text-white">
            {currentUser?.displayName}
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-semibold text-2xl mb-3 text-white">
              Calendário de Jogos
            </h2>
            <AgendaCalendario
              upcomingGames={upcomingGames}
              onGameClick={handleOpenGameModal}
            />

            <div className="pt-6">
              <h2 className="font-semibold text-2xl mb-4 text-white">
                Meus Campeonatos
              </h2>

              <div className="flex border-b border-gray-700 mb-4">
                <button
                  onClick={() => setActiveTab('participating')}
                  className={`px-4 py-2 font-semibold flex items-center gap-2 ${
                    activeTab === 'participating'
                      ? 'text-[var(--primary-color)] border-b-2 border-[var(--primary-color)]'
                      : 'text-gray-400'
                  }`}
                >
                  <Users size={18} /> Participando
                </button>
                <button
                  onClick={() => setActiveTab('created')}
                  className={`px-4 py-2 font-semibold flex items-center gap-2 ${
                    activeTab === 'created'
                      ? 'text-[var(--primary-color)] border-b-2 border-[var(--primary-color)]'
                      : 'text-gray-400'
                  }`}
                >
                  <ListChecks size={18} /> Criados
                </button>
              </div>

              {loadingChampionships ? (
                <p>Carregando campeonatos...</p>
              ) : (
                <div>
                  {activeTab === 'participating' && (
                    <div className="space-y-4">
                      {participatingChampionships.length > 0 ? (
                        participatingChampionships.map((champ) => (
                          <ChampionshipCard
                            key={champ.id}
                            champ={champ}
                            onClick={handleOpenChampionshipModal}
                            onAction={handleLeaveChampionship}
                            actionType="leave"
                          />
                        ))
                      ) : (
                        <p className="text-gray-500">
                          Você ainda não se inscreveu em nenhum campeonato.
                        </p>
                      )}
                    </div>
                  )}
                  {activeTab === 'created' && (
                    <div className="space-y-4">
                      {createdChampionships.length > 0 ? (
                        createdChampionships.map((champ) => (
                          <ChampionshipCard
                            key={champ.id}
                            champ={champ}
                            onClick={handleOpenChampionshipModal}
                            onAction={handleDeleteChampionship}
                            actionType="delete"
                          />
                        ))
                      ) : (
                        <p className="text-gray-500">
                          Você ainda não criou nenhum campeonato.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="font-semibold text-2xl mb-3 text-white">
                Próximo Jogo
              </h2>
              {nextGame ? (
                <button
                  onClick={() => handleOpenGameModal(nextGame)}
                  className="w-full text-left bg-[var(--primary-color)] text-white p-5 rounded-lg shadow-lg flex items-center space-x-4 cursor-pointer hover:bg-[var(--primary-color-hover)] transition-all hover:scale-101 "
                >
                  <div className="text-center">
                    <p className="text-4xl font-bold">
                      {format(parseISO(nextGame.date), 'dd')}
                    </p>
                    <p className="text-md font-semibold">
                      {format(parseISO(nextGame.date), 'MMM', {
                        locale: ptBR,
                      }).toUpperCase()}
                    </p>
                  </div>
                  <div className="border-l-2 border-[var(--bg-color2)] pl-4 flex-grow">
                    <p className="font-semibold">{nextGame.name}</p>
                    <p className="text-xl font-bold">vs Time B</p>
                    <p className="text-sm">{nextGame.time}</p>
                  </div>
                </button>
              ) : (
                <div className="w-full text-center bg-[var(--bg-color2)] text-gray-400 p-5 rounded-lg shadow-lg">
                  <p>Nenhum jogo agendado.</p>
                </div>
              )}
            </div>

            <div>
              <h2 className="font-semibold text-2xl mb-3 text-white">
                Estatísticas
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-[var(--bg-color2)] border border-gray-700/50 p-4 rounded-xl shadow flex flex-col space-y-2"
                  >
                    {stat.icon}
                    <div>
                      <p className="text-3xl font-bold text-white">
                        {stat.value}
                      </p>
                      <p className="text-sm text-gray-400">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeModal === 'jogo' && selectedGameForModal && (
        <JogoModal onClose={handleCloseModal} jogoInfo={selectedGameForModal} />
      )}
      {activeModal === 'management' && selectedChampionship && (
        <ManagementModal
          championship={selectedChampionship}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default HubPage;