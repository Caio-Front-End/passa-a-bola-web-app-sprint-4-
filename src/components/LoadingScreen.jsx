import logoPab from '../assets/img/logo-pab.png';

const LoadingScreen = () => {
  return (
    <>
      {/* CSS para a animação de rotação reversa */}
      <style>{`
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-reverse {
          animation: spin-reverse 1.2s linear infinite;
        }
      `}</style>
      <div className="w-full h-screen flex flex-col items-center justify-center bg-white dark:bg-[var(--bg-color)] font-sans">
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Círculo rosa externo, gira em sentido horário */}
          <div className="absolute w-full h-full rounded-full border-4 border-transparent border-t-[var(--primary-color)] animate-spin"></div>

          {/* Círculo branco interno, gira em sentido anti-horário */}
          <div className="absolute w-[calc(100%-20px)] h-[calc(100%-20px)] rounded-full border-4 border-transparent border-t-black dark:border-t-white/80 animate-spin-reverse"></div>

          {/* logo */}
          <img
            src={logoPab}
            alt="Logo da aplicação"
            // Tamanho base para mobile
            className="p-2 w-22 h-22 transition-all duration-300 
                       invert grayscale brightness-100 
                       dark:invert-0 dark:grayscale-0 dark:brightness-100"
          />
        </div>
        <p className="mt-6 text-lg font-semibold text-gray-600 dark:text-gray-300">
          Carregando seu hub...
        </p>
      </div>
    </>
  );
};

export default LoadingScreen;
