import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { House, MapTrifold, FilmStrip, UserCircle } from 'phosphor-react';
import { Bot } from 'lucide-react';

const BottomNavBar = () => {
  const { currentUser } = useAuth();
  const menuRef = useRef(null);

  // Hooks para navegação e localização
  const location = useLocation();
  const navigate = useNavigate();

  // Rotas dinâmicas para a lógica da animação
  const routes = ['/', '/courts', '/chatbot', '/finta', '/minha-conta']; // Rotas fixas para a Jogadora

  const chatbotItem = {
    path: '/chatbot',
    icon: <Bot size={32} strokeWidth={1.5} />,
    activeIcon: <Bot size={32} strokeWidth={2.5} />,
    label: 'Tonha',
  };

  // Itens de navegação para a Jogadora (os 4 em volta do botão central)
  const navItemsToRender = [
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

  // Função de navegação inteligente
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
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) return null;

  return (
    <nav
      className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-md md:hidden z-30"
      ref={menuRef}
    >
      <div className="relative flex h-16 items-center justify-around rounded-full border-2 border-gray-200/10 bg-[var(--bg-color)]/60 backdrop-blur-md shadow-lg">
        <div className="flex justify-around items-center w-full h-full px-2">
          {/* Pega os 2 primeiros itens (Hub e Quadras) */}
          {navItemsToRender.slice(0, 2).map((item) => {
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
          })}

          <div className="w-10 flex-shrink-0"></div>

          {/* Pega o 3º e 4º itens (Finta e Perfil) */}
          {navItemsToRender.slice(2, 4).map((item) => {
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
          })}
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
