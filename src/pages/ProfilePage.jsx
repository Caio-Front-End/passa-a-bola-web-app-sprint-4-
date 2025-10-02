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
  updateDoc,
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
  User,
} from 'lucide-react';
import EditProfileModal from '../components/EditProfileModal';

// Componente auxiliar para o item do histórico
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
  const [myVideos, setMyVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('fintas');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Mock de dados para o histórico de partidas
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
    // Apenas busca vídeos se o usuário for uma jogadora
    if (currentUser?.userType === 'jogadora') {
      const fetchMyVideos = async () => {
        setLoading(true);
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
        setLoading(false);
      };
      fetchMyVideos();
    } else {
      // Se não for atleta, apenas para de carregar
      setLoading(false);
    }
  }, [currentUser]);

  const handleSaveProfile = async (profileData, photoFile) => {
    if (!currentUser) return;

    let photoURL = currentUser.photoURL; // Mantém a foto atual por padrão

    const updatedData = { ...profileData };

    try {
      // 1. Se uma nova foto foi enviada, faz o upload para o Storage
      if (photoFile) {
        // Define um nome de arquivo único para a foto de perfil
        // Isso garante que o caminho tenha o formato exigido pelas regras:
        // profile-pictures/{userId}/{fileName}
        const fileExtension = photoFile.name.split('.').pop();
        const fileName = `${currentUser.uid}-${Date.now()}.${fileExtension}`;

        const storageRef = ref(
          storage,
          `profile-pictures/${currentUser.uid}/${fileName}`,
        );

        await uploadBytes(storageRef, photoFile);
        photoURL = await getDownloadURL(storageRef);
        updatedData.photoURL = photoURL; // Adiciona a nova URL aos dados a serem salvos
      }

      // 2. Atualiza o documento do usuário no Firestore
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, updatedData);

      // 3. Atualiza o estado global do usuário para refletir as mudanças em toda a app
      updateCurrentUser({ ...currentUser, ...updatedData });

      alert('Perfil atualizado com sucesso!');
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Erro ao salvar o perfil:', error);
      alert('Falha ao salvar o perfil.');
    }
  };

  const handleDeleteVideo = async (video) => {
    if (!window.confirm('Tem certeza que deseja excluir este vídeo?')) return;
    try {
      // A video.videoUrl já deve ser o caminho completo do storage,
      // mas se estiver apenas o URL de download, pode haver um problema aqui.
      // Assumindo que video.videoUrl é o caminho completo do Storage ou que o Firebase SDK
      // é inteligente o suficiente para resolver a partir da URL.
      const videoRef = ref(storage, video.videoUrl);
      await deleteObject(videoRef);
      await deleteDoc(doc(db, 'videos', video.id));
      setMyVideos(myVideos.filter((v) => v.id !== video.id));
      alert('Vídeo excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir o vídeo:', error);
      alert('Ocorreu um erro ao excluir o vídeo.');
    }
  };

  if (!currentUser) {
    return (
      <div className="p-8 bg-[var(--bg-color)] text-white min-h-full">
        Carregando...
      </div>
    );
  }

  // Define isAtleta APENAS se currentUser estiver carregado
  const isAtleta = currentUser?.userType === 'jogadora';
  const displayName = currentUser.name || currentUser.displayName;
  const initial = displayName ? displayName.charAt(0).toUpperCase() : '?';

  return (
    <>
      <div className="p-4 md:p-8 bg-[var(--bg-color)] text-gray-200 min-h-full">
        <header className="mb-6 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Meu Perfil
          </h1>
          <p className="text-md text-gray-400">
            Gerencie suas informações e conquistas
          </p>
        </header>

        {isAtleta ? (
          <>
            {/* Card Principal do Perfil */}
            <div className="bg-[var(--bg-color2)] rounded-lg shadow-lg p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <div className="relative group flex-shrink-0">
                <img
                  src={
                    currentUser.photoURL ||
                    `https://placehold.co/128x128/b554b5/FFFFFF?text=${initial}`
                  }
                  alt="Foto de perfil"
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-gray-600"
                />
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera size={32} className="text-white" />
                </button>
              </div>

              <div className="flex-grow text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <h2 className="text-2xl font-bold text-white">
                    {currentUser.apelido || 'Apelido'}
                  </h2>
                  <p className="text-gray-400">({displayName})</p>
                </div>

                <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 text-sm text-gray-300">
                  {currentUser.idade && (
                    <div className="flex items-center gap-1.5">
                      <Cake size={16} />
                      <span>{currentUser.idade} anos</span>
                    </div>
                  )}
                  {currentUser.posicao && (
                    <div className="flex items-center gap-1.5">
                      <Shield size={16} />
                      <span>{currentUser.posicao}</span>
                    </div>
                  )}
                  {currentUser.timeCoracao && (
                    <div className="flex items-center gap-1.5">
                      <Heart size={16} />
                      <span>{currentUser.timeCoracao}</span>
                    </div>
                  )}
                  {currentUser.cidadeEstado && (
                    <div className="flex items-center gap-1.5">
                      <MapPin size={16} />
                      <span>{currentUser.cidadeEstado}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-4 md:mt-0">
                <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
                  <Share2 size={18} />
                  <span className="hidden sm:inline">Compartilhar</span>
                </button>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)] text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Edit size={18} />
                  <span>Editar</span>
                </button>
              </div>
            </div>

            {/* Abas */}
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
                          <button
                            onClick={() => handleDeleteVideo(video)}
                            className="absolute top-1.5 right-1.5 bg-red-600/70 hover:bg-red-700 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={14} />
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
                  ))}

                {activeTab === 'historico' && (
                  <div className="space-y-3">
                    {historicoPartidas.map((partida) => (
                      <MatchHistoryItem key={partida.id} partida={partida} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-[var(--bg-color2)] rounded-lg">
            <User size={48} className="mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400">
              Este é um perfil de Organizador. As ferramentas de gestão estarão
              disponíveis em breve.
            </p>
          </div>
        )}
      </div>

      {isEditModalOpen && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentUser={currentUser}
          onSave={handleSaveProfile}
        />
      )}
    </>
  );
};

export default ProfilePage;
