import { fintaVideos } from '../data/fintaVideos.js';
import VideoPost from '../components/VideoPost';

const FintaPage = () => {
  return (
    // Em telas maiores, centralizamos o feed com uma largura máxima
    <div className="h-full w-full bg-black flex justify-center">
      <div className="h-full w-full md:max-w-md bg-neutral-900 overflow-y-auto snap-y snap-mandatory">
        {fintaVideos.map((video) => (
          <VideoPost key={video.id} videoData={video} />
        ))}
      </div>
    </div>
  );
};

export default FintaPage;
