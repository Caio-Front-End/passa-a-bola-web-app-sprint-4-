import { useState } from 'react';
import { Trophy, ShieldCheck, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AgendaCalendario from '../components/AgendaCalendario';
import CopaBravasModal from '../components/CopaBravasModal';
import LigaDasEstrelasModal from '../components/LigaDasEstrelasModal';
import JogoModal from '../components/JogoModal';
import { proximoJogoInfo } from '../data/jogoData';

// --- CORREÇÃO: Adicionada a importação da função 'format' e 'ptBR' ---
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import fotoEquipe1 from '../assets/img/FotoEquipe1.png';
import fotoEquipe2 from '../assets/img/FotoEquipe2.png';

const HubPage = () => {
  const { currentUser } = useAuth();
  const [activeModal, setActiveModal] = useState(null);

  const stats = [
    { icon: <Trophy size={24} className="text-[var(--primary-color)]" />, value: '12', label: 'Gols' },
    { icon: <ShieldCheck size={24} className="text-[var(--primary-color)]" />, value: '8', label: 'Assistências' },
    { icon: <Calendar size={24} className="text-[var(--primary-color)]" />, value: '25', label: 'Jogos' },
  ];

  const currentChampionships = [
    { name: 'Liga das Campeãs', progress: 75, modal: 'copaBravas', phase: 'Quartas de Final', image: fotoEquipe1, },
    { name: 'Passa a Bola', progress: 40, modal: 'ligaDasEstrelas', phase: 'Pontos Corridos', image: fotoEquipe2, },
  ];

  const handleOpenModal = (modalName) => setActiveModal(modalName);
  const handleCloseModal = () => setActiveModal(null);

  if (!currentUser) {
    return <div className="p-8 bg-[var(--bg-color)] text-white min-h-screen">Carregando dados da atleta...</div>;
  }

  return (
    <>
      <div className="p-4 md:p-8 bg-[var(--bg-color)] text-gray-200 min-h-full">
        <header className="mb-6">
          <p className="text-md text-gray-400">Bem-vinda de volta,</p>
          <h1 className="text-3xl font-bold text-white">{currentUser.name}</h1>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-semibold text-2xl mb-3 text-white">Calendário de Jogos</h2>
            <AgendaCalendario />
            <h2 className="font-semibold text-2xl pt-6 mb-3 text-white">Próximo Jogo</h2>
            <button
              onClick={() => handleOpenModal('proximoJogo')}
              className="w-full text-left bg-[var(--primary-color)] text-white p-5 rounded-lg shadow-lg flex items-center space-x-4 cursor-pointer hover:bg-[var(--primary-color-hover)] transition-all hover:scale-101 "
            >
              <div className="text-center">
                <p className="text-4xl font-bold">{proximoJogoInfo.data.getDate()}</p>
                <p className="text-md font-semibold">{format(proximoJogoInfo.data, 'MMM', { locale: ptBR }).toUpperCase()}</p>
              </div>
              <div className="border-l-2 border-[var(--bg-color2)] pl-4 flex-grow">
                <p className="font-semibold">Próximo Jogo</p>
                <p className="text-xl font-bold">vs {proximoJogoInfo.adversario.nome}</p>
                <p className="text-sm">{proximoJogoInfo.horario}</p>
              </div>
            </button>
            <div className="pt-6">
              <h2 className="font-semibold text-2xl mb-3 text-white">Meus Campeonatos</h2>
              <div className="space-y-4">
                {currentChampionships.map((champ) => (
                  <button key={champ.name} onClick={() => handleOpenModal(champ.modal)} className="w-full text-left bg-[var(--bg-color2)] rounded-lg shadow border border-transparent hover:shadow-lg cursor-pointer hover:border-[var(--primary-color)] transition-all duration-300 overflow-hidden hover:scale-101">
                    <div className="w-full h-48 md:h-56 lg:h-64 overflow-hidden rounded-t-lg"><img src={champ.image} alt={`Time do campeonato ${champ.name}`} className="w-full h-full object-cover" /></div>
                    <div className="p-4">
                      <p className="font-semibold text-white mb-1">{champ.name}</p>
                      <p className="text-sm text-gray-400 mb-2">{champ.phase}</p>
                      <div className="w-full bg-gray-700 rounded-full h-2.5"><div className="bg-[var(--primary-color)] h-2.5 rounded-full" style={{ width: `${champ.progress}%` }}></div></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <h2 className="font-semibold text-2xl mb-3 text-white">Estatísticas</h2>
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-[var(--bg-color2)] p-4 rounded-lg shadow flex lg:flex-row flex-col items-center lg:space-x-4 text-center lg:text-left">
                  {stat.icon}
                  <div className="mt-2 lg:mt-0">
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {activeModal === 'copaBravas' && <CopaBravasModal onClose={handleCloseModal} />}
      {activeModal === 'ligaDasEstrelas' && <LigaDasEstrelasModal onClose={handleCloseModal} />}
      {activeModal === 'proximoJogo' && <JogoModal onClose={handleCloseModal} jogoInfo={proximoJogoInfo} />}
    </>
  );
};

export default HubPage;