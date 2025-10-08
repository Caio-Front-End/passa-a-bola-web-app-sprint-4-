// src/pages/FintaPage.jsx

import { useState, useEffect, useRef } from 'react';
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
  const [activeCommentSection, setActiveCommentSection] = useState({
    videoId: null,
    author: '',
  });
  const { currentUser } = useAuth();
  const [visibleVideoInfo, setVisibleVideoInfo] = useState({
    id: null,
    author: '',
  });
  const feedContainerRef = useRef(null);
  const [shouldScrollToTop, setShouldScrollToTop] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const formatVideoData = (videoDoc, usersMap) => {
    const videoData = videoDoc.data();
    const userProfile = usersMap[videoData.uid];
    const name = userProfile?.name || videoData.userName;
    const initial = name ? name.charAt(0).toUpperCase() : '?';
    const avatar =
      userProfile?.photoURL ||
      videoData.avatarUrl ||
      `https://placehold.co/40x40/b554b5/FFFFFF?text=${initial}`;
    const isLikedByUser = videoData.likedBy?.includes(currentUser.uid) || false;

    return {
      id: videoDoc.id,
      user: {
        uid: videoData.uid,
        name,
        avatar,
      },
      videoUrl: videoData.videoUrl,
      caption: videoData.caption,
      likes: videoData.likes || 0,
      comments: videoData.comments || 0,
      isInitiallyLiked: isLikedByUser,
      championshipId: videoData.championshipId || null,
    };
  };

  useEffect(() => {
    if (
      activeCommentSection.videoId &&
      visibleVideoInfo.id &&
      activeCommentSection.videoId !== visibleVideoInfo.id
    ) {
      setActiveCommentSection({
        videoId: visibleVideoInfo.id,
        author: visibleVideoInfo.author,
      });
    }
  }, [visibleVideoInfo, activeCommentSection.videoId]);

  useEffect(() => {
    const fetchVideosAndUsers = async () => {
      setLoading(true);
      try {
        const videosCollectionRef = collection(db, 'videos');
        const q = query(videosCollectionRef, orderBy('createdAt', 'desc'));
        const videosSnapshot = await getDocs(q);

        if (videosSnapshot.empty) {
          setVideos([]);
          setLoading(false);
          return;
        }

        const userIds = [
          ...new Set(
            videosSnapshot.docs.map((doc) => doc.data().uid).filter(Boolean),
          ),
        ];
        let usersMap = {};
        if (userIds.length > 0) {
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

        const formattedData = videosSnapshot.docs.map((doc) =>
          formatVideoData(doc, usersMap),
        );
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

  useEffect(() => {
    if (shouldScrollToTop && feedContainerRef.current) {
      feedContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      setShouldScrollToTop(false);
    }
  }, [shouldScrollToTop]);

  const handleOpenComments = (videoId, author) => {
    setActiveCommentSection({ videoId, author });
  };

  const handleCloseComments = () => {
    setActiveCommentSection({ videoId: null, author: '' });
  };

  const handleVideoInView = (id, author) => {
    setVisibleVideoInfo({ id, author });
  };

  const handleUploadSuccess = (newVideoData) => {
    const fullNewVideoData = {
      ...newVideoData,
      user: {
        uid: currentUser.uid,
        name: currentUser.displayName,
        avatar:
          currentUser.photoURL ||
          `https://placehold.co/40x40/b554b5/FFFFFF?text=${currentUser.displayName.charAt(
            0,
          )}`,
      },
      isInitiallyLiked: false,
    };
    setVideos((prevVideos) => [fullNewVideoData, ...prevVideos]);
    setShouldScrollToTop(true);
  };

  if (loading) {
    return (
      <div className="h-full w-full bg-black flex justify-center items-center text-white">
        Carregando FINTA...
      </div>
    );
  }

  return (
    <div className="h-dvh w-full bg-black flex justify-center items-center relative md:p-4">
      <div className="flex justify-center h-full w-full md:max-w-5xl relative">
        <button
          onClick={() => setUploadModalOpen(true)}
          className="absolute top-5 right-5 z-20 bg-[var(--primary-color)]/60 text-white w-12 h-12 hover:scale-110 transition-transform duration-200 ease-in-out rounded-full backdrop-blur-md flex items-center justify-center shadow-lg hover:bg-[var(--primary-color-hover)]/60 "
          aria-label="Postar vídeo"
        >
          <Plus size={28} strokeWidth={2.5} />
        </button>

        <div className="h-full w-full md:w-auto md:flex-shrink-0">
          <div className="h-full bg-neutral-900 md:rounded-2xl overflow-hidden md:max-w-lg mx-auto">
            <div
              ref={feedContainerRef}
              className="h-full w-full overflow-y-auto snap-y snap-mandatory"
              style={{ scrollSnapStop: 'always' }}
            >
              {videos.map((video) => (
                <VideoPost
                  key={video.id}
                  videoData={video}
                  onCommentClick={handleOpenComments}
                  onVideoInView={handleVideoInView}
                  isMuted={isMuted}
                  onToggleMute={() => setIsMuted((prev) => !prev)}
                />
              ))}
            </div>
          </div>
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
        <UploadModal
          onClose={() => setUploadModalOpen(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
};

export default FintaPage;
