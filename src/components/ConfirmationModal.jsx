// src/components/ConfirmationModal.jsx

import ModalWrapper from './ModalWrapper';
import { AlertTriangle } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <ModalWrapper title={title} onClose={onClose}>
      <div className="p-6 text-center text-white">
        <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-4" />
        <p className="text-gray-300">{message}</p>

        <div className="flex justify-center gap-4 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-8 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-8 rounded-lg transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ConfirmationModal;
