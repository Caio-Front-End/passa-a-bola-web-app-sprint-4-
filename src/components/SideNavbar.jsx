// src/components/SideNavbar.jsx

// --> 1. Adicione useLocation e useNavigate, remova NavLink e Link
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { House, MapTrifold, FilmStrip, SignOut } from 'phosphor-react';
import { Bot } from 'lucide-react';
import logoPabOriginal from '../assets/img/logo-pab-original.png';

const navItems = [
  {
    path: '/',
    icon: <House size={28} />,
    activeIcon: <House size={28} weight="fill" />,
    label: 'Hub',
  },
  {
    path: '/courts',
    icon: <MapTrifold size={28} />,
    activeIcon: <MapTrifold size={28} weight="fill" />,
    label: 'Quadras',
  },
  {
    path: '/chatbot',
    icon: <Bot size={28} />,
    activeIcon: <Bot size={28} weight="fill" />,
    label: 'Tonha',
  },
  {
    path: '/finta',
    icon: <FilmStrip size={28} />,
    activeIcon: <FilmStrip size={28} weight="fill" />,
    label: 'FINTA',
  },
];

const SideNavBar = () => {
  const { currentUser, logout } = useAuth();

  // --> 2. Adicione os hooks para navegação
  const location = useLocation();
  const navigate = useNavigate();

  // --> 3. Adicione a array de rotas e a função de navegação
  const routes = ['/', '/courts', '/chatbot', '/finta', '/minha-conta'];

  const handleNavigate = (destinationPath) => {
    const currentIndex = routes.indexOf(location.pathname);
    const destinationIndex = routes.indexOf(destinationPath);

    if (
      currentIndex === -1 ||
      destinationIndex === -1 ||
      currentIndex === destinationIndex
    ) {
      navigate(destinationPath);
      return;
    }

    const direction = destinationIndex > currentIndex ? 'left' : 'right';
    navigate(destinationPath, { state: { direction } });
  };

  if (!currentUser) {
    return null;
  }

  const displayName =
    currentUser.name || currentUser.displayName || currentUser.email;
  const initial = displayName ? displayName.charAt(0).toUpperCase() : '?';

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[var(--bg-color2)] border-r border-gray-700/50 p-4">
      <div className="flex items-center gap-2 mb-8">
        <img
          src={logoPabOriginal}
          alt="Logo da Aplicação"
          className="w-10 h-10 brightness-0 invert"
        />
        <h1 className="text-xl font-bold text-white">Passa a Bola</h1>
      </div>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => {
            // --> 4. Calcule o estado 'ativo' manualmente
            const isActive = location.pathname === item.path;
            return (
              <li key={item.label}>
                {/* --> 5. Substitua NavLink por um <button> com onClick */}
                <button
                  onClick={() => handleNavigate(item.path)}
                  className={`flex items-center gap-4 w-full text-left px-4 py-3 rounded-lg text-lg font-semibold transition-colors duration-200 ${
                    isActive
                      ? 'bg-[var(--primary-color)]/20 text-[var(--primary-color)]'
                      : 'text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  {isActive ? item.activeIcon : item.icon}
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-gray-700/50 pt-4">
        {/* --> 6. Substitua o Link do perfil por um <button> com onClick */}
        <button
          onClick={() => handleNavigate('/minha-conta')}
          className="flex items-center gap-3 mb-4 p-2 w-full rounded-lg hover:bg-gray-700/50 transition-colors"
        >
          <img
            src={
              currentUser.photoURL ||
              `https://placehold.co/40x40/b554b5/FFFFFF?text=${initial}`
            }
            alt={displayName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-white text-left">{displayName}</p>
            <p className="text-xs text-gray-400 text-left">
              {currentUser.email}
            </p>
          </div>
        </button>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-lg font-semibold text-red-400 hover:bg-red-400/20 transition-colors"
        >
          <SignOut size={28} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default SideNavBar;
