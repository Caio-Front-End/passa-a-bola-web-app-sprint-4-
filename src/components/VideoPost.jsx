import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Send, VolumeX, Volume2 } from 'lucide-react';

const VideoPost = ({ videoData }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(videoData.likes);
  const [isMuted, setIsMuted] = useState(
    () => window.isFintaVideoMuted ?? true,
  );
  const [showVolumeIcon, setShowVolumeIcon] = useState(false);
  const videoRef = useRef(null);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        if (entry.isIntersecting) {
          const preferredMuteState = window.isFintaVideoMuted ?? true;
          if (isMuted !== preferredMuteState) {
            setIsMuted(preferredMuteState);
          }

          // AQUI: Reinicia o vídeo para o começo
          videoElement.currentTime = 0;

          videoElement
            .play()
            .catch((error) => console.log('Video play failed:', error));
        } else {
          videoElement.pause();
        }
      },
      { threshold: 0.5 },
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
  }, [isMuted]);

  const toggleMute = (e) => {
    if (e.target.closest('.like-button-container')) {
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

      <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black/60 to-transparent">
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
          className="flex flex-col items-center like-button-container"
        >
          <Heart
            size={32}
            className={`transition-all ${
              isLiked ? 'text-[#b554b5] fill-[#b554b5]' : 'text-white'
            }`}
          />
          <span className="text-xs font-semibold">{likes}</span>
        </button>
        <button className="flex flex-col items-center">
          <MessageCircle size={32} />
          <span className="text-xs font-semibold">{videoData.comments}</span>
        </button>
        <button className="flex flex-col items-center">
          <Send size={32} />
        </button>
      </div>
    </div>
  );
};

export default VideoPost;
