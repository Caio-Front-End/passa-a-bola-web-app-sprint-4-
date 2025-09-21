import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const ProtectedRoute = () => {
  const { currentUser, loading } = useAuth();

  // Enquanto verifica o usuário, não renderiza nada para evitar um "flash" da tela de login
  if (loading) {
    return null; // Ou um componente de spinner/loading
  }

  // Se não estiver carregando e não houver usuário, redireciona para o login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Se houver um usuário, renderiza o conteúdo da rota (o <Layout /> no nosso caso)
  return <Outlet />;
};

export default ProtectedRoute;
