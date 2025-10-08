// src/pages/ProfilePage.jsx

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import { db, storage } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  updateDoc,
  getDoc,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import {
  Share2,
  Edit,
  Camera,
  Trash2,
  VideoOff,
  Cake,
  MapPin,
  Heart,
  Shield,
  Film,
  History,
} from 'lucide-react';
import EditProfileModal from '../components/EditProfileModal';
import StatsDashboard from '../components/StatsDashboard';
import PlayerRadarChart from '../components/PlayerRadarChart';
import AddMatchModal from '../components/AddMatchModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { userMatches } from '../data/mockStats';

const MatchHistoryItem = ({ partida }) => {
  const [golsCasa, golsFora] = partida.placar.split('x').map(Number);
  let resultado = 'E';
  let cor = 'bg-gray-500';

  if (golsCasa > golsFora) {
    resultado = 'V';
    cor = 'bg-green-500';
  } else if (golsFora > golsCasa) {
    resultado = 'D';
    cor = 'bg-red-500';
  }

  return (
    <div className="flex items-center justify-between p-3 bg-[var(--bg-color2)] rounded-lg shadow-md">
      <div className="text-left">
        <p className="font-semibold text-white">{partida.campeonato}</p>
        <p className="text-xs text-gray-400">{partida.fase}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="bg-black/20 px-4 py-1 rounded-md">
          <p className="font-bold text-lg text-white">{partida.placar}</p>
        </div>
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-sm ${cor}`}
        >
          {resultado}
        </div>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const { currentUser, updateCurrentUser } = useAuth();
  const { showToast } = useToast();
  const { userId } = useParams();

  const [profileUser, setProfileUser] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [myVideos, setMyVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('fintas');
  const [isEditModalOpen, setIsEditModal] = useState(false);
  const [matches, setMatches] = useState(userMatches);
  const [isAddMatchModalOpen, setIsAddMatchModalOpen] = useState(false);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);

  const radarData = [
    { subject: 'Ataque', A: 90, fullMark: 100 },
    { subject: 'Passe', A: 80, fullMark: 100 },
    { subject: 'Drible', A: 75, fullMark: 100 },
    { subject: 'Físico', A: 65, fullMark: 100 },
    { subject: 'Defesa', A: 40, fullMark: 100 },
  ];

  const historicoPartidas = [
    { id: 1, placar: '2x1', campeonato: 'Liga das Campeãs', fase: 'Final' },
    { id: 2, placar: '3x3', campeonato: 'Liga das Campeãs', fase: 'Semifinal' },
    {
      id: 3,
      placar: '1x0',
      campeonato: 'Passa a Bola',
      fase: 'Quartas de Finais',
    },
    {
      id: 4,
      placar: '1x2',
      campeonato: 'Passa a Bola',
      fase: 'Oitavas de Finais',
    },
  ];

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      const targetUserId = userId || currentUser.uid;

      setIsOwnProfile(targetUserId === currentUser.uid);

      try {
        const userDocRef = doc(db, 'users', targetUserId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setProfileUser({ uid: userDocSnap.id, ...userDocSnap.data() });
        } else {
          console.error('Usuário não encontrado no Firestore!');
          setProfileUser(null);
        }

        const videosCollection = collection(db, 'videos');
        const q = query(
          videosCollection,
          where('uid', '==', targetUserId),
          orderBy('createdAt', 'desc'),
        );
        const querySnapshot = await getDocs(q);
        const videosList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMyVideos(videosList);
      } catch (error) {
        console.error('Erro ao buscar dados do perfil:', error);
        setProfileUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchProfileData();
    } else {
      setLoading(false);
      setProfileUser(null);
    }
  }, [userId, currentUser]);

  const handleSaveProfile = async (profileData, photoFile) => {
    if (!currentUser) return;
    let photoURL = currentUser.photoURL;
    const updatedData = { ...profileData };

    try {
      if (photoFile) {
        const fileExtension = photoFile.name.split('.').pop();
        const fileName = `${currentUser.uid}-${Date.now()}.${fileExtension}`;
        const storageRef = ref(
          storage,
          `profile-pictures/${currentUser.uid}/${fileName}`,
        );
        await uploadBytes(storageRef, photoFile);
        photoURL = await getDownloadURL(storageRef);
        updatedData.photoURL = photoURL;
      }
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, updatedData);
      updateCurrentUser({ ...currentUser, ...updatedData });

      showToast();
      setIsEditModal(false);
    } catch (error) {
      console.error('Erro ao salvar o perfil:', error);
    }
  };

  const promptDeleteVideo = (video) => {
    setVideoToDelete(video);
    setIsConfirmModalOpen(true);
  };

  const confirmDeleteVideo = async () => {
    if (!videoToDelete) return;

    try {
      const videoRef = ref(
        storage,
        videoToDelete.filePath || videoToDelete.videoUrl,
      );
      await deleteObject(videoRef);
      await deleteDoc(doc(db, 'videos', videoToDelete.id));

      setMyVideos(myVideos.filter((v) => v.id !== videoToDelete.id));
      console.log('Vídeo excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir o vídeo:', error);
      alert(
        'Não foi possível excluir o vídeo. Verifique o console para mais detalhes.',
      );
    } finally {
      setIsConfirmModalOpen(false);
      setVideoToDelete(null);
    }
  };

  const handleAddMatch = (matchData) => {
    const newMatch = {
      id: `m${matches.length + 1}`,
      date: new Date().toLocaleDateString(),
      ...matchData,
      stats: {
        yellowCard: matchData.yellowCard,
        redCard: matchData.redCard,
        mvp: matchData.mvp,
      },
    };
    setMatches([newMatch, ...matches]);
  };

  if (loading) {
    return (
      <div className="p-8 bg-[var(--bg-color)] text-white min-h-full flex justify-center items-center">
        <p>Carregando perfil...</p>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="p-8 bg-[var(--bg-color)] text-white min-h-full flex flex-col justify-center items-center text-center gap-4">
        <h1 className="text-2xl font-bold">Usuário Não Encontrado</h1>
        <p className="text-gray-400">
          O perfil que você está tentando acessar não existe ou foi removido.
        </p>
      </div>
    );
  }

  const displayName = profileUser.name || profileUser.displayName;
  const initial = displayName ? displayName.charAt(0).toUpperCase() : '?';

  return (
    <>
      <div className="p-4 pb-34 md:p-8 bg-[var(--bg-color)] text-gray-200 min-h-full">
        <header className="mb-6 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {isOwnProfile ? 'Meu Perfil' : `Perfil de ${displayName}`}
          </h1>
          {isOwnProfile && (
            <p className="text-md text-gray-400">
              Gerencie suas informações e conquistas
            </p>
          )}
        </header>

        <div className="bg-[var(--bg-color2)] rounded-lg shadow-lg p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <div className="relative group flex-shrink-0">
            <img
              src={
                profileUser.photoURL ||
                `https://placehold.co/128x128/b554b5/FFFFFF?text=${initial}`
              }
              alt="Foto de perfil"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-gray-600"
            />
            {isOwnProfile && (
              <button
                onClick={() => setIsEditModal(true)}
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera size={32} className="text-white" />
              </button>
            )}
          </div>

          <div className="flex-grow text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 justify-center md:justify-start">
              <h2 className="text-2xl font-bold text-white">
                {profileUser.apelido || 'Apelido'}
              </h2>
              <p className="text-gray-400">({displayName})</p>
            </div>
            <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 text-sm text-gray-300">
              {profileUser.idade && (
                <div className="flex items-center gap-1.5">
                  <Cake size={16} />
                  <span>{profileUser.idade} anos</span>
                </div>
              )}
              {profileUser.posicao && (
                <div className="flex items-center gap-1.5">
                  <Shield size={16} />
                  <span>{profileUser.posicao}</span>
                </div>
              )}
              {profileUser.timeCoracao && (
                <div className="flex items-center gap-1.5">
                  <Heart size={16} />
                  <span>{profileUser.timeCoracao}</span>
                </div>
              )}
              {profileUser.cidadeEstado && (
                <div className="flex items-center gap-1.5">
                  <MapPin size={16} />
                  <span>{profileUser.cidadeEstado}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-4 md:mt-0">
            <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
              <Share2 size={18} />
              <span className="hidden sm:inline">Compartilhar</span>
            </button>
            {isOwnProfile && (
              <button
                onClick={() => setIsEditModal(true)}
                className="bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)] text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Edit size={18} />
                <span>Editar</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-8">
          <div className="flex justify-center border-b border-gray-700">
            <button
              onClick={() => setActiveTab('fintas')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'fintas'
                  ? 'text-[var(--primary-color)] border-b-2 border-[var(--primary-color)]'
                  : 'text-gray-400'
              }`}
            >
              <Film size={24} />
            </button>
            <button
              onClick={() => setActiveTab('historico')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'historico'
                  ? 'text-[var(--primary-color)] border-b-2 border-[var(--primary-color)]'
                  : 'text-gray-400'
              }`}
            >
              <History size={24} />
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'stats'
                  ? 'text-[var(--primary-color)] border-b-2 border-[var(--primary-color)]'
                  : 'text-gray-400'
              }`}
            >
              <Shield size={24} />
            </button>
          </div>

          <div className="mt-6">
            {activeTab === 'fintas' &&
              (loading ? (
                <p>Carregando vídeos...</p>
              ) : myVideos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
                  {myVideos.map((video) => (
                    <div
                      key={video.id}
                      className="relative group bg-gray-800 rounded-lg overflow-hidden shadow-lg aspect-w-9 aspect-h-16"
                    >
                      <video
                        src={video.videoUrl}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-end p-2">
                        <p className="text-white text-xs font-semibold truncate">
                          {video.caption}
                        </p>
                      </div>
                      {isOwnProfile && (
                        <button
                          onClick={() => promptDeleteVideo(video)}
                          className="absolute top-1.5 right-1.5 bg-red-600/70 hover:bg-red-700 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-[var(--bg-color2)] rounded-lg">
                  <VideoOff size={48} className="mx-auto text-gray-500 mb-4" />
                  <p className="text-gray-400">Nenhum vídeo postado ainda.</p>
                </div>
              ))}

            {activeTab === 'historico' && (
              <div className="space-y-3">
                {historicoPartidas.map((partida) => (
                  <MatchHistoryItem key={partida.id} partida={partida} />
                ))}
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">Estatísticas</h3>
                  {isOwnProfile && (
                    <button
                      onClick={() => setIsAddMatchModalOpen(true)}
                      className="bg-[var(--primary-color)] hover:bg-opacity-80 text-white font-bold py-2 px-4 rounded-lg"
                    >
                      Adicionar Partida
                    </button>
                  )}
                </div>

                <StatsDashboard matches={matches} />

                <div className="bg-[var(--bg-color2)] p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-white mb-4">
                    Desempenho por Habilidade
                  </h4>
                  <PlayerRadarChart data={radarData} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isOwnProfile && isEditModalOpen && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModal(false)}
          currentUser={currentUser}
          onSave={handleSaveProfile}
        />
      )}

      {isOwnProfile && isAddMatchModalOpen && (
        <AddMatchModal
          isOpen={isAddMatchModalOpen}
          onClose={() => setIsAddMatchModalOpen(false)}
          onMatchSubmit={handleAddMatch}
        />
      )}

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDeleteVideo}
        title="Confirmar Exclusão"
        message="Tem certeza que quer excluir este vídeo? Esta ação não pode ser desfeita."
      />
    </>
  );
};

export default ProfilePage;
