import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ptBR } from 'date-fns/locale';
import JogoModal from './JogoModal';
// --- CORREÇÃO: Importando a única fonte de dados verdadeira ---
import { proximoJogoInfo } from '../data/jogoData';

const AgendaCalendario = () => {
  const [mesAtual, setMesAtual] = useState(new Date());
  const [isModalAberto, setIsModalAberto] = useState(false);

  // Removida a definição de 'proximoJogoInfo' daqui. Agora vem do import.

  const mesAnterior = () => setMesAtual(subMonths(mesAtual, 1));
  const proximoMes = () => setMesAtual(addMonths(mesAtual, 1));

  const primeiroDiaDoMes = startOfMonth(mesAtual);
  const ultimoDiaDoMes = endOfMonth(mesAtual);
  const diasDoMes = eachDayOfInterval({ start: primeiroDiaDoMes, end: ultimoDiaDoMes });
  const diasDePadding = (getDay(primeiroDiaDoMes) + 6) % 7;
  const diasDaSemana = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom'];

  return (
    <>
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white">
        <div className="border border-gray-700 p-1 rounded-xl flex justify-between items-center mb-4">
          <button onClick={mesAnterior} className="p-1 rounded-full hover:bg-gray-700"><ChevronLeft size={20} /></button>
          <h2 className="font-bold text-xl capitalize">{format(mesAtual, 'MMMM yyyy', { locale: ptBR })}</h2>
          <button onClick={proximoMes} className="p-1 rounded-full hover:bg-gray-700"><ChevronRight size={20} /></button>
        </div>
        <div className="grid grid-cols-7 gap-x-0 gap-y-0 place-items-center px-3">
          {diasDaSemana.map((dia) => (<div key={dia} className="font-semibold text-[12px] uppercase text-gray-400">{dia}</div>))}
          {Array.from({ length: diasDePadding }).map((_, index) => (<div key={`padding-${index}`} />))}
          {diasDoMes.map((dia) => {
            const isProximoJogo = isSameDay(dia, proximoJogoInfo.data);
            const isDiaDeHoje = isToday(dia);
            let dayClasses = 'flex items-center justify-center h-9 w-9 rounded-full cursor-pointer transition-transform duration-200 hover:scale-110';
            if (isProximoJogo) { dayClasses += ' bg-green-500 text-white font-bold';
            } else if (isDiaDeHoje) { dayClasses += ' bg-[#b554b5] text-white';
            } else { dayClasses += ' text-gray-300 hover:bg-gray-700'; }
            return (<div key={dia.toString()} className={dayClasses} onClick={() => isProximoJogo && setIsModalAberto(true)}>{format(dia, 'd')}</div>);
          })}
        </div>
      </div>
      {isModalAberto && (<JogoModal onClose={() => setIsModalAberto(false)} jogoInfo={proximoJogoInfo} />)}
    </>
  );
};

export default AgendaCalendario;