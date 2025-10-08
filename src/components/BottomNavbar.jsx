import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { House, Trophy, FilmStrip, UserCircle } from 'phosphor-react';
import { Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BottomNavBar = ({ onChatbotOpen, isChatbotOpen }) => {
  const routes = ['/', '/courts', '/finta', '/minha-conta'];
  const { currentUser } = useAuth();
  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navItemsToRender = [
    {
      path: '/',
      icon: <House size={28} />,
      activeIcon: <House size={28} weight="fill" />,
      label: 'Hub',
    },
    {
      path: '/courts',
      icon: <Trophy size={28} />,
      activeIcon: <Trophy size={28} weight="fill" />,
      label: 'Campeonatos',
    },
    {
      path: '/finta',
      icon: <FilmStrip size={28} />,
      activeIcon: <FilmStrip size={28} weight="fill" />,
      label: 'FINTA',
    },
    {
      path: '/minha-conta',
      icon: <UserCircle size={28} />,
      activeIcon: <UserCircle size={28} weight="fill" />,
      label: 'Perfil',
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path) => {
    const currentIndex = routes.indexOf(location.pathname);
    const nextIndex = routes.indexOf(path);
    const direction = nextIndex > currentIndex ? 'left' : 'right';
    navigate(path, { state: { direction } });
  };

  if (!currentUser) return null;

  return (
    <nav
      className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-md md:hidden z-30"
      ref={menuRef}
    >
      <div className="relative flex h-16 items-center justify-around rounded-full border-2 border-gray-200/10 bg-[var(--bg-color)]/60 backdrop-blur-md shadow-lg">
        {/* O contêiner principal agora tem a transição de layout */}
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="flex justify-around items-center w-full h-full px-2"
        >
          {navItemsToRender.slice(0, 2).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.button
                layout="position"
                key={item.label}
                onClick={() => handleNavigation(item.path)} 
                className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-300 ${
                  isActive
                    ? 'text-[var(--primary-color)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {isActive ? item.activeIcon : item.icon}
                <span className="text-[10px] mt-1 font-medium">
                  {item.label}
                </span>
              </motion.button>
            );
          })}

          {/* O espaçador agora anima sua largura e opacidade diretamente */}
          <motion.div
            animate={{
              width: isChatbotOpen ? 0 : '2.5rem',
              opacity: isChatbotOpen ? 0 : 1,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="flex-shrink-0"
          />

          {navItemsToRender.slice(2, 4).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.button
                layout="position"
                key={item.label}
                onClick={() => handleNavigation(item.path)} 
                className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-300 ${
                  isActive
                    ? 'text-[var(--primary-color)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {isActive ? item.activeIcon : item.icon}
                <span className="text-[10px] mt-1 font-medium">
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Animação do botão flutuante permanece a mesma */}
        <AnimatePresence>
          {!isChatbotOpen && (
            <motion.button
              initial={{ scale: 0, y: -10 }}
              animate={{ scale: 1, y: -28 }}
              exit={{ scale: 0, y: -10 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              onClick={onChatbotOpen}
              className="absolute left-1/2 -translate-x-1/2 h-16 w-16 rounded-full shadow-lg flex items-center justify-center bg-[var(--primary-color)] text-black"
            >
              <Bot size={32} strokeWidth={1.5} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default BottomNavBar;
