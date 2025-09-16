// Caminho: src/pages/CourtsPage.jsx

import { Map, ArrowRight } from 'lucide-react';
// MUDANÇA 1: Importar a imagem local
import mapaQuadras from '../assets/img/QuadrasImagem.png';

const CourtsPage = () => {
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
      name: 'Copinha Churrasco de Gato',
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
    <div className="p-4 md:p-8 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Central de Quadras
      </h1>

      <div className="relative h-64 lg:h-80 w-full rounded-lg overflow-hidden bg-gray-300 dark:bg-gray-800 mb-8 shadow-lg">
        {/* MUDANÇA 2: Usar a variável da imagem importada no 'src' */}
        <img
          src={mapaQuadras}
          className="w-full h-full object-cover opacity-70"
          alt="Mapa de quadras"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="text-center text-white p-4">
            <Map size={48} className="mx-auto mb-2" />
            <p className="font-semibold text-lg">Mapa interativo (simulação)</p>
            <p className="text-sm">Movimente para ver os campeonatos</p>
          </div>
        </div>
      </div>

      <h2 className="font-semibold text-2xl mb-4 text-gray-900 dark:text-white">
        Campeonatos Próximos
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {championships.map((champ) => (
          <div
            key={champ.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center space-x-4 hover:shadow-lg hover:border-[#b554b5] border border-transparent transition-all"
          >
            <div className="text-center bg-[#FF800080] text-orange-900 dark:text-orange-100 rounded-lg p-3">
              <p className="font-bold text-xl">{champ.date.split(' ')[0]}</p>
              <p className="text-xs font-semibold">
                {champ.date.split(' ')[1]}
              </p>
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {champ.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {champ.court}
              </p>
              <div className="flex items-center text-xs mt-2 space-x-3">
                <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-700 dark:text-gray-300">
                  {champ.format}
                </span>
                <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-700 dark:text-gray-300">
                  {champ.capacity}
                </span>
              </div>
            </div>
            <ArrowRight className="text-gray-400" size={20} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourtsPage;