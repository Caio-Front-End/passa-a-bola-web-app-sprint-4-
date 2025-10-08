// Arquivo: src/contexts/ToastContext.jsx
import { createContext, useState, useContext } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ isVisible: false, message: '' });

  const showToast = (message) => {
    setToast({ isVisible: true, message });
  };

  const hideToast = () => {
    setToast({ isVisible: false, message: '' });
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast, toast }}>
      {children}
    </ToastContext.Provider>
  );
};
