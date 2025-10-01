// src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db, storage } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
} from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import {
  Trash2,
  VideoOff,
  Edit,
  Share2,
  Camera,
  Calendar,
  Heart,
  Star,
  MapPin,
  Film,
  History,
} from 'lucide-react';
// A importação do EditProfileModal foi removida, pois o componente ainda não foi criado.

const ProfilePage = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [myVideos, setMyVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [activeTab, setActiveTab] = useState('fintas');
  // A lógica do modal de edição foi removida temporariamente.

  useEffect(() => {
    const fetchMyVideos = async () => {
      if (!currentUser) {
        setLoadingVideos(false);
        return;
      }

      setLoadingVideos(true);
      const videosCollection = collection(db, 'videos');
      const q = query(
        videosCollection,
        where('uid', '==', currentUser.uid),
        orderBy('createdAt', 'desc'),
      );

      const querySnapshot = await getDocs(q);
      const videosList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMyVideos(videosList);
      setLoadingVideos(false);
    };

    if (!authLoading) {
      fetchMyVideos();
    }
  }, [currentUser, authLoading]);

  const handleDeleteVideo = async (video) => {
    // A confirmação foi removida temporariamente, pois a função confirm() não é permitida.
    try {
      const videoRef = ref(storage, video.videoUrl);
      await deleteObject(videoRef);
      await deleteDoc(doc(db, 'videos', video.id));
      setMyVideos(myVideos.filter((v) => v.id !== video.id));
    } catch (error) {
      console.error('Erro ao excluir o vídeo:', error);
      // Idealmente, mostraríamos uma notificação de erro aqui.
    }
  };

  // Mock data para o histórico de partidas
  const matchHistory = [
    {
      id: 1,
      opponent: 'Leoas da Serra',
      score: 'V 2-1',
      tournament: 'Copa Bravas',
    },
    {
      id: 2,
      opponent: 'Fênix FC',
      score: 'D 0-3',
      tournament: 'Liga das Estrelas',
    },
    {
      id: 3,
      opponent: 'Guerreiras',
      score: 'E 1-1',
      tournament: 'Copa Bravas',
    },
    {
      id: 4,
      opponent: 'Titãs da Bola',
      score: 'V 4-2',
      tournament: 'Liga das Estrelas',
    },
  ];

  if (authLoading) {
    return <div className="p-8 text-white">Carregando seu perfil...</div>;
  }

  if (!currentUser) {
    return (
      <div className="p-8 text-white">
        Usuário não encontrado. Faça login para continuar.
      </div>
    );
  }

  // Verifica se userType existe e corresponde a 'jogadora'
  const isAtleta = currentUser && currentUser.userType === 'jogadora';
  const displayName = currentUser.name || currentUser.displayName;
  const initial = displayName ? displayName.charAt(0).toUpperCase() : '?';

  return (
    <div className="p-4 md:p-8 bg-[var(--bg-color)] text-gray-200 min-h-full">
      <header className="mb-6 text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Meu Perfil
        </h1>
        <p className="text-sm sm:text-md text-gray-400">
          Gerencie suas informações e conquistas
        </p>
      </header>

      {/* Seção Principal do Perfil */}
      <div className="bg-[var(--bg-color2)] rounded-lg shadow-lg p-6 flex flex-col md:flex-row items-center gap-6 mb-8">
        <div className="relative group">
          <img
            src={`https://placehold.co/128x128/b554b5/FFFFFF?text=${initial}`}
            alt={`Foto de ${displayName}`}
            className="w-32 h-32 rounded-full border-4 border-gray-600 group-hover:border-[var(--primary-color)] transition-colors"
          />
          <button className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera size={32} className="text-white" />
          </button>
        </div>

        <div className="flex-grow text-center md:text-left">
          <p className="text-sm text-gray-400">
            @{currentUser.apelido || displayName}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            {displayName}
          </h2>

          {isAtleta && (
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2 mt-2 text-gray-300">
              {currentUser.idade && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {currentUser.idade} anos
                </span>
              )}
              {currentUser.posicao && (
                <span className="flex items-center gap-1.5">
                  <Star size={14} />
                  {currentUser.posicao}
                </span>
              )}
              {currentUser.timeCoracao && (
                <span className="flex items-center gap-1.5">
                  <Heart size={14} />
                  {currentUser.timeCoracao}
                </span>
              )}
              {currentUser.cidadeEstado && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  {currentUser.cidadeEstado}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
            <Share2 size={18} />
            <span className="hidden sm:inline">Compartilhar</span>
          </button>
          <button
            // A funcionalidade de clique será adicionada quando o modal for criado.
            className="bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)] text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Edit size={18} />
            <span className="hidden sm:inline">Editar</span>
          </button>
        </div>
      </div>

      {/* Navegação e Conteúdo das Abas (só mostra para atletas) */}
      {isAtleta && (
        <>
          <div className="mb-6">
            <div className="flex justify-center md:justify-start border-b border-gray-700">
              <button
                title="Fintas"
                onClick={() => setActiveTab('fintas')}
                className={`py-3 px-6 transition-colors ${
                  activeTab === 'fintas'
                    ? 'text-[var(--primary-color)] border-b-2 border-[var(--primary-color)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Film size={24} />
              </button>
              <button
                title="Histórico de Partidas"
                onClick={() => setActiveTab('historico')}
                className={`py-3 px-6 transition-colors ${
                  activeTab === 'historico'
                    ? 'text-[var(--primary-color)] border-b-2 border-[var(--primary-color)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <History size={24} />
              </button>
            </div>
          </div>

          <div>
            {activeTab === 'fintas' && (
              <div>
                {loadingVideos ? (
                  <p>Carregando vídeos...</p>
                ) : myVideos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {myVideos.map((video) => (
                      <div
                        key={video.id}
                        className="relative group bg-gray-800 rounded-lg overflow-hidden shadow-lg"
                      >
                        <video
                          src={video.videoUrl}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 p-3 flex flex-col justify-end">
                          <p className="text-white text-sm font-semibold truncate">
                            {video.caption}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteVideo(video)}
                          className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-700 text-white p-2 rounded-full transition-opacity opacity-100 md:opacity-0 md:group-hover:opacity-100"
                          aria-label="Excluir vídeo"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-[var(--bg-color2)] rounded-lg">
                    <VideoOff
                      size={48}
                      className="mx-auto text-gray-500 mb-4"
                    />
                    <p className="text-gray-400">
                      Você ainda não postou nenhum vídeo.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'historico' && (
              <div className="space-y-3">
                {matchHistory.map((match) => (
                  <div
                    key={match.id}
                    className="bg-[var(--bg-color2)] p-4 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold text-white">
                        vs {match.opponent}
                      </p>
                      <p className="text-sm text-gray-400">
                        {match.tournament}
                      </p>
                    </div>
                    <span
                      className={`font-bold text-lg px-3 py-1 rounded-md ${
                        match.score.startsWith('V')
                          ? 'bg-green-500/20 text-green-400'
                          : match.score.startsWith('D')
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {match.score}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
