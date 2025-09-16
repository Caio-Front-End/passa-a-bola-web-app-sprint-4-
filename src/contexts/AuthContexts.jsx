import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen.jsx';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const user = localStorage.getItem('currentUser');
      if (user) {
        setCurrentUser(JSON.parse(user));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('currentUser');
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setIsLoggingIn(true);
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(
        (u) => u.email === email && u.password === password,
      );

      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);

        // 4. Simula o carregamento e depois navega
        setTimeout(() => {
          navigate('/');
          // Desativa o carregamento
          setIsLoggingIn(false);
          resolve(user);
          // Duração
        }, 2500);
      } else {
        setIsLoggingIn(false);
        reject(new Error('E-mail ou senha inválidos.'));
      }
    });
  };

  const register = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find((u) => u.email === email)) {
      return { success: false, message: 'Este e-mail já está em uso.' };
    }
    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return { success: true, message: 'Cadastro realizado com sucesso!' };
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    navigate('/login');
  };

  const value = {
    currentUser,
    loading,
    isLoggingIn,
    login,
    register,
    logout,
  };

  //Se estiver carregando, mostra a tela de carregamento
  if (isLoggingIn) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
