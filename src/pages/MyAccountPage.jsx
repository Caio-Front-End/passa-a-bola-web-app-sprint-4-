// src/pages/MyAccountPage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db, storage } from '../firebase';
import { collection, query, where, getDocs, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { Trash2, VideoOff } from 'lucide-react';

const MyAccountPage = () => {
  const { currentUser } = useAuth();
  const [myVideos, setMyVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyVideos = async () => {
      if (!currentUser) return;

      setLoading(true);
      const videosCollection = collection(db, 'videos');
      const q = query(videosCollection, where("uid", "==", currentUser.uid), orderBy('createdAt', 'desc'));
      
      const querySnapshot = await getDocs(q);
      const videosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setMyVideos(videosList);
      setLoading(false);
    };

    fetchMyVideos();
  }, [currentUser]);

  const handleDeleteVideo = async (video) => {
    if (!window.confirm('Tem certeza que deseja excluir este vídeo? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      // 1. Apagar o arquivo do Firebase Storage
      const videoRef = ref(storage, video.videoUrl);
      await deleteObject(videoRef);

      // 2. Apagar o documento do Firestore
      await deleteDoc(doc(db, 'videos', video.id));

      // 3. Atualizar a lista de vídeos na tela
      setMyVideos(myVideos.filter(v => v.id !== video.id));
      alert('Vídeo excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir o vídeo:', error);
      alert('Ocorreu um erro ao excluir o vídeo.');
    }
  };

  if (loading) {
    return <div className="p-8 text-white">Carregando seus vídeos...</div>;
  }
  
  return (
    <div className="p-4 md:p-8 bg-[var(--bg-color)] text-gray-200 min-h-full">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-white">Minha Conta</h1>
        <p className="text-md text-gray-400">Gerencie seus vídeos, {currentUser.displayName}</p>
      </header>
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-white">Meus Vídeos Postados</h2>
        {myVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {myVideos.map(video => (
              <div key={video.id} className="relative group bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <video src={video.videoUrl} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-black/40 p-3 flex flex-col justify-end">
                  <p className="text-white text-sm font-semibold truncate">{video.caption}</p>
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
            <VideoOff size={48} className="mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400">Você ainda não postou nenhum vídeo.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAccountPage;