import ModalWrapper from './ModalWrapper.jsx';

// Componente Matchup (com as classes responsivas)
const Matchup = ({ team1, team2, isFinalMobile = false }) => {
  if (isFinalMobile) {
    return (
      <div className="flex-1 w-36">
        <div className="p-2 rounded-lg shadow bg-white dark:bg-gray-700 flex flex-row items-center justify-center gap-2 h-full">
          <p className="font-bold text-gray-800 dark:text-gray-200 text-xs">
            {team1.name}
          </p>
          <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
          <p className="font-bold text-gray-800 dark:text-gray-200 text-xs">
            {team2.name}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex-1 w-36 md:w-auto md:min-w-[180px]">
      <div
        className={`p-2 md:p-3 rounded-lg shadow text-xs md:text-sm ${
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
};

const DesktopBracket = () => (
    <div className="inline-flex flex-row items-start justify-start gap-8 p-11 text-center text-gray-600 dark:text-gray-300">
      {/* Coluna Quartas */}
      <div className="flex flex-col">
        <h3 className="font-bold text-lg text-[#b554b5] mb-6">Quartas</h3>
        <div className="flex flex-col gap-4">
          <Matchup team1={{ name: 'Leoas da Serra' }} team2={{ name: 'Fênix FC' }} />
          <Matchup team1={{ name: 'Amazonas FC' }} team2={{ name: 'Guerreiras' }} />
          <Matchup team1={{ name: 'Estrela do Sul' }} team2={{ name: 'Panteras' }} />
          <Matchup team1={{ name: 'Poderosas' }} team2={{ name: 'Titãs da Bola' }} />
        </div>
      </div>
      {/* Coluna Semis (com títulos e blocos reposicionados) */}
      <div className="flex flex-col pt-14">
        <h3 className="font-bold text-lg text-[#b554b5] mb-4">Semis</h3>
        <div className="flex flex-col gap-[108px]">
          <Matchup team1={{ name: 'A definir' }} team2={{ name: 'A definir' }} />
          <Matchup team1={{ name: 'A definir' }} team2={{ name: 'A definir' }} />
        </div>
      </div>
      {/* Coluna Final (com título e bloco reposicionados) */}
      <div className="flex flex-col pt-39">
        <h3 className="font-bold text-lg text-[#b554b5] mb-4">Final</h3>
        <div className="flex h-full items-center justify-center">
          <Matchup team1={{ name: 'A definir' }} team2={{ name: 'A definir' }} />
        </div>
      </div>
    </div>
  );

// Layout Mobile
const MobileBracket = () => (
    <div className="flex flex-col items-center gap-y-4 p-4 text-center text-gray-600 dark:text-gray-300">
      <div className="flex flex-col items-center gap-y-2">
        <h3 className="font-bold text-lg text-[#b554b5]">Quartas</h3>
        <div className="flex flex-row justify-center gap-x-8 w-full">
            <Matchup team1={{ name: 'Leoas da Serra' }} team2={{ name: 'Fênix FC' }} />
            <Matchup team1={{ name: 'Amazonas FC' }} team2={{ name: 'Guerreiras' }} />
        </div>
      </div>
      <div className="flex flex-col items-center gap-y-2">
        <h3 className="font-bold text-lg text-[#b554b5]">Semis</h3>
        <div className="flex justify-center">
            <Matchup team1={{ name: 'A definir' }} team2={{ name: 'A definir' }} />
        </div>
      </div>
      <div className="flex flex-col items-center gap-y-2">
        <h3 className="font-bold text-lg text-[#b554b5]">Final</h3>
        <div className="flex justify-center">
            <Matchup team1={{ name: 'A definir' }} team2={{ name: 'A definir' }} isFinalMobile={true} />
        </div>
      </div>
      <div className="flex flex-col items-center gap-y-2">
        <h3 className="font-bold text-lg text-[#b554b5]">Semis</h3>
        <div className="flex justify-center">
            <Matchup team1={{ name: 'A definir' }} team2={{ name: 'A definir' }} />
        </div>
      </div>
      <div className="flex flex-col items-center gap-y-2">
        <h3 className="font-bold text-lg text-[#b554b5]">Quartas</h3>
        <div className="flex flex-row justify-center gap-x-8 w-full">
            <Matchup team1={{ name: 'Estrela do Sul' }} team2={{ name: 'Panteras' }} />
            <Matchup team1={{ name: 'Poderosas' }} team2={{ name: 'Titãs da Bola' }} />
        </div>
      </div>
    </div>
  );
  
const CopaBravasModal = ({ onClose }) => {
    return (
      <ModalWrapper title="Copa Bravas - Chaveamento" onClose={onClose}>
        <style>{`
          .custom-scrollbar::-webkit-scrollbar { height: 8px; width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #b554b5; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #d44b84; }
        `}</style>
        
        <div className="w-full">
          <div className="hidden md:flex justify-center w-full overflow-x-auto custom-scrollbar">
            <DesktopBracket />
          </div>
          <div className="flex md:hidden justify-center w-full overflow-y-auto custom-scrollbar">
            <MobileBracket />
          </div>
        </div>
      </ModalWrapper>
    );
  };
  
export default CopaBravasModal;
