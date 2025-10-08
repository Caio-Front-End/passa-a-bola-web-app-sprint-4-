// src/components/SuccessToast.jsx

import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoPab from '../assets/img/logo-pab.png';

const SuccessToast = ({ isVisible, onClose }) => {
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsSuccess(false);

      const transitionTimer = setTimeout(() => {
        setIsSuccess(true);
      }, 1000);

      const closeTimer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => {
        clearTimeout(transitionTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          // A MUDANÇA ESTÁ AQUI: z-50 -> z-[60]
          className="fixed top-10 left-1/2 -translate-x-1/2 z-[60]"
        >
          <div
            className="
            w-14 h-14
            bg-[var(--bg-color)]/40 backdrop-blur-md 
            border-2 border-[var(--primary-color)]/50
            rounded-full 
            shadow-lg 
            flex items-center justify-center 
            overflow-hidden
          "
          >
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    transition: {
                      scale: {
                        duration: 0.8,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut',
                      },
                    },
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <img
                    src={logoPab}
                    alt="Carregando"
                    className="w-9 h-9 brightness-0 invert"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <Check
                    className="text-[var(--primary-color)]"
                    size={32}
                    strokeWidth={3.5}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessToast;
