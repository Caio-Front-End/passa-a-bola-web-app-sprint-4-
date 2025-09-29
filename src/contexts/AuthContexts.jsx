import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen'; 

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
      console.error('Falha ao analisar o usuário do localStorage', error);
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

        setTimeout(() => {
          navigate('/');
          setIsLoggingIn(false);
          resolve(user);
        }, 2500);
      } else {
        setIsLoggingIn(false);
        reject(new Error('E-mail ou senha inválidos.'));
      }
    });
  };

  // Objeto `userData` com todos os dados.
  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Verifica se o email já existe usando o email do objeto userData
    if (users.find((u) => u.email === userData.email)) {
      return { success: false, message: 'Este e-mail já está em uso.' };
    }
    
    // Adiciona o objeto completo do novo usuário ao array
    users.push(userData);
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

  if (isLoggingIn) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
