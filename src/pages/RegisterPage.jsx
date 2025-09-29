// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { User, Mail, Lock, Trophy, Star, Hash, MapPin, Heart } from 'lucide-react';
import SeletorAdmin from '../components/SeletorAdmin.jsx';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [apelido, setApelido] = useState('');
  const [idade, setIdade] = useState('');
  const [posicao, setPosicao] = useState('');
  const [timeCoracao, setTimeCoracao] = useState('');
  const [cidadeEstado, setCidadeEstado] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const profileData = { name, email, apelido, idade, posicao, timeCoracao, cidadeEstado };

    try {
      await register(profileData, password);
      setSuccess('Cadastro realizado com sucesso! Redirecionando...');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      // Firebase retorna erros mais detalhados, vamos tratá-los
      if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está em uso.');
      } else if (err.code === 'auth/weak-password') {
        setError('A senha deve ter pelo menos 6 caracteres.');
      } else {
        setError('Ocorreu um erro ao criar a conta.');
      }
      console.error("Erro de registro:", err);
    }
  };

  return (
    <div className="min-h-full w-full flex flex-col items-center justify-center bg-[var(--bg-color)] px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <div>
          <Trophy size={48} className="mx-auto text-[var(--primary-color)]" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Crie sua conta
          </h2>
          <SeletorAdmin />
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleRegister}>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center">{success}</p>}

          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" required placeholder="Nome completo" value={name} onChange={(e) => setName(e.target.value)} className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-600 placeholder-gray-500 text-white bg-[var(--bg-color2)] focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm" />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="email" required placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-600 placeholder-gray-500 text-white bg-[var(--bg-color2)] focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="password" required placeholder="Senha (mínimo 6 caracteres)" value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-600 placeholder-gray-500 text-white bg-[var(--bg-color2)] focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm" />
          </div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Apelido de destaque" value={apelido} onChange={(e) => setApelido(e.target.value)} className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-600 placeholder-gray-500 text-white bg-[var(--bg-color2)] focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm" />
          </div>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="number" placeholder="Idade" value={idade} onChange={(e) => setIdade(e.target.value)} className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-600 placeholder-gray-500 text-white bg-[var(--bg-color2)] focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm" />
          </div>
          <div className="relative">
            <Star className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select value={posicao} onChange={(e) => setPosicao(e.target.value)} className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-600 placeholder-gray-500 text-white bg-[var(--bg-color2)] focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm">
              <option value="" disabled>Posição favorita</option>
              <option value="goleira">Goleira</option>
              <option value="fixo">Fixo / Zagueira</option>
              <option value="ala">Ala / Lateral</option>
              <option value="pivo">Pivô / Atacante</option>
            </select>
          </div>
          <div className="relative">
            <Heart className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Time do coração" value={timeCoracao} onChange={(e) => setTimeCoracao(e.target.value)} className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-600 placeholder-gray-500 text-white bg-[var(--bg-color2)] focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm" />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Sua cidade e estado" value={cidadeEstado} onChange={(e) => setCidadeEstado(e.target.value)} className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-600 placeholder-gray-500 text-white bg-[var(--bg-color2)] focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm" />
          </div>
          <div>
            <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)]">
              Cadastrar
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-gray-400">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-medium text-[var(--primary-color)] hover:text-[var(--primary-color-hover)]">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;