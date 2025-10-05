import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isToday,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ptBR } from 'date-fns/locale';

const AgendaCalendario = ({ upcomingGames = [], onGameClick }) => {
  const [mesAtual, setMesAtual] = useState(new Date());

  const mesAnterior = () => setMesAtual(subMonths(mesAtual, 1));
  const proximoMes = () => setMesAtual(addMonths(mesAtual, 1));

  const primeiroDiaDoMes = startOfMonth(mesAtual);
  const ultimoDiaDoMes = endOfMonth(mesAtual);
  const diasDoMes = eachDayOfInterval({
    start: primeiroDiaDoMes,
    end: ultimoDiaDoMes,
  });
  const diasDePadding = (getDay(primeiroDiaDoMes) + 6) % 7;
  const diasDaSemana = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom'];

  const gameDaysSet = new Set(upcomingGames.map((game) => game.date));

  return (
    <>
      <div className="bg-[var(--bg-color2)] p-4 rounded-lg shadow-lg text-white">
        <div className="border border-[var(--bg-color2-hover)] p-1 rounded-xl flex justify-between items-center mb-4">
          <button
            onClick={mesAnterior}
            className="p-1 rounded-full hover:bg-[var(--bg-color2-hover)]"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="font-bold text-xl capitalize">
            {format(mesAtual, 'MMMM yyyy', { locale: ptBR })}
          </h2>
          <button
            onClick={proximoMes}
            className="p-1 rounded-full hover:bg-[var(--bg-color2-hover)]"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-x-0 gap-y-0 place-items-center px-3">
          {diasDaSemana.map((dia) => (
            <div
              key={dia}
              className="font-semibold text-[12px] uppercase text-gray-400"
            >
              {dia}
            </div>
          ))}
          {Array.from({ length: diasDePadding }).map((_, index) => (
            <div key={`padding-${index}`} />
          ))}
          {diasDoMes.map((dia) => {
            const gameOnThisDay = upcomingGames.find((game) =>
              isSameDay(dia, parseISO(game.date)),
            );
            const isDiaDeHoje = isToday(dia);

            let dayClasses =
              'flex items-center justify-center h-9 w-9 rounded-full cursor-pointer transition-transform duration-200 hover:scale-110';

            if (gameOnThisDay) {
              dayClasses += ' bg-[var(--primary-color)] text-white font-bold';
            } else if (isDiaDeHoje) {
              dayClasses += ' bg-[var(--bg-color)] text-white font-bold';
            } else {
              dayClasses += ' text-gray-300 hover:bg-[var(--bg-color2-hover)]';
            }

            return (
              <div
                key={dia.toString()}
                className={dayClasses}
                onClick={() => gameOnThisDay && onGameClick(gameOnThisDay)}
              >
                {format(dia, 'd')}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AgendaCalendario;
