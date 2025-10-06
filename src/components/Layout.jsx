import { Outlet, useLocation, useNavigate, useOutlet } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion';

import SideNavBar from './SideNavbar.jsx';
import BottomNavBar from './BottomNavbar.jsx';
import MobileHeader from './MobileHeader.jsx';
import BackButton from './BackButton.jsx';
import { useAuth } from '../hooks/useAuth.js';

const pageVariants = {
  enter: (direction) => ({
    x: direction === 'left' ? '100vw' : '-100vw',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction === 'left' ? '-100vw' : '100vw',
    opacity: 0,
  }),
};

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const outlet = useOutlet();
  const { direction } = location.state || {};
  const { currentUser } = useAuth();
  const isFintaPage = location.pathname === '/finta';
  const isTonhaPage = location.pathname === '/chatbot';
  const routes = ['/', '/courts', '/chatbot', '/finta', '/minha-conta'];

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      const currentIndex = routes.indexOf(location.pathname);
      if (currentIndex < routes.length - 1 && currentIndex !== -1) {
        navigate(routes[currentIndex + 1], {
          state: { direction: 'left' },
        });
      }
    },
    onSwipedRight: () => {
      const currentIndex = routes.indexOf(location.pathname);
      if (currentIndex > 0 && currentIndex !== -1) {
        navigate(routes[currentIndex - 1], {
          state: { direction: 'right' },
        });
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: false,
  });

  return (
    // --- CORREÇÃO AQUI: Trocado 'h-screen' por 'h-dvh' ---
    <div className="w-full h-dvh bg-[var(--bg-color)] flex font-sans">
      {!isFintaPage && <MobileHeader />}
      {isFintaPage && <BackButton />}
      <SideNavBar />
      <div className="flex-1 flex flex-col overflow-hidden" {...handlers}>
        <main
          className={`
            flex-1 overflow-y-auto w-full h-full
            ${isFintaPage || isTonhaPage ? 'pb-0' : 'pb-25 pt-10 md:pt-0'}
            relative
          `}
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={location.pathname}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'tween', ease: 'easeInOut', duration: 0.3 },
                opacity: { duration: 0.2 },
              }}
              className="absolute w-full h-full"
            >
              {outlet}
            </motion.div>
          </AnimatePresence>
        </main>
        {!isFintaPage && <BottomNavBar />}
      </div>
    </div>
  );
};

export default Layout;