import { useState } from 'react';
import { ArrowRight, Search, PlusCircle } from 'lucide-react';
import CreateChampionshipModal from '../components/CreateChampionshipModal';

const CourtsPage = () => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const championships = [
    {
      id: 1,
      name: 'Copa Delas',
      court:
        'Arena Mega Sports - R. Harry Dannenberg, 800 - Itaquera, São Paulo - SP, 08270-010',
      date: '25 SET',
      format: 'Society 7x7',
      capacity: '8/12 times',
    },
    {
      id: 2,
      name: 'Liga da ZL',
      court:
        'R9 Academy Itaquera - Av. Itaquera, 7085 - Itaquera, São Paulo - SP, 08295-000',
      date: '28 SET',
      format: 'Futsal 5x5',
      capacity: '10/16 times',
    },
    {
      id: 3,
      name: 'Copinha Churrasco',
      court:
        'SED Itaquerense - R. Antônio Soares Lara, 135 - Vila Carmosina, São Paulo - SP, 08210-060',
      date: '02 OUT',
      format: 'Campo 11x11',
      capacity: '4/8 times',
    },
    {
      id: 4,
      name: 'Rachão Valendo Coca',
      court:
        'Arena JS - R. José Alves dos Santos, 46 - Vila Campanela, São Paulo - SP, 08220-450',
      date: '02 OUT',
      format: 'Campo 11x11',
      capacity: '4/8 times',
    },
  ];

  return (
    <>
      <div className="p-4 md:p-8 bg-[var(--bg-color)] text-gray-200 min-h-full">
        <h1 className="text-3xl font-bold mb-6 text-white">
          Central de Quadras
        </h1>

        {/* Container de Ações */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          {/* Botão Organizar */}
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex-1 md:flex-none bg-[var(--primary-color)] text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-[var(--primary-color-hover)] transition-colors"
          >
            <PlusCircle size={20} />
            <span>ORGANIZAR</span>
          </button>

          {/* Busca por ID */}
          <div className="relative flex-grow">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar campeonato por ID..."
              className="w-full pl-10 pr-3 py-3 bg-[var(--bg-color2)] rounded-lg text-white border border-gray-600 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
            />
          </div>
        </div>

        <h2 className="font-semibold text-2xl mb-4 text-white">
          Campeonatos Próximos
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {championships.map((champ) => (
            <div
              key={champ.id}
              className="bg-[var(--bg-color2)] p-4 rounded-lg shadow-md flex items-center space-x-4 hover:shadow-lg hover:border-[var(--primary-color)] border border-transparent transition-all"
            >
              <div className="text-center bg-[var(--primary-color)] text-white rounded-lg p-3">
                <p className="font-bold text-xl">{champ.date.split(' ')[0]}</p>
                <p className="text-xs font-semibold">
                  {champ.date.split(' ')[1]}
                </p>
              </div>
              <div className="flex-grow">
                <h3 className="font-bold text-lg text-gray-200">
                  {champ.name}
                </h3>
                <p className="text-sm text-gray-400">{champ.court}</p>
                <div className="flex items-center text-xs mt-2 space-x-3">
                  <span className="bg-gray-700 px-2 py-1 rounded-full text-gray-300">
                    {champ.format}
                  </span>
                  <span className="bg-gray-700 px-2 py-1 rounded-full text-gray-300">
                    {champ.capacity}
                  </span>
                </div>
              </div>
              <ArrowRight className="text-gray-400" size={20} />
            </div>
          ))}
        </div>
      </div>

      {isCreateModalOpen && (
        <CreateChampionshipModal onClose={() => setCreateModalOpen(false)} />
      )}
    </>
  );
};

export default CourtsPage;
