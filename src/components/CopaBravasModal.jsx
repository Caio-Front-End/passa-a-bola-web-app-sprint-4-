import ModalWrapper from './ModalWrapper';

// Componente para um único jogo no chaveamento
const Match = ({ team1, score1, team2, score2, isWinner1, isWinner2 }) => (
  <div className="flex flex-col items-center">
    <div
      className={`flex justify-between w-full p-2 rounded-t-md ${
        isWinner1
          ? 'bg-[#b554b5] text-white font-bold'
          : 'bg-gray-200 dark:bg-gray-700'
      }`}
    >
      <span>{team1}</span>
      <span>{score1}</span>
    </div>
    <div
      className={`flex justify-between w-full p-2 rounded-b-md border-t-2 border-white/20 ${
        isWinner2
          ? 'bg-[#b554b5] text-white font-bold'
          : 'bg-gray-200 dark:bg-gray-700'
      }`}
    >
      <span>{team2}</span>
      <span>{score2}</span>
    </div>
  </div>
);

// Componente para a final
const FinalMatch = ({ team }) => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="text-center">
      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
        FINAL
      </p>
      <div className="bg-amber-400/20 dark:bg-amber-400/10 text-amber-700 dark:text-amber-300 p-3 rounded-lg font-bold">
        {team}
      </div>
    </div>
  </div>
);

const CopaBravasModal = ({ onClose }) => {
  return (
    <ModalWrapper title="Copa Bravas - Chaveamento" onClose={onClose}>
      <div className="w-full text-sm text-gray-800 dark:text-gray-200">
        <p className="text-center mb-4 text-lg font-semibold">Semifinais</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Chave 1 */}
          <Match
            team1="Guerreiras FC"
            score1={2}
            team2="Unidas da Bola"
            score2={1}
            isWinner1
          />

          {/* Linhas e Final */}
          <div className="flex flex-col md:flex-row items-center justify-center h-full relative">
            {/* Linhas para mobile */}
            <div className="md:hidden h-8 w-px bg-gray-300 dark:bg-gray-600 my-2"></div>
            {/* Linhas para desktop */}
            <div className="hidden md:block w-full h-px bg-gray-300 dark:bg-gray-600 absolute top-1/2 left-0 -translate-y-1/2"></div>
            <div className="hidden md:block w-px h-1/2 bg-gray-300 dark:bg-gray-600 absolute top-1/4 left-1/2 -translate-x-1/2"></div>
            <div className="hidden md:block w-px h-1/2 bg-gray-300 dark:bg-gray-600 absolute bottom-1/4 left-1/2 -translate-x-1/2"></div>
            <FinalMatch team="A Definir" />
          </div>

          {/* Chave 2 */}
          <Match
            team1="Estrelas do Campo"
            score1={3}
            team2="Fúria Feminina"
            score2={3}
            isWinner1
          />
        </div>
        <p className="text-xs text-center mt-6 text-gray-500 dark:text-gray-400">
          *O time Estrelas do Campo venceu por 5x4 nos pênaltis.
        </p>
      </div>
    </ModalWrapper>
  );
};

export default CopaBravasModal;
