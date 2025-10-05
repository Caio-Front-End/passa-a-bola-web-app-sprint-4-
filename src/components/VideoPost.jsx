import { useState, useRef, useEffect } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { Heart, MessageCircle, Send, VolumeX, Volume2 } from 'lucide-react';

const VideoPost = ({ videoData, onCommentClick, onVideoInView }) => {
  const { currentUser } = useAuth();
  const [isLiked, setIsLiked] = useState(videoData.isInitiallyLiked);
  const [likes, setLikes] = useState(videoData.likes);
  const [isMuted, setIsMuted] = useState(() => window.isFintaVideoMuted ?? true);
  const [showVolumeIcon, setShowVolumeIcon] = useState(false);
  const videoRef = useRef(null);

  // --- CORREÇÃO PRINCIPAL: Abordagem baseada em estado ---
  const [shouldPlay, setShouldPlay] = useState(false);

  // Este useEffect observa o vídeo e apenas atualiza o estado 'shouldPlay'
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldPlay(true);
          onVideoInView(videoData.id, videoData.user.name);
        } else {
          setShouldPlay(false);
        }
      },
      { threshold: 0.7 }
    );

    const currentVideoRef = videoRef.current;
    if (currentVideoRef) {
      observer.observe(currentVideoRef);
    }

    return () => {
      if (currentVideoRef) {
        observer.unobserve(currentVideoRef);
      }
    };
  }, [videoData.id, videoData.user.name, onVideoInView]);

  // Este useEffect reage ao estado 'shouldPlay' para controlar o vídeo
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (shouldPlay) {
      videoElement.currentTime = 0;
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Ignora o erro normal de abortar o play com scroll rápido
          if (error.name !== 'AbortError') {
            console.error("Erro ao tentar tocar o vídeo:", error);
          }
        });
      }
    } else {
      videoElement.pause();
    }
  }, [shouldPlay]); // Depende apenas do estado 'shouldPlay'

  // O restante das funções permanece igual
  const handleLike = async (e) => {
    e.stopPropagation();
    if (!currentUser) return;

    const videoDocRef = doc(db, 'videos', videoData.id);
    const newIsLiked = !isLiked;

    setIsLiked(newIsLiked);
    setLikes(newIsLiked ? likes + 1 : likes - 1);

    try {
      if (newIsLiked) {
        await updateDoc(videoDocRef, {
          likes: increment(1),
          likedBy: arrayUnion(currentUser.uid)
        });
      } else {
        await updateDoc(videoDocRef, {
          likes: increment(-1),
          likedBy: arrayRemove(currentUser.uid)
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar o like:", error);
      setIsLiked(!newIsLiked);
      setLikes(likes);
    }
  };

  const handleOpenComments = (e) => {
    e.stopPropagation();
    onCommentClick(videoData.id, videoData.user.name);
  };

  const toggleMute = (e) => {
    if (e.target.closest('.action-button')) {
      return;
    }

    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    window.isFintaVideoMuted = newMutedState;
    setShowVolumeIcon(true);
    setTimeout(() => setShowVolumeIcon(false), 800);
  };

  return (
    <div
      className="relative h-full w-full snap-start flex-shrink-0 bg-black cursor-pointer"
      onClick={toggleMute}
    >
      <video
        ref={videoRef}
        src={videoData.videoUrl}
        loop
        playsInline
        muted={isMuted}
        className="h-full w-full object-cover"
      ></video>

      {showVolumeIcon && (
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
          <div className="bg-black/50 p-4 rounded-full">
            {isMuted ? (
              <VolumeX size={28} className="text-white" />
            ) : (
              <Volume2 size={28} className="text-white" />
            )}
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-2 text-white bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center mb-2">
          <img
            src={videoData.user.avatar}
            alt={videoData.user.name}
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <p className="ml-3 font-semibold">{videoData.user.name}</p>
        </div>
        <p className="text-sm">{videoData.caption}</p>
      </div>

      <div className="absolute right-2 bottom-24 flex flex-col items-center space-y-4 text-white">
        <button
          onClick={handleLike}
          className="flex flex-col items-center action-button"
        >
          <Heart
            size={32}
            className={`transition-all ${
              isLiked ? 'text-[var(--primary-color)] fill-[var(--primary-color)]' : 'text-white'
            }`}
          />
          <span className="text-xs font-semibold">{likes}</span>
        </button>
        <button
          onClick={handleOpenComments}
          className="flex flex-col items-center action-button"
        >
          <MessageCircle size={32} />
          <span className="text-xs font-semibold">{videoData.comments}</span>
        </button>
        <button className="flex flex-col items-center action-button">
          <Send size={32} />
        </button>
      </div>
    </div>
  );
};

export default VideoPost;