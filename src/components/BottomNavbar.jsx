import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
// Ícones da Phosphor para a navegação
import { House, MapTrifold, FilmStrip, UserCircle, SignOut } from 'phosphor-react';
// Ícone da Lucide para o Chatbot, para manter a consistência
import { Bot } from 'lucide-react';

const BottomNavBar = () => {
    const { currentUser, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // O Chatbot agora tem seu próprio objeto para clareza
    const chatbotItem = { 
        path: '/chatbot', 
        icon: <Bot size={32} strokeWidth={1.5} />, 
        activeIcon: <Bot size={32} strokeWidth={2.5} />, 
        label: 'Tonha' 
    };

    // Itens de navegação sem o chatbot
    const navItems = [
        { path: '/', icon: <House size={28} />, activeIcon: <House size={28} weight="fill" />, label: 'Hub' },
        { path: '/courts', icon: <MapTrifold size={28} />, activeIcon: <MapTrifold size={28} weight="fill" />, label: 'Quadras' },
        { path: '/finta', icon: <FilmStrip size={28} />, activeIcon: <FilmStrip size={28} weight="fill" />, label: 'FINTA' },
    ];
    
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

    return (
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-md md:hidden z-30" ref={menuRef}>
            {isMenuOpen && (
                 <div className="absolute bottom-[75px] right-0 w-52 bg-gray-700 rounded-xl shadow-lg py-2 z-30 border border-gray-600">
                    <div className="px-4 py-2 text-sm text-gray-200">
                        <p className="font-semibold">{currentUser.name}</p>
                        <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
                    </div>
                    <div className="border-t border-gray-600 my-1"></div>
                    <button
                        onClick={() => {
                            logout();
                            setIsMenuOpen(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-left text-red-400 hover:bg-gray-600"
                    >
                        <SignOut size={18} />
                        <span>Sair</span>
                    </button>
                </div>
            )}

            <div className="relative flex h-16 items-center justify-around rounded-full border border-[var(--bg-color2)] bg-[var(--bg-color)]/70 backdrop-blur-xl shadow-lg">
                <div className="flex justify-around items-center w-full h-full px-2">
                    {/* Itens da Esquerda (Hub, Quadras) */}
                    {navItems.slice(0, 2).map((item) => (
                        <NavLink key={item.label} to={item.path} end={item.path === '/'} className={({isActive}) => `flex flex-col items-center justify-center w-full h-full transition-colors duration-300 ${isActive ? 'text-[var(--primary-color)]' : 'text-gray-400 hover:text-white'}`}>
                            {({isActive}) => (<> {isActive ? item.activeIcon : item.icon} <span className="text-[10px] mt-1 font-medium">{item.label}</span> </>)}
                        </NavLink>
                    ))}

                    {/* Espaço reservado para o botão central para criar o espaçamento */}
                    <div className="w-10 flex-shrink-0"></div>

                    {/* Itens da Direita (Finta, Perfil) */}
                    {navItems.slice(2, 3).map((item) => (
                         <NavLink key={item.label} to={item.path} className={({isActive}) => `flex flex-col items-center justify-center w-full h-full transition-colors duration-300 ${isActive ? 'text-[var(--primary-color)]' : 'text-gray-400 hover:text-white'}`}>
                           {({isActive}) => (<> {isActive ? item.activeIcon : item.icon} <span className="text-[10px] mt-1 font-medium">{item.label}</span> </>)}
                        </NavLink>
                    ))}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-300 ${isMenuOpen ? 'text-[var(--primary-color)]' : 'text-gray-400 hover:text-white'}`}
                    >
                        <UserCircle size={28} weight={isMenuOpen ? "fill" : "regular"} />
                        <span className="text-[10px] mt-1 font-medium">Perfil</span>
                    </button>
                </div>

                {/* Botão Central do Chatbot (Absoluto) */}
                <NavLink
                    to={chatbotItem.path}
                    className={({ isActive }) => 
                        `absolute left-1/2 -translate-x-1/2 -translate-y-[28px] h-16 w-16 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
                            isActive ? 'bg-[var(--primary-color)] text-black' : 'bg-[var(--bg-color2)] text-gray-300'
                        }`
                    }
                >
                    {({ isActive }) => (isActive ? chatbotItem.activeIcon : chatbotItem.icon)}
                </NavLink>
            </div>
        </nav>
    );
};

export default BottomNavBar;