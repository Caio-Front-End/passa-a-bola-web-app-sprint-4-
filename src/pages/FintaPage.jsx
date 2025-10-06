import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import VideoPost from '../components/VideoPost';
import UploadModal from '../components/UploadModal';
import CommentSection from '../components/CommentSection';
import { Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const FintaPage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [activeCommentSection, setActiveCommentSection] = useState({ videoId: null, author: '' });
  const { currentUser } = useAuth();
  const [visibleVideoInfo, setVisibleVideoInfo] = useState({ id: null, author: '' });

  useEffect(() => {
    if (activeCommentSection.videoId && visibleVideoInfo.id && activeCommentSection.videoId !== visibleVideoInfo.id) {
      setActiveCommentSection({ videoId: visibleVideoInfo.id, author: visibleVideoInfo.author });
    }
  }, [visibleVideoInfo, activeCommentSection.videoId]);

  useEffect(() => {
    const fetchVideosAndUsers = async () => {
      setLoading(true);
      try {
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

        const userIds = [...new Set(videosList.map((v) => v.uid).filter(Boolean))];
        let usersMap = {};
        if (userIds.length > 0) {
          const usersCollectionRef = collection(db, 'users');
          const usersQuery = query(usersCollectionRef, where('__name__', 'in', userIds));
          const usersSnapshot = await getDocs(usersQuery);
          usersSnapshot.forEach((doc) => {
            usersMap[doc.id] = doc.data();
          });
        }

        const formattedData = videosList.map((video) => {
          const userProfile = usersMap[video.uid];
          const name = userProfile?.name || video.userName;
          const initial = name ? name.charAt(0).toUpperCase() : '?';
          const avatar =
            userProfile?.photoURL ||
            video.avatarUrl ||
            `https://placehold.co/40x40/b554b5/FFFFFF?text=${initial}`;
          const isLikedByUser = video.likedBy?.includes(currentUser.uid) || false;

          return {
            id: video.id,
            user: { name, avatar },
            videoUrl: video.videoUrl,
            caption: video.caption,
            likes: video.likes || 0,
            comments: video.comments || 0,
            isInitiallyLiked: isLikedByUser,
          };
        });
        setVideos(formattedData);
      } catch (error) {
        console.error('Erro ao buscar vídeos do Firestore:', error);
      }
      setLoading(false);
    };

    if (currentUser) {
      fetchVideosAndUsers();
    }
  }, [currentUser]);

  const handleOpenComments = (videoId, author) => {
    setActiveCommentSection({ videoId, author });
  };

  const handleCloseComments = () => {
    setActiveCommentSection({ videoId: null, author: '' });
  };

  const handleVideoInView = (id, author) => {
    setVisibleVideoInfo({ id, author });
  };

  if (loading) {
    return (
      <div className="h-full w-full bg-black flex justify-center items-center text-white">
        Carregando FINTA...
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-black flex justify-center items-center relative overflow-hidden p-4">
      <motion.button
        onClick={() => setUploadModalOpen(true)}
        className="absolute top-5 md:top-9 z-20 bg-[var(--primary-color)]/60 text-white w-12 h-12 hover:scale-110 transition-transform duration-200 ease-in-out rounded-full backdrop-blur-md flex items-center justify-center shadow-lg hover:bg-[var(--primary-color-hover)]/60 "
        aria-label="Postar vídeo"
        animate={{
          right: activeCommentSection.videoId ? 'calc(40% + 1.25rem)' : '1.25rem'
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      />

      <div className="flex justify-center h-full w-full md:max-w-4xl">
        <div className="h-full w-full md:w-auto md:flex-shrink-0">
          <motion.div
            // --- ALTERAÇÃO AQUI: De 'md:max-w-sm' para 'md:max-w-md' ---
            className="h-full bg-neutral-900 md:rounded-2xl overflow-hidden md:max-w-md mx-auto"
            animate={{ width: activeCommentSection.videoId ? '100%' : '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="h-full w-full overflow-y-auto snap-y snap-mandatory">
              {videos.map((video) => (
                <VideoPost
                  key={video.id}
                  videoData={video}
                  onCommentClick={handleOpenComments}
                  onVideoInView={handleVideoInView}
                />
              ))}
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {activeCommentSection.videoId && (
            <>
              <motion.div
                className="hidden md:block h-full w-[40%]"
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <CommentSection
                  videoId={activeCommentSection.videoId}
                  videoAuthor={activeCommentSection.author}
                  onClose={handleCloseComments}
                />
              </motion.div>
              <div className="md:hidden fixed inset-0 z-30">
                <motion.div
                  className="absolute inset-0 bg-black/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={handleCloseComments}
                />
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[60%]"
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                >
                  <CommentSection
                    videoId={activeCommentSection.videoId}
                    videoAuthor={activeCommentSection.author}
                    onClose={handleCloseComments}
                  />
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>

      {isUploadModalOpen && (
        <UploadModal onClose={() => setUploadModalOpen(false)} />
      )}
    </div>
  );
};

export default FintaPage;