import { NavLink } from 'react-router-dom';
// Importando os ícones da nova biblioteca (Phosphor Icons)
import { House, MapTrifold, FilmStrip } from 'phosphor-react';

// Agora cada item tem um ícone padrão e um ícone ativo (preenchido)
const navItems = [
  { path: '/', icon: <House size={26} />, activeIcon: <House size={26} weight="fill" />, label: 'Hub' },
  { path: '/finta', icon: <FilmStrip size={28} />, activeIcon: <FilmStrip size={28} weight="fill" />, label: 'FINTA' }, // Item central
  { path: '/courts', icon: <MapTrifold size={26} />, activeIcon: <MapTrifold size={26} weight="fill" />, label: 'Quadras' },
];

const BottomNavBar = () => {
  const middleIndex = Math.floor(navItems.length / 2);

  return (
    // Container principal: agora é flutuante, centralizado e com bordas arredondadas
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-xs md:hidden">
      <div className="relative flex h-16 items-center justify-around rounded-full border border-[var(--bg-color2)] bg-[var(--bg-color)]/60 backdrop-blur-md shadow-lg">
        {navItems.map((item, index) => {
          const isMiddleButton = index === middleIndex;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => {
                // Classes base para todos os links
                let classes = 'flex flex-col items-center justify-center transition-all duration-300';
                
                // Estilos para o botão central
                if (isMiddleButton) {
                  classes += ' absolute left-1/2 -translate-x-1/2 -translate-y-[28px] h-16 w-16 rounded-full shadow-lg';
                  classes += isActive 
                    ? ' bg-[var(--primary-color)] text-black' // Cor de fundo ativa para o botão central
                    : ' bg-[var(--bg-color2)] text-gray-300'; // Cor de fundo inativa
                } 
                // Estilos para os outros botões
                else {
                  classes += ' w-full h-full';
                  classes += isActive
                    ? ' text-[var(--primary-color)]' // Cor do ícone ativo
                    : ' text-gray-400 hover:text-white'; // Cor do ícone inativo
                }
                return classes;
              }}
            >
              {({ isActive }) => (
                <>
                  {/* Renderiza o ícone preenchido se estiver ativo, senão o padrão */}
                  {isActive ? item.activeIcon : item.icon}
                  
                  {/* Oculta o texto do botão central para um visual mais limpo */}
                  {!isMiddleButton && (
                    <span className={`text-[10px] mt-1 font-medium`}>
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavBar;