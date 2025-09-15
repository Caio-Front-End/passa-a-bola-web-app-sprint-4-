import ModalWrapper from './ModalWrapper.jsx';
import { Trophy } from 'lucide-react';

// Subcomponente para um confronto
const Matchup = ({ team1, team2 }) => (
  <div className="flex-1 min-w-[150px] sm:min-w-[180px]">
    <div
      className={`p-3 rounded-lg shadow text-sm ${
        team1.name === 'A definir'
          ? 'bg-gray-100 dark:bg-gray-700/50'
          : 'bg-white dark:bg-gray-700'
      }`}
    >
      <p
        className={`font-bold ${
          team1.name === 'A definir'
            ? 'text-gray-400 dark:text-gray-500'
            : 'text-gray-800 dark:text-gray-200'
        }`}
      >
        {team1.name}
      </p>
      <div className="border-t border-gray-200 dark:border-gray-600 my-1.5"></div>
      <p
        className={`font-bold ${
          team2.name === 'A definir'
            ? 'text-gray-400 dark:text-gray-500'
            : 'text-gray-800 dark:text-gray-200'
        }`}
      >
        {team2.name}
      </p>
    </div>
  </div>
);

// Componente do Chaveamento
const Bracket = () => (
  <div className="inline-flex flex-row items-start justify-start gap-8 p-4 text-center text-gray-600 dark:text-gray-300">
    {/* Quartas de Final */}
    <div className="flex flex-col gap-6">
      <h3 className="font-bold text-lg text-[#b554b5]">Quartas</h3>
      <div className="flex flex-col gap-4">
        <Matchup
          team1={{ name: 'Leoas da Serra' }}
          team2={{ name: 'Fênix FC' }}
        />
        <Matchup
          team1={{ name: 'Amazonas FC' }}
          team2={{ name: 'Guerreiras' }}
        />
        <Matchup
          team1={{ name: 'Estrela do Sul' }}
          team2={{ name: 'Panteras' }}
        />
        <Matchup
          team1={{ name: 'Poderosas' }}
          team2={{ name: 'Titãs da Bola' }}
        />
      </div>
    </div>

    {/* Semi Finais */}
    <div className="flex flex-col gap-6 pt-12">
      <h3 className="font-bold text-lg text-[#b554b5]">Semis</h3>
      <div className="flex flex-col gap-16 justify-center h-full items-center">
        <Matchup team1={{ name: 'A definir' }} team2={{ name: 'A definir' }} />
        <Matchup team1={{ name: 'A definir' }} team2={{ name: 'A definir' }} />
      </div>
    </div>

    {/* Final */}
    <div className="flex flex-col gap-6 pt-28">
      <h3 className="font-bold text-lg text-[#b554b5]">Final</h3>
      <div className="flex h-full items-center">
        <Matchup team1={{ name: 'A definir' }} team2={{ name: 'A definir' }} />
      </div>
    </div>
  </div>
);

const CopaBravasModal = ({ onClose }) => {
  return (
    <ModalWrapper title="Copa Bravas - Chaveamento" onClose={onClose}>
      {/* Estilos customizados para a barra de rolagem */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #b554b5;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #d44b84;
        }
      `}</style>
      <div className="p-4 sm:p-6 w-full overflow-x-auto custom-scrollbar">
        <Bracket />
      </div>
    </ModalWrapper>
  );
};

export default CopaBravasModal;
