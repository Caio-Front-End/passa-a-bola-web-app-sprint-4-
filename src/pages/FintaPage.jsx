import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import VideoPost from '../components/VideoPost';
import UploadModal from '../components/UploadModal';
import { Plus } from 'lucide-react';

const FintaPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);

  useEffect(() => {
    const fetchVideosAndUsers = async () => {
      setLoading(true);
      try {
        // 1. Busca os vídeos ordenados por data
        const videosCollectionRef = collection(db, 'videos');
        const q = query(videosCollectionRef, orderBy('createdAt', 'desc'));
        const videosSnapshot = await getDocs(q);
        const videosList = videosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (videosList.length === 0) {
          setVideos([]);
          setLoading(false);
          return;
        }

        // 2. Coleta os IDs únicos dos usuários que postaram os vídeos
        const userIds = [
          ...new Set(videosList.map((v) => v.uid).filter(Boolean)),
        ];

        let usersMap = {};
        if (userIds.length > 0) {
          // 3. Busca os perfis dos usuários correspondentes
          const usersCollectionRef = collection(db, 'users');
          const usersQuery = query(
            usersCollectionRef,
            where('__name__', 'in', userIds),
          );
          const usersSnapshot = await getDocs(usersQuery);
          usersSnapshot.forEach((doc) => {
            usersMap[doc.id] = doc.data();
          });
        }

        // 4. Combina os dados dos vídeos com os dados de perfil atualizados
        const formattedData = videosList.map((video) => {
          const userProfile = usersMap[video.uid];
          const name = userProfile?.name || video.userName;
          const initial = name ? name.charAt(0).toUpperCase() : '?';
          // Usa a foto de perfil do usuário, se não tiver, usa a que está no vídeo, se não, usa um placeholder
          const avatar =
            userProfile?.photoURL ||
            video.avatarUrl ||
            `https://placehold.co/40x40/b554b5/FFFFFF?text=${initial}`;

          return {
            id: video.id,
            user: { name, avatar },
            videoUrl: video.videoUrl,
            caption: video.caption,
            likes: video.likes,
            comments: video.comments,
          };
        });

        setVideos(formattedData);
      } catch (error) {
        console.error('Erro ao buscar vídeos do Firestore:', error);
      }
      setLoading(false);
    };

    fetchVideosAndUsers();
  }, []);

  if (loading) {
    return (
      <div className="h-full w-full bg-black flex justify-center items-center text-white">
        Carregando FINTA...
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-black flex justify-center relative">
      <button
        onClick={() => setUploadModalOpen(true)}
        className="absolute top-5 right-5 z-10 bg-[var(--primary-color)]/60 text-white w-12 h-12 hover:scale-110 transition-transform duration-200 ease-in-out rounded-full backdrop-blur-md flex items-center justify-center shadow-lg hover:bg-[var(--primary-color-hover)]/60 "
        aria-label="Postar vídeo"
      >
        <Plus size={28} strokeWidth={2.5}/>
      </button>

      <div className="h-full w-full md:max-w-md bg-neutral-900 overflow-y-auto snap-y snap-mandatory">
        {videos.map((video) => (
          <VideoPost key={video.id} videoData={video} />
        ))}
      </div>

      {isUploadModalOpen && (
        <UploadModal onClose={() => setUploadModalOpen(false)} />
      )}
    </div>
  );
};

export default FintaPage;
