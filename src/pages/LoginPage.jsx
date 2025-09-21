import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { Mail, Lock, Trophy } from 'lucide-react';
import logoPabOriginal from '../assets/img/logo-pab-original.png';

import { IntroScreen } from '../components/IntroScreen.jsx';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoggingIn } = useAuth();
  const [showIntro, setShowIntro] = useState(true);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      // A navegação agora é controlada pelo AuthContext
    } catch (err) {
      setError(err.message);
    }
  };

  if (showIntro) {
    return <IntroScreen onFinish={() => setShowIntro(false)} />;
  }

  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-white dark:bg-gray-900 px-4">
      <div className="w-full max-w-md space-y-8">
        <div>
          <img
            src={logoPabOriginal}
            alt="Logo da Aplicação"
            className="mx-auto w-22 h-22 sm:w-26 sm:h-26 transition-all duration-300 dark:brightness-0 dark:invert"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Acesse sua conta
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="email"
                required
                className="appearance-none rounded-t-md relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-[#b554b5] focus:border-[#b554b5] sm:text-sm"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoggingIn} // Desabilita durante o login
              />
            </div>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="password"
                required
                className="appearance-none rounded-b-md relative block w-full px-3 py-3 pl-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-[#b554b5] focus:border-[#b554b5] sm:text-sm"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoggingIn} // Desabilita durante o login
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#b554b5] hover:bg-[#d44b84] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b554b5] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoggingIn} // Desabilita durante o login
            >
              {isLoggingIn ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Não tem uma conta?{' '}
          <Link
            to="/register"
            className="font-medium text-[#b554b5] hover:text-[#d44b84]"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
