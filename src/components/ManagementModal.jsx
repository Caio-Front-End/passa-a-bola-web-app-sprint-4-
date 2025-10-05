import ModalWrapper from './ModalWrapper';
import { Users, UserCheck } from 'lucide-react';

const ManagementModal = ({ championship, onClose }) => {
  const renderContent = () => {
    // Se a formação for por escolha de time, exibe os times
    if (championship.teamFormation === 'manual' && championship.teams) {
      return (
        <div className="space-y-4">
          {championship.teams.map((team, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg">
              <h4 className="font-bold text-lg text-white mb-2">{team.name}</h4>
              <ul className="space-y-2">
                {team.players.map((player) => (
                  <li
                    key={player.uid}
                    className="flex items-center gap-2 text-gray-300"
                  >
                    <UserCheck size={16} className="text-green-500" />
                    <span>{player.name}</span>
                  </li>
                ))}
                {team.players.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Nenhum jogador neste time ainda.
                  </p>
                )}
              </ul>
            </div>
          ))}
        </div>
      );
    }

    // Caso contrário, exibe a lista geral de participantes
    return (
      <ul className="space-y-2">
        {championship.participants.map((participant) => (
          <li
            key={participant.uid}
            className="flex items-center gap-2 bg-gray-800 p-2 rounded-md"
          >
            <UserCheck size={16} className="text-green-500" />
            <span className="text-gray-300">{participant.name}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <ModalWrapper title={`Inscritos - ${championship.name}`} onClose={onClose}>
      <div className="p-6 text-white">
        <div className="flex justify-between items-center bg-gray-900 p-3 rounded-lg mb-4">
          <h3 className="font-semibold text-lg">Lista de Atletas</h3>
          <div className="flex items-center gap-2 text-lg">
            <Users size={20} />
            <span>
              {championship.participants.length} / {championship.maxCapacity}
            </span>
          </div>
        </div>

        {renderContent()}
      </div>
    </ModalWrapper>
  );
};

export default ManagementModal;
