// src/components/AddMatchModal.jsx (Versão MVP Modificada)
import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import ModalWrapper from './ModalWrapper';

function AddMatchModal({ isOpen, onClose, onMatchSubmit }) {
  const [formData, setFormData] = useState({
    result: 'victory',
    goals: 0,
    assists: 0,
    yellowCard: false,
    redCard: false,
    mvp: false,
    rating: 3,
  });

  const handleNumberChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: Math.max(0, value)
    }));
  };

  const handleToggle = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onMatchSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalWrapper title="Adicionar Nova Partida" onClose={onClose}>
      <div className="p-4 sm:p-6 text-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Resultado */}
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-3">Resultado da Partida</h3>
            <div className="flex gap-3">
              {['victory', 'draw', 'loss'].map((result) => (
                <button
                  key={result}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, result }))}
                  className={`flex-1 py-2 px-4 rounded-md ${
                    formData.result === result 
                      ? 'bg-[var(--primary-color)] text-white' 
                      : 'bg-gray-700/50 text-gray-300'
                  }`}
                >
                  {result === 'victory' ? 'Vitória' : result === 'draw' ? 'Empate' : 'Derrota'}
                </button>
              ))}
            </div>
          </div>

          {/* Estatísticas de Ataque */}
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-3">Estatísticas de Ataque</h3>
            <div className="space-y-4">
              {[
                { label: 'Gols Marcados', field: 'goals' },
                { label: 'Assistências', field: 'assists' },

              ].map(({ label, field }) => (
                <div key={field} className="flex items-center justify-between">
                  <span className="text-gray-300">{label}</span>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleNumberChange(field, formData[field] - 1)}
                      className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{formData[field]}</span>
                    <button
                      type="button"
                      onClick={() => handleNumberChange(field, formData[field] + 1)}
                      className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Disciplina */}
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-3">Disciplina</h3>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => handleToggle('yellowCard')}
                className={`flex-1 py-2 px-4 rounded-md ${
                  formData.yellowCard ? 'bg-yellow-500 text-black' : 'bg-gray-700/50 text-gray-300'
                }`}
              >
                Cartão Amarelo
              </button>
              <button
                type="button"
                onClick={() => handleToggle('redCard')}
                className={`flex-1 py-2 px-4 rounded-md ${
                  formData.redCard ? 'bg-red-500 text-white' : 'bg-gray-700/50 text-gray-300'
                }`}
              >
                Cartão Vermelho
              </button>
            </div>
          </div>

          {/* MVP e Avaliação */}
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white font-semibold">Craque da Partida (MVP)</span>
              <button
                type="button"
                onClick={() => handleToggle('mvp')}
                className={`px-4 py-2 rounded-md ${
                  formData.mvp ? 'bg-[var(--primary-color)] text-white' : 'bg-gray-700/50 text-gray-300'
                }`}
              >
                {formData.mvp ? 'Sim' : 'Não'}
              </button>
            </div>

            <div className="mt-4">
              <span className="text-white font-semibold block mb-2">Sua Avaliação</span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                    className="focus:outline-none"
                  >
                    <Star
                      size={24}
                      className={star <= formData.rating ? 'fill-[var(--primary-color)] text-[var(--primary-color)]' : 'text-gray-600'}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[var(--primary-color)] text-white rounded-md hover:bg-opacity-90"
            >
              Salvar Partida
            </button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
}

export default AddMatchModal;