import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { Home, Map, Video, Trophy, LogOut } from 'lucide-react';
import logoPabOriginal from '../assets/img/logo-pab-original.png';

const navItems = [
  { path: '/', icon: <Home />, label: 'Hub' },
  { path: '/courts', icon: <Map />, label: 'Quadras' },
  { path: '/finta', icon: <Video />, label: 'FINTA' },
];

const SideNavBar = () => {
  const { currentUser, logout } = useAuth();

  // Se não houver usuário, o componente não é renderizado.
  if (!currentUser) {
    return null;
  }

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center gap-2 mb-8">
        <img
          src={logoPabOriginal}
          alt="Logo da Aplicação"
          className="w-8 h-8 sm:w-10 sm:h-10 transition-all duration-300 dark:brightness-0 dark:invert"
        />
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          P.A.B
        </h1>
      </div>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.path}
                end // A prop 'end' garante que o link da home '/' só fica ativo na página exata
                className={({ isActive }) =>
                  `flex items-center gap-3 w-full px-4 py-3 rounded-lg text-lg font-semibold transition-colors duration-200 ${
                    isActive
                      ? 'bg-pink-100/80 dark:bg-[#b554b5]/20 text-[#b554b5] dark:text-pink-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={`https://placehold.co/40x40/b554b5/FFFFFF?text=${currentUser.name.charAt(
              0,
            )}`}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold text-gray-800 dark:text-white">
              {currentUser.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {currentUser.email}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-lg font-semibold text-[#b554b5] dark:text-pink-400 hover:bg-pink-100/80 dark:hover:bg-[#b554b5]/20 transition-colors"
        >
          <LogOut />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default SideNavBar;
