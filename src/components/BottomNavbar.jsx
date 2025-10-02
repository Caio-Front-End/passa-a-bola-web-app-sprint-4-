// src/components/BottomNavbar.jsx
import { useState, useEffect, useRef } from 'react';
// 1. Adicione useLocation e useNavigate, remova NavLink e Link se não forem mais usados em outro lugar
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { House, MapTrifold, FilmStrip, UserCircle } from 'phosphor-react';
import { Bot } from 'lucide-react';

const BottomNavBar = () => {
  const { currentUser } = useAuth(); // removi o logout daqui pois não estava sendo usado
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // 1. Hooks para navegação e localização
  const location = useLocation();
  const navigate = useNavigate();

  // 2. Ordem das rotas para a lógica da animação (deve ser a mesma do Layout.jsx)
  const routes = ['/', '/courts', '/chatbot', '/finta', '/minha-conta'];

  const chatbotItem = {
    path: '/chatbot',
    icon: <Bot size={32} strokeWidth={1.5} />,
    activeIcon: <Bot size={32} strokeWidth={2.5} />,
    label: 'Tonha',
  };
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

  // 3. Função de navegação inteligente
  const handleNavigate = (destinationPath) => {
    const currentIndex = routes.indexOf(location.pathname);
    const destinationIndex = routes.indexOf(destinationPath);

    if (
      currentIndex === -1 ||
      destinationIndex === -1 ||
      currentIndex === destinationIndex
    ) {
      // Apenas navega se não souber a rota atual ou se for para uma rota não listada
      // ou se for a mesma rota
      navigate(destinationPath);
      return;
    }

    const direction = destinationIndex > currentIndex ? 'left' : 'right';
    navigate(destinationPath, { state: { direction } });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) return null;

  // Ajusta a lógica de exibição para acomodar 2 ou 3 itens
  const firstHalf = navItems.slice(0, Math.ceil(navItems.length / 2));
  const secondHalf = navItems.slice(Math.ceil(navItems.length / 2));

  return (
    <nav
      className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-md md:hidden z-30"
      ref={menuRef}
    >
      <div className="relative flex h-16 items-center justify-around rounded-full border-2 border-gray-200/10 bg-[var(--bg-color)]/60 backdrop-blur-md shadow-lg">
        <div className="flex justify-around items-center w-full h-full px-2">
          {/* 4. Substituindo NavLink por button com onClick */}
          {
            navItems
              .map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavigate(item.path)}
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
                  </button>
                );
              })
              .slice(0, 2) /* Pega os 2 primeiros itens */
          }

          <div className="w-10 flex-shrink-0"></div>

          {
            navItems
              .map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavigate(item.path)}
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
                  </button>
                );
              })
              .slice(2, 4) /* Pega o 3º e 4º itens (Finta e Perfil) */
          }
        </div>

        {/* Botão central do Chatbot */}
        <button
          onClick={() => handleNavigate(chatbotItem.path)}
          className={`absolute left-1/2 -translate-x-1/2 -translate-y-[28px] h-16 w-16 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
            location.pathname === chatbotItem.path
              ? 'bg-[var(--primary-color-hover)] text-gray-300'
              : 'bg-[var(--primary-color)] text-black'
          }`}
        >
          {location.pathname === chatbotItem.path
            ? chatbotItem.activeIcon
            : chatbotItem.icon}
        </button>
      </div>
    </nav>
  );
};

export default BottomNavBar;
