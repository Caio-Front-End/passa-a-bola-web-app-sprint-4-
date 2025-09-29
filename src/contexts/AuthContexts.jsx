// src/contexts/AuthContexts.jsx
import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase'; // Importe do nosso arquivo firebase.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import LoadingScreen from '../components/LoadingScreen.jsx';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Se o usuário está logado, busca os dados do perfil no Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          // Combina os dados do Auth e do Firestore
          setCurrentUser({ ...user, ...userDocSnap.data() });
        } else {
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsubscribe; // Limpa a inscrição ao desmontar
  }, []);

  const login = async (email, password) => {
    setIsLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setTimeout(() => {
        navigate('/');
        setIsLoggingIn(false);
      }, 1500);
    } catch (error) {
      setIsLoggingIn(false);
      throw error;
    }
  };

  // Função de registro ATUALIZADA para receber todos os dados
  const register = async (profileData, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, profileData.email, password);
    const user = userCredential.user;

    // Atualiza o nome de exibição no perfil principal do Firebase Auth
    await updateProfile(user, { displayName: profileData.name });

    // Salva o objeto COMPLETO com todos os dados no Firestore
    // O nome do "documento" será o ID do usuário (user.uid)
    await setDoc(doc(db, "users", user.uid), {
        name: profileData.name,
        email: profileData.email,
        apelido: profileData.apelido,
        idade: profileData.idade,
        posicao: profileData.posicao,
        timeCoracao: profileData.timeCoracao,
        cidadeEstado: profileData.cidadeEstado,
    });

    return userCredential;
  };

  const logout = () => {
    signOut(auth).then(() => {
      navigate('/login');
    });
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