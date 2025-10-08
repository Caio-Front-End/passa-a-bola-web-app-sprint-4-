// src/components/SubscriptionModal.jsx

import { useState, useEffect } from 'react';
import ModalWrapper from './ModalWrapper.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../contexts/ToastContext.jsx'; // 1. IMPORTAR O HOOK
import { db } from '../firebase.js';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { Info, XCircle, Users } from 'lucide-react';

const SubscriptionModal = ({ championship, onClose }) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast(); // 2. INICIAR O HOOK
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('confirm'); // Mantemos a lógica de view para os outros cenários

  useEffect(() => {
    const isAlreadySubscribed = championship.participants.some(
      (p) => p.uid === currentUser.uid,
    );
    const isFull =
      championship.participants.length >=
      parseInt(championship.maxCapacity, 10);

    if (isAlreadySubscribed) setView('alreadySubscribed');
    else if (isFull) setView('full');
  }, [championship, currentUser]);

  const handleInitialSubscription = async () => {
    setError('');
    if (
      championship.access === 'privado' &&
      password !== championship.password
    ) {
      setError('Senha incorreta.');
      return;
    }

    if (championship.teamFormation === 'manual') {
      setView('select_team');
    } else {
      setLoading(true);
      try {
        const championshipRef = doc(db, 'championships', championship.id);
        await updateDoc(championshipRef, {
          participants: arrayUnion({
            uid: currentUser.uid,
            name: currentUser.displayName || currentUser.name,
          }),
        });
        showToast(); // 3. CHAMAR O TOAST
        onClose(); // 4. FECHAR O MODAL
      } catch (e) {
        console.error('Erro ao se inscrever: ', e);
        setError('Ocorreu um erro ao processar sua inscrição.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleJoinTeam = async (teamIndex) => {
    setLoading(true);
    setError('');
    try {
      const championshipRef = doc(db, 'championships', championship.id);
      const docSnap = await getDoc(championshipRef);
      if (!docSnap.exists()) {
        throw new Error('Campeonato não encontrado!');
      }

      const currentData = docSnap.data();
      const teams = currentData.teams || [];
      const teamToJoin = teams[teamIndex];
      const teamMaxCapacity =
        parseInt(championship.maxCapacity, 10) / teams.length;

      if (teamToJoin.players.length >= teamMaxCapacity) {
        setError(`O ${teamToJoin.name} já está com a capacidade máxima.`);
        setLoading(false);
        return;
      }

      const newPlayer = {
        uid: currentUser.uid,
        name: currentUser.displayName || currentUser.name,
      };

      teamToJoin.players.push(newPlayer);

      await updateDoc(championshipRef, {
        teams: teams,
        participants: arrayUnion(newPlayer),
      });

      showToast(); // 3. CHAMAR O TOAST
      onClose(); // 4. FECHAR O MODAL
    } catch (e) {
      console.error('Erro ao entrar no time: ', e);
      setError('Não foi possível entrar no time. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (view) {
      // O case 'success' foi removido, pois agora fechamos o modal
      case 'alreadySubscribed':
        return (
          <div className="text-center p-4">
            <Info size={48} className="mx-auto text-blue-500 mb-4" />
            <h3 className="text-xl font-bold text-white">
              Você já está neste campeonato!
            </h3>
            <button
              onClick={onClose}
              className="mt-4 bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              Fechar
            </button>
          </div>
        );
      case 'full':
        return (
          <div className="text-center p-4">
            <XCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-xl font-bold text-white">Vagas Esgotadas!</h3>
            <button
              onClick={onClose}
              className="mt-4 bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              Fechar
            </button>
          </div>
        );
      case 'select_team':
        return (
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">
              Escolha seu Time
            </h3>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="space-y-3">
              {championship.teams?.map((team, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-3 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold text-white">{team.name}</p>
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      <Users size={14} />
                      {team.players.length} /{' '}
                      {parseInt(championship.maxCapacity, 10) /
                        championship.teams.length}
                    </p>
                  </div>
                  <button
                    onClick={() => handleJoinTeam(index)}
                    disabled={
                      loading ||
                      team.players.length >=
                        parseInt(championship.maxCapacity, 10) /
                          championship.teams.length
                    }
                    className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Entrando...' : 'Entrar'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'confirm':
      default:
        return (
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-2">
              Confirmar Inscrição
            </h3>
            <p className="text-gray-400 mb-4">
              Deseja se inscrever em "{championship.name}"?
            </p>

            {championship.access === 'privado' && (
              <input
                type="password"
                placeholder="Senha do campeonato"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 bg-[var(--bg-color2)] rounded-md text-white mb-4"
              />
            )}

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              onClick={handleInitialSubscription}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50"
            >
              {loading ? 'Verificando...' : 'Inscrever-se'}
            </button>
          </div>
        );
    }
  };

  return (
    <ModalWrapper title="Inscrição no Campeonato" onClose={onClose}>
      {renderContent()}
    </ModalWrapper>
  );
};

export default SubscriptionModal;
