import { Outlet, useLocation } from 'react-router-dom';
import SideNavBar from './SideNavbar.jsx';
import BottomNavBar from './BottomNavBar.jsx';
import Chatbot from './Chatbot.jsx';
import MobileHeader from './MobileHeader.jsx';

//Cria o "elemento pai" de todas as seções, elas serão renderizadas dentro deste layout,
//que denpendendo do tamanho da tela, renderiza o navbar no inferior ou lateral
const Layout = () => {
  //hook para definir o condicional e não exibir no FINTA
  const location = useLocation();
  const isFintaPage = location.pathname === '/finta';

  return (
    <div className="w-full h-screen bg-white dark:bg-gray-900 flex font-sans">
      {/* O header só será renderizado se a página atual NÃO for a FINTA */}
      {!isFintaPage && <MobileHeader />}

      <SideNavBar />
      <Chatbot />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* O padding superior também é condicional para não quebrar o layout */}
        <main
          className={`flex-1 overflow-y-auto w-full h-full pb-16 md:pb-0 ${
            isFintaPage ? 'pt-0' : 'pt-16 md:pt-0'
          }`}
        >
          {/* O Outlet renderiza o componente da rota filha (HubPage, Finta, etc.) */}
          <Outlet />
        </main>
        <BottomNavBar />
      </div>
    </div>
  );
};

export default Layout;
