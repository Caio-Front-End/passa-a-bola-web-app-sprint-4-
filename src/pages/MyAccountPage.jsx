import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db, storage } from '../firebase'; // Supondo que a configuração do firebase está correta
import { collection, query, where, getDocs, doc, deleteDoc, orderBy } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import {SoccerBall, SignOut} from 'phosphor-react';
import { Trash2, VideoOff, Star, MapPin, Shield, Trophy, Calendar, ShieldCheck} from 'lucide-react';

const MyAccountPage = () => {
  const { currentUser, logout } = useAuth();
  const [myVideos, setMyVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dados de estatísticas de exemplo - você pode substituir isso por dados reais do seu banco
  const playerStats = [
    { icon: <SoccerBall size={24} className="text-[var(--primary-color)]" />, value: '12', label: 'Gols' },
    { icon: <ShieldCheck size={24} className="text-[var(--primary-color)]" />, value: '8', label: 'Assistências' },
    { icon: <Calendar size={24} className="text-[var(--primary-color)]" />, value: '25', label: 'Jogos' },
    { icon: <Trophy size={24} className="text-[var(--primary-color)]" />, value: '15', label: 'Vitórias' },
  ];

  useEffect(() => {
    const fetchMyVideos = async () => {
      if (!currentUser?.uid) {
        setLoading(false);
        return;
      }

      try {
        const videosCollection = collection(db, 'videos');
        const q = query(
          videosCollection,
          where('uid', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const videosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setMyVideos(videosList);
      } catch (error) {
        console.error("Erro ao buscar vídeos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyVideos();
  }, [currentUser]);

  const handleDeleteVideo = async (video) => {
    // Substituindo window.confirm por uma abordagem mais segura em iframes
    const userConfirmed = true; // Em um app real, use um modal de confirmação
    if (!userConfirmed) {
      return;
    }

    try {
      const videoRef = ref(storage, video.videoUrl);
      await deleteObject(videoRef);
      await deleteDoc(doc(db, 'videos', video.id));
      setMyVideos(myVideos.filter(v => v.id !== video.id));
      // Evitando 'alert' para melhor compatibilidade
      console.log('Vídeo excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir o vídeo:', error);
    }
  };
  
  return (
    <div className="min-h-full bg-[var(--bg-color)] text-gray-200">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* --- Seção de Perfil --- */}
        <header className="flex flex-col items-center text-center mb-10">
          
        <div className="w-full flex justify-end mb-6">
          <button 
            onClick={() => { logout(); }} 
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-500 transition-colors cursor-pointer bg-[var(--bg-color2)] rounded-lg"
          >
            <span>Sair</span>
            <SignOut size={18} />
          </button>
        </div>
        <img
            src={`https://placehold.co/128x128/1A202C/718096?text=PAB&font=inter`}
            alt="Foto da jogadora"
            className="w-32 h-32 rounded-full border-4 border-gray-700 object-cover mb-4 shadow-lg"
          />
          <h1 className="text-4xl font-bold text-white">{currentUser?.apelido || 'Nome de Destaque'}</h1>
          <p className="text-lg text-gray-400">{currentUser?.name || 'Nome Completo'} - { currentUser?.idade || 'Idade'} Anos </p>
          <div className="flex items-center justify-center space-x-4 mt-2 text-gray-500">
            <span className="flex items-center"><MapPin size={14} className="mr-1" /> {currentUser?.cidadeEstado || 'Local não informado'}</span>
            <span className="flex items-center"><Shield size={14} className="mr-1" /> {currentUser?.posicao || 'Posição não informada'}</span>
            <span className="flex items-center"><Star size={14} className="mr-1" /> {currentUser?.timeCoracao || 'Time do Coração não informado'}</span>
          </div>
        </header>

       

        {/* --- Seção de Estatísticas --- */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-white ">Estatísticas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {playerStats.map(stat => (
              <div key={stat.label} className="bg-[var(--bg-color2)] border-2 border-gray-200/10 p-4 rounded-xl shadow flex lg:flex-row flex-col lg:space-x-4 text-left">
                {stat.icon}
                <div className="mt-0">
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- Seção de Vídeos Postados --- */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-white text-center">Meus Vídeos</h2>
          {loading ? (
            <p className="text-center">Carregando seus vídeos...</p>
          ) : myVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myVideos.map(video => (
                <div key={video.id} className="relative group bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                  <video src={video.videoUrl} className="w-full h-48 object-cover" controls />
                  <div className="absolute inset-0 bg-black/40 p-3 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-semibold truncate">{video.caption}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteVideo(video)}
                    className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-700 text-white p-2 rounded-full transition-opacity opacity-0 group-hover:opacity-100"
                    aria-label="Excluir vídeo"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-[var(--bg-color2)] rounded-lg">
              <VideoOff size={48} className="mx-auto text-gray-500 mb-4" />
              <p className="text-gray-400">Você ainda não postou nenhum vídeo.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default MyAccountPage;
