import { X } from 'lucide-react';

const ModalWrapper = ({ children, onClose, title }) => {
  return (
    <div
      onClick={onClose}
      // ADICIONADO h-screen e w-screen para garantir a tela cheia
      className="fixed inset-0 h-screen w-screen bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white/10 dark:bg-gray-600/10 backdrop-blur-sm border border-white/20 dark:border-gray-700 rounded-lg shadow-xl w-11/12 max-w-4xl max-h-[90vh] flex flex-col animate-[scaleUp_0.3s_ease-out_forwards]"
      >
        <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
            aria-label="Fechar modal"
          >
            <X size={24} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default ModalWrapper;