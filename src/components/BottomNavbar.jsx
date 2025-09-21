import { NavLink } from 'react-router-dom';
import { Home, Map, Video } from 'lucide-react';

const navItems = [
  { path: '/', icon: <Home />, label: 'Hub' },
  { path: '/courts', icon: <Map />, label: 'Quadras' },
  { path: '/finta', icon: <Video />, label: 'FINTA' },
];

const BottomNavBar = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800/55 backdrop-blur-sm  border-t border-gray-200 dark:border-gray-700 flex justify-around items-center md:hidden">
      {navItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.path}
          // NavLink nos dá um "isActive" para sabermos se o link está ativo
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full transition-colors duration-200 ${
              isActive
                ? 'text-[#b554b5] dark:text-pink-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-[#d44b84]'
            }`
          }
        >
          {item.icon}
          <span className="text-xs mt-1">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNavBar;
