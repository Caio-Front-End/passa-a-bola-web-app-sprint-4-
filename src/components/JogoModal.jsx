import { format } from 'date-fns';
import { UserCircle } from 'lucide-react';
import { ptBR } from 'date-fns/locale';
import ModalWrapper from './ModalWrapper.jsx';

// Pequeno sub-componente para renderizar cada jogadora
const Player = ({ nome }) => (
  <div className="flex flex-col items-center text-center w-16">
    <UserCircle size={40} className="text-gray-400 bg-gray-900/50 rounded-full" />
    <p className="text-xs mt-1 text-white font-semibold whitespace-nowrap">{nome}</p>
  </div>
);

const JogoModal = ({ onClose, jogoInfo }) => {
  return (
    <ModalWrapper 
      title={`Próximo Jogo - ${format(jogoInfo.data, "eeee, dd/MM", { locale: ptBR })}`} 
      onClose={onClose}
    >
      {/* Removido o fundo opaco para o blur funcionar */}
      <div className="p-4 sm:p-6 text-gray-200">
        
        {/* Seção Principal do Confronto com blur restaurado */}
        <div className="flex justify-around items-center text-center p-4 rounded-lg bg-gray-800/30 backdrop-blur-sm border border-gray-700">
          <div className="flex flex-col items-center gap-2">
            <img src={jogoInfo.timeCasa.logo} alt={jogoInfo.timeCasa.nome} className="w-16 h-16 sm:w-20 sm:h-20" />
            <p className="font-bold text-sm">{jogoInfo.timeCasa.nome}</p>
          </div>
          <div className="text-gray-400 text-xs sm:text-sm">
            <p className="font-bold text-base text-white">{jogoInfo.campeonato}</p>
            <p>{format(jogoInfo.data, "dd/MM/yyyy", { locale: ptBR })}</p>
            <p>{jogoInfo.horario}</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <img src={jogoInfo.adversario.logo} alt={jogoInfo.adversario.nome} className="w-16 h-16 sm:w-20 sm:h-20" />
            <p className="font-bold text-sm">{jogoInfo.adversario.nome}</p>
          </div>
        </div>

        {/* Seção de Histórico com blur restaurado */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Histórico</h3>
          <div className="space-y-3">
            {jogoInfo.historico.map((partida) => (
              <div key={partida.id} className="flex items-center justify-between p-3 bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-lg">
                <div className="text-left">
                  <p className="font-semibold">{partida.campeonato}</p>
                  <p className="text-xs text-gray-400">{partida.fase}</p>
                </div>
                <div className="bg-black/20 px-4 py-1 rounded-md">
                  <p className="font-bold text-lg">{partida.placar}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seção do Elenco com blur restaurado */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Elenco {jogoInfo.adversario.nome}</h3>
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 p-4 rounded-lg space-y-6 md:space-y-8">
            <div className="flex justify-around">
              {jogoInfo.elencoAdversario.atacantes?.map(jogadora => <Player key={jogadora.id} nome={jogadora.nome} />)}
            </div>
            <div className="flex justify-around">
              {jogoInfo.elencoAdversario.meioCampo?.map(jogadora => <Player key={jogadora.id} nome={jogadora.nome} />)}
            </div>
            <div className="flex justify-around">
              {jogoInfo.elencoAdversario.defensores?.map(jogadora => <Player key={jogadora.id} nome={jogadora.nome} />)}
            </div>
            <div className="flex justify-around">
              {jogoInfo.elencoAdversario.goleira?.map(jogadora => <Player key={jogadora.id} nome={jogadora.nome} />)}
            </div>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default JogoModal;