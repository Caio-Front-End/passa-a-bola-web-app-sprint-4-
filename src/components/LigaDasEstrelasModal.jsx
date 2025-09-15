import ModalWrapper from './ModalWrapper';

const tableData = [
  {
    pos: 1,
    team: 'Tornados',
    p: 18,
    j: 7,
    v: 6,
    e: 0,
    d: 1,
    gp: 22,
    gc: 5,
    sg: 17,
  },
  {
    pos: 2,
    team: 'Valquírias',
    p: 16,
    j: 7,
    v: 5,
    e: 1,
    d: 1,
    gp: 15,
    gc: 7,
    sg: 8,
  },
  {
    pos: 3,
    team: 'Guerreiras FC',
    p: 14,
    j: 7,
    v: 4,
    e: 2,
    d: 1,
    gp: 18,
    gc: 10,
    sg: 8,
  },
  {
    pos: 4,
    team: 'Lobas da Várzea',
    p: 11,
    j: 7,
    v: 3,
    e: 2,
    d: 2,
    gp: 12,
    gc: 11,
    sg: 1,
  },
  {
    pos: 5,
    team: 'Fênix',
    p: 8,
    j: 7,
    v: 2,
    e: 2,
    d: 3,
    gp: 9,
    gc: 14,
    sg: -5,
  },
  {
    pos: 6,
    team: 'Unidas da Bola',
    p: 5,
    j: 7,
    v: 1,
    e: 2,
    d: 4,
    gp: 7,
    gc: 16,
    sg: -9,
  },
  {
    pos: 7,
    team: 'Estrelas do Campo',
    p: 4,
    j: 7,
    v: 1,
    e: 1,
    d: 5,
    gp: 5,
    gc: 15,
    sg: -10,
  },
  {
    pos: 8,
    team: 'Fúria Feminina',
    p: 2,
    j: 7,
    v: 0,
    e: 2,
    d: 5,
    gp: 6,
    gc: 21,
    sg: -15,
  },
];

const LigaDasEstrelasModal = ({ onClose }) => {
  return (
    <ModalWrapper title="Liga das Estrelas - Tabela" onClose={onClose}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
            <tr>
              <th scope="col" className="px-4 py-3">
                Pos
              </th>
              <th scope="col" className="px-6 py-3">
                Time
              </th>
              <th scope="col" className="px-2 py-3 text-center">
                P
              </th>
              <th scope="col" className="px-2 py-3 text-center">
                J
              </th>
              <th scope="col" className="px-2 py-3 text-center">
                V
              </th>
              <th scope="col" className="px-2 py-3 text-center">
                E
              </th>
              <th scope="col" className="px-2 py-3 text-center">
                D
              </th>
              <th
                scope="col"
                className="px-2 py-3 text-center hidden sm:table-cell"
              >
                GP
              </th>
              <th
                scope="col"
                className="px-2 py-3 text-center hidden sm:table-cell"
              >
                GC
              </th>
              <th scope="col" className="px-2 py-3 text-center">
                SG
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr
                key={row.pos}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">
                  {row.pos}
                </td>
                <th
                  scope="row"
                  className="px-6 py-4 font-bold text-gray-900 dark:text-white whitespace-nowrap"
                >
                  {row.team}
                </th>
                <td className="px-2 py-4 text-center font-bold">{row.p}</td>
                <td className="px-2 py-4 text-center">{row.j}</td>
                <td className="px-2 py-4 text-center">{row.v}</td>
                <td className="px-2 py-4 text-center">{row.e}</td>
                <td className="px-2 py-4 text-center">{row.d}</td>
                <td className="px-2 py-4 text-center hidden sm:table-cell">
                  {row.gp}
                </td>
                <td className="px-2 py-4 text-center hidden sm:table-cell">
                  {row.gc}
                </td>
                <td className="px-2 py-4 text-center">{row.sg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModalWrapper>
  );
};

export default LigaDasEstrelasModal;
