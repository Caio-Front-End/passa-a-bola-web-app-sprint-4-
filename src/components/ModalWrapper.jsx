import { X } from 'lucide-react';

const ModalWrapper = ({ title, onClose, children }) => {
  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform animate-[zoomIn_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()} // Impede que o clique dentro do modal o feche
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Fechar modal"
          >
            <X size={24} />
          </button>
        </header>
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default ModalWrapper;
