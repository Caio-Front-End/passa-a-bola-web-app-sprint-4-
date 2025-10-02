// src/components/SideNavbar.jsx
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { House, MapTrifold, FilmStrip, SignOut, AppWindow } from 'phosphor-react'; // Adicionado AppWindow
import logoPabOriginal from '../assets/img/logo-pab-original.png';

const SideNavBar = () => {
  const { currentUser, logout } = useAuth();

  if (!currentUser) {
    return null;
  }

  // Define quais itens de navegação serão exibidos
  const isOrganizer = currentUser.userType === 'organizador';
  const navItems = isOrganizer
    ? [
        { path: '/dashboard', icon: <AppWindow size={28} />, activeIcon: <AppWindow size={28} weight="fill" />, label: 'Dashboard' },
        { path: '/finta', icon: <FilmStrip size={28} />, activeIcon: <FilmStrip size={28} weight="fill" />, label: 'FINTA' },
      ]
    : [
        { path: '/', icon: <House size={28} />, activeIcon: <House size={28} weight="fill" />, label: 'Hub' },
        { path: '/courts', icon: <MapTrifold size={28} />, activeIcon: <MapTrifold size={28} weight="fill" />, label: 'Quadras' },
        { path: '/finta', icon: <FilmStrip size={28} />, activeIcon: <FilmStrip size={28} weight="fill" />, label: 'FINTA' },
      ];

  const displayName = currentUser.displayName || currentUser.email;
  const initial = displayName ? displayName.charAt(0).toUpperCase() : '?';

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[var(--bg-color2)] border-r border-gray-700/50 p-4">
      <div className="flex items-center gap-2 mb-8">
        <img src={logoPabOriginal} alt="Logo da Aplicação" className="w-10 h-10 brightness-0 invert" />
        <h1 className="text-xl font-bold text-white">Passa a Bola</h1>
      </div>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-4 w-full px-4 py-3 rounded-lg text-lg font-semibold transition-colors duration-200 ${
                    isActive ? 'bg-[var(--primary-color)]/20 text-[var(--primary-color)]' : 'text-gray-300 hover:bg-gray-700/50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive ? item.activeIcon : item.icon}
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-gray-700/50 pt-4">
        <Link to="/minha-conta" className="flex items-center gap-3 mb-4 p-2 rounded-lg hover:bg-gray-700/50 transition-colors">
          <img
            src={`https://placehold.co/40x40/b554b5/FFFFFF?text=${initial}`}
            alt={displayName}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold text-white">{displayName}</p>
            <p className="text-xs text-gray-400">{currentUser.email}</p>
          </div>
        </Link>
        <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-lg font-semibold text-red-400 hover:bg-red-400/20 transition-colors">
          <SignOut size={28} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default SideNavBar;