// src/components/VideoPost.jsx

import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase';
import {
  doc,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import {
  Heart,
  MessageCircle,
  Send,
  VolumeX,
  Volume2,
  Trophy,
} from 'lucide-react';
import { motion } from 'framer-motion';

const VideoPost = ({
  videoData,
  onCommentClick,
  onVideoInView,
  isMuted,
  onToggleMute,
}) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(videoData.isInitiallyLiked);
  const [likes, setLikes] = useState(videoData.likes);
  const [showVolumeIcon, setShowVolumeIcon] = useState(false);
  const videoRef = useRef(null);
  const [shouldPlay, setShouldPlay] = useState(false);

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
      { threshold: 0.7 },
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

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (shouldPlay) {
      videoElement.currentTime = 0;
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          if (error.name !== 'AbortError') {
            console.error('Erro ao tentar tocar o vídeo:', error);
          }
        });
      }
    } else {
      videoElement.pause();
    }
  }, [shouldPlay]);

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
          likedBy: arrayUnion(currentUser.uid),
        });
      } else {
        await updateDoc(videoDocRef, {
          likes: increment(-1),
          likedBy: arrayRemove(currentUser.uid),
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar o like:', error);
      setIsLiked(!newIsLiked);
      setLikes(likes);
    }
  };

  const handleOpenComments = (e) => {
    e.stopPropagation();
    onCommentClick(videoData.id, videoData.user.name);
  };

  const handleChampionshipClick = (e) => {
    e.stopPropagation();
    if (videoData.championshipId) {
      navigate('/courts', { state: { filterById: videoData.championshipId } });
    }
  };

  const handleToggleMute = (e) => {
    if (e.target.closest('.action-button') || e.target.closest('a')) {
      return;
    }
    onToggleMute();
    setShowVolumeIcon(true);
    setTimeout(() => setShowVolumeIcon(false), 800);
  };

  return (
    <div
      className="relative h-full w-full snap-start flex-shrink-0 bg-black cursor-pointer"
      onClick={handleToggleMute}
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
            {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-2 text-white bg-gradient-to-t from-black/60 to-transparent">
        <Link
          to={`/profile/${videoData.user.uid}`}
          className="flex items-center mb-2 group"
        >
          <img
            src={videoData.user.avatar}
            alt={videoData.user.name}
            className="w-10 h-10 rounded-full border-2 border-white group-hover:border-[var(--primary-color)] transition-colors"
          />
          <p className="ml-3 font-semibold group-hover:text-[var(--primary-color)] transition-colors">
            {videoData.user.name}
          </p>
        </Link>
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
              isLiked
                ? 'text-[var(--primary-color)] fill-[var(--primary-color)]'
                : 'text-white'
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
        {videoData.championshipId && (
          <motion.button
            onClick={handleChampionshipClick}
            className="flex flex-col items-center action-button"
            animate={{
              scale: [1, 1.1, 1, 1.1, 1],
              transition: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              },
            }}
          >
            <Trophy size={32} className="text-yellow-400" />
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default VideoPost;
