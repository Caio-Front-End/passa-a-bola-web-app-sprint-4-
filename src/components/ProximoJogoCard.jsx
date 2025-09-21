// Caminho: src/components/ProximoJogoCard.jsx

import React from 'react';

const ProximoJogoCard = () => {
  // Dados estáticos para o card
  const proximoJogo = {
    dia: '25',
    mes: 'SET',
    adversario: 'Time Rivais FC',
    horario: '19:30',
  };

  return (
    <div className="bg-[#b554b5] text-white p-5 rounded-lg shadow-lg flex items-center space-x-4">
      {/* Seção da Data */}
      <div className="text-center pr-4 border-r border-pink-400/50">
        <p className="text-4xl font-bold">{proximoJogo.dia}</p>
        <p className="text-md font-semibold tracking-wider">{proximoJogo.mes}</p>
      </div>

      {/* Seção de Informações do Jogo */}
      <div className="flex-grow">
        <p className="text-sm font-light">Próximo Jogo</p>
        <p className="text-xl font-bold">vs {proximoJogo.adversario}</p>
        <p className="text-sm">{proximoJogo.horario}</p>
      </div>
    </div>
  );
};

export default ProximoJogoCard;