import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { User, Mail, Lock, Trophy } from 'lucide-react';
import SeletorAdmin from '../components/SeletorAdmin.jsx';


const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // A função register agora vem do nosso contexto global
    const result = register(name, email, password);

    if (result.success) {
      setSuccess(result.message);
      // Redireciona para o login após 1 segundo
      setTimeout(() => navigate('/login'), 1000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-full w-full flex flex-col items-center justify-center bg-[var(--bg-color)] px-4">
      <div className="w-full max-w-md space-y-8">
        <div>
          <Trophy size={48} className="mx-auto text-[var(--primary-color)]" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Crie sua conta
          </h2>
          <SeletorAdmin />
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && (
            <p className="text-green-500 text-sm text-center">{success}</p>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                required
                className="appearance-none rounded-t-md relative block w-full px-3 py-3 pl-10 border border-gray-600 placeholder-gray-500 text-white bg-[var(--bg-color2)] focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm"
                placeholder="Nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-600 placeholder-gray-500 text-white bg-[var(--bg-color2)] focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                className="appearance-none rounded-b-md relative block w-full px-3 py-3 pl-10 border border-gray-600 placeholder-gray-500 text-white bg-[var(--bg-color2)] focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)]"
            >
              Cadastrar
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-400">
          Já tem uma conta?{' '}
          {/* A navegação agora é feita com o componente Link */}
          <Link
            to="/login"
            className="font-medium text-[var(--primary-color)] hover:text-[var(--primary-color-hover)]"
          >
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
