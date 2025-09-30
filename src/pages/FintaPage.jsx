// src/pages/FintaPage.jsx
import { useState, useEffect } from 'react';
import { db } from '../firebase'; // Importar o db do Firebase
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import VideoPost from '../components/VideoPost';
import UploadModal from '../components/UploadModal';
import { Plus } from 'lucide-react';

const FintaPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const videosCollection = collection(db, 'videos');
        const q = query(videosCollection, orderBy('createdAt', 'desc'));
        const videosSnapshot = await getDocs(q);
        const videosList = videosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Formatar os dados para o formato que o componente VideoPost espera
        const formattedData = videosList.map(video => ({
            id: video.id,
            user: { name: video.userName, avatar: video.avatarUrl },
            videoUrl: video.videoUrl,
            caption: video.caption,
            likes: video.likes,
            comments: video.comments,
        }));
        setVideos(formattedData);
      } catch (error) {
        console.error("Erro ao buscar vídeos do Firestore:", error);
      }
      setLoading(false);
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <div className="h-full w-full bg-black flex justify-center items-center text-white">Carregando FINTA...</div>;
  }

  return (
    <div className="h-full w-full bg-black flex justify-center relative">
      <button
        onClick={() => setUploadModalOpen(true)}
        className="absolute top-4 right-4 z-10 bg-[var(--primary-color)] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-[var(--primary-color-hover)]"
        aria-label="Postar vídeo"
      >
        <Plus size={28} />
      </button>

      <div className="h-full w-full md:max-w-md bg-neutral-900 overflow-y-auto snap-y snap-mandatory">
        {videos.map((video) => (
          <VideoPost key={video.id} videoData={video} />
        ))}
      </div>

      {isUploadModalOpen && <UploadModal onClose={() => setUploadModalOpen(false)} />}
    </div>
  );
};

export default FintaPage;