import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Lock, Trophy, Star, Calendar, Shield, Users, MapPin, ChevronDown } from 'lucide-react';
import SeletorAdmin from '../components/SeletorAdmin';

const RegisterPage = () => {
  // Estados para os campos do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState('');
  const [favoritePosition, setFavoritePosition] = useState('');
  const [favoriteTeam, setFavoriteTeam] = useState('');
  const [location, setLocation] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Cria um objeto com os dados do usuário
    const userData = {
      name,
      email,
      password,
      nickname,
      age: Number(age), // Garante que a idade seja um número
      favoritePosition,
      favoriteTeam,
      location,
    };

    // A função register do contexto agora deve aceitar um objeto com os dados
    const result = register(userData);

    if (result.success) {
      setSuccess(result.message);
      // Redireciona para o login após 1 segundo
      setTimeout(() => navigate('/login'), 1000);
    } else {
      setError(result.message);
    }
  };

  const positions = ['Atacante', 'Meia', 'Defensora', 'Goleira'];

  return (
    <div className="min-h-full w-full flex flex-col items-center justify-center bg-[var(--bg-color)] px-4 py-12">
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
            {/* Input Nome */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                required
                className="appearance-none rounded-t-md relative block w-full px-3 py-3 pl-10 border border-gray-600 placeholder-gray-500 text-white bg-[var(--bg-color2)] focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm"
                placeholder="Nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
             {/* Input Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-600 placeholder-gray-500 text-white bg-[var(--bg-color2)] focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
             {/* Input Senha */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-600 placeholder-gray-500 text-white bg-[var(--bg-color2)] focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
             {/* Input Nickname */}
            <div className="relative">
              <Star className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-600 placeholder-gray-500 text-white bg-[var(--bg-color2)] focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm"
                placeholder="Apelido de destaque"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>
            {/* Input Idade */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="number"
                min="1" // Limite mínimo para a idade
                required
                className="relative block w-full px-3 py-3 pl-10 border border-gray-600 placeholder-gray-500 text-white bg-[var(--bg-color2)] focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="Idade"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            {/* Seletor de Posição Favorita */}
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <select
                required
                value={favoritePosition}
                onChange={(e) => setFavoritePosition(e.target.value)}
                className={`appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-600 bg-[var(--bg-color2)] focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm ${
                  favoritePosition ? 'text-white' : 'text-gray-500'
                }`}
              >
                <option value="" disabled>Posição favorita</option>
                {positions.map((pos) => (
                  <option key={pos} value={pos} className="text-white">
                    {pos}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>
            {/* Input Time Favorito */}
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-600 placeholder-gray-500 text-white bg-[var(--bg-color2)] focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm"
                placeholder="Time do coração"
                value={favoriteTeam}
                onChange={(e) => setFavoriteTeam(e.target.value)}
              />
            </div>
            {/* Input Localização */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                required
                className="appearance-none rounded-b-md relative block w-full px-3 py-3 pl-10 border border-gray-600 placeholder-gray-500 text-white bg-[var(--bg-color2)] focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm"
                placeholder="Sua cidade e estado"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
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

