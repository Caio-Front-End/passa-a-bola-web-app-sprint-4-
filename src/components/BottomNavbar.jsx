// src/components/BottomNavbar.jsx
import { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { House, MapTrifold, FilmStrip, UserCircle, SignOut, AppWindow } from 'phosphor-react'; // Adicionado AppWindow
import { Bot } from 'lucide-react';

const BottomNavBar = () => {
    const { currentUser, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Define os itens de navegação com base no tipo de usuário
    const isOrganizer = currentUser?.userType === 'organizador';
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
    
    const chatbotItem = { path: '/chatbot', icon: <Bot size={32} strokeWidth={1.5} />, activeIcon: <Bot size={32} strokeWidth={2.5} />, label: 'Tonha' };

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
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-md md:hidden z-30" ref={menuRef}>
            {isMenuOpen && (
                 <div className="absolute bottom-[75px] right-0 w-52 bg-gray-700 rounded-xl shadow-lg py-2 z-30 border border-gray-600">
                    <div className="px-4 py-2 text-sm text-gray-200">
                        <p className="font-semibold">{currentUser.displayName}</p>
                        <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
                    </div>
                    <div className="border-t border-gray-600 my-1"></div>
                    <Link to="/minha-conta" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-left text-gray-200 hover:bg-gray-600">
                        <UserCircle size={18} />
                        <span>Minha Conta</span>
                    </Link>
                    <button onClick={() => { logout(); setIsMenuOpen(false); }} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-left text-red-400 hover:bg-gray-600">
                        <SignOut size={18} />
                        <span>Sair</span>
                    </button>
                </div>
            )}

            <div className="relative flex h-16 items-center justify-around rounded-full border-2 border-gray-200/10 bg-[var(--bg-color)]/60 backdrop-blur-md shadow-lg">
                <div className="flex justify-around items-center w-full h-full px-2">
                    {firstHalf.map((item) => (
                        <NavLink key={item.label} to={item.path} end={item.path === '/'} className={({isActive}) => `flex flex-col items-center justify-center w-full h-full transition-colors duration-300 ${isActive ? 'text-[var(--primary-color)]' : 'text-gray-400 hover:text-white'}`}>
                            {({isActive}) => (
                                <>
                                    {isActive ? item.activeIcon : item.icon}
                                    <span className="text-[10px] mt-1 font-medium">{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}

                    <div className="w-10 flex-shrink-0"></div>
                    
                    {secondHalf.map((item) => (
                         <NavLink key={item.label} to={item.path} className={({isActive}) => `flex flex-col items-center justify-center w-full h-full transition-colors duration-300 ${isActive ? 'text-[var(--primary-color)]' : 'text-gray-400 hover:text-white'}`}>
                           {({isActive}) => (
                                <>
                                    {isActive ? item.activeIcon : item.icon}
                                    <span className="text-[10px] mt-1 font-medium">{item.label}</span>
                                </>
                           )}
                        </NavLink>
                    ))}
                    
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-300 ${isMenuOpen ? 'text-[var(--primary-color)]' : 'text-gray-400 hover:text-white'}`}>
                        <UserCircle size={28} weight={isMenuOpen ? "fill" : "regular"} />
                        <span className="text-[10px] mt-1 font-medium">Perfil</span>
                    </button>
                </div>

                <NavLink to={chatbotItem.path} className={({ isActive }) => `absolute left-1/2 -translate-x-1/2 -translate-y-[28px] h-16 w-16 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-[var(--primary-color-hover)] text-gray-300' : 'bg-[var(--primary-color)] text-black'}`}>
                    {({ isActive }) => (isActive ? chatbotItem.activeIcon : chatbotItem.icon)}
                </NavLink>
            </div>
        </nav>
    );
};

export default BottomNavBar;