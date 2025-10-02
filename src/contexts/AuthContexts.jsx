// src/contexts/AuthContexts.jsx
import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase'; // Importe do nosso arquivo firebase.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
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
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setCurrentUser({ ...user, ...userDocSnap.data() });
        } else {
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
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

  const register = async (profileData, password) => {
    const { name, email, ...restData } = profileData;
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: name,
      photoURL: '', // Inicializa photoURL
    });

    const finalProfileData = {
      name,
      email,
      ...restData,
      photoURL: '', // Garante que o campo exista no firestore
    };

    await setDoc(doc(db, 'users', user.uid), finalProfileData);

    return userCredential;
  };

  const logout = () => {
    signOut(auth).then(() => {
      navigate('/login');
    });
  };

  // NOVA FUNÇÃO: Para atualizar o usuário em toda a aplicação
  const updateCurrentUser = (newData) => {
    setCurrentUser((prevUser) => ({
      ...prevUser,
      ...newData,
    }));
  };

  const value = {
    currentUser,
    loading,
    isLoggingIn,
    login,
    register,
    logout,
    updateCurrentUser, // Exporta a nova função
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
