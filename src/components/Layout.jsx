// src/components/Layout.jsx

import { Outlet, useLocation, useNavigate, useOutlet } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

import SideNavBar from './SideNavbar.jsx';
import BottomNavBar from './BottomNavbar.jsx';
import MobileHeader from './MobileHeader.jsx';
import Chatbot from './Chatbot.jsx';
import BackButton from './BackButton.jsx';
import SuccessToast from './SuccessToast.jsx';
import { useToast } from '../contexts/ToastContext.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { Bot } from 'lucide-react';

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
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const outlet = useOutlet();
  const { direction } = location.state || {};
  const { currentUser } = useAuth();
  const { toast, hideToast } = useToast();
  const routes = ['/', '/courts', '/finta', '/minha-conta'];

  // A constante 'isFintaPage' e a lógica condicional foram removidas.
  const isFintaPage = location.pathname === '/finta';

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      const currentIndex = routes.indexOf(location.pathname);
      if (currentIndex < routes.length - 1 && currentIndex !== -1) {
        navigate(routes[currentIndex + 1], { state: { direction: 'left' } });
      }
    },
    onSwipedRight: () => {
      const currentIndex = routes.indexOf(location.pathname);
      if (currentIndex > 0 && currentIndex !== -1) {
        navigate(routes[currentIndex - 1], { state: { direction: 'right' } });
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: false,
  });

  return (
    <div className="w-full h-dvh bg-[var(--bg-color)] flex font-sans">
      <SuccessToast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      {!isFintaPage && <MobileHeader />}
      {isFintaPage && <BackButton />}
      <SideNavBar />
      <div
        className="flex-1 flex flex-col overflow-hidden relative"
        // Os handlers agora são aplicados incondicionalmente, como antes.
        {...handlers}
      >
        <main
          className={`
            flex-1 overflow-y-auto w-full h-full
            ${isFintaPage ? 'pb-0' : 'pb-25 pt-10 md:pt-0'}
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
        {!isFintaPage && (
          <BottomNavBar
            onChatbotOpen={() => setIsChatbotOpen(true)}
            isChatbotOpen={isChatbotOpen}
          />
        )}
      </div>

      <AnimatePresence>
        {isChatbotOpen && <Chatbot onClose={() => setIsChatbotOpen(false)} />}
      </AnimatePresence>

      {!isChatbotOpen && (
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="hidden md:flex cursor-pointer fixed bottom-6 right-6 w-16 h-16 bg-[#b554b5] text-white rounded-full items-center justify-center shadow-lg hover:bg-[#d44b84] transition-transform hover:scale-110 z-40"
          aria-label="Abrir chat"
        >
          <Bot size={28} />
        </button>
      )}
    </div>
  );
};

export default Layout;
