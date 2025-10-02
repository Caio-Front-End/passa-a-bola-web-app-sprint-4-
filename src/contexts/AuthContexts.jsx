// src/contexts/AuthContexts.jsx
import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
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
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = { ...user, ...userDocSnap.data() };
          setCurrentUser(userData);
          // Redirecionamento Pós-Refresh
          if (window.location.pathname === '/login' || window.location.pathname === '/register') {
              if (userData.userType === 'organizador') {
                  navigate('/dashboard');
              } else {
                  navigate('/');
              }
          }
        } else {
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [navigate]);

  const login = async (email, password) => {
    setIsLoggingIn(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Busca os dados do Firestore para saber o userType
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      setTimeout(() => {
        if (userDocSnap.exists() && userDocSnap.data().userType === 'organizador') {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
        setIsLoggingIn(false);
      }, 1500);
    } catch (error) {
      setIsLoggingIn(false);
      throw error;
    }
  };

  const register = async (profileData, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, profileData.email, password);
    const user = userCredential.user;
    await updateProfile(user, { displayName: profileData.name });
    await setDoc(doc(db, "users", user.uid), profileData);
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