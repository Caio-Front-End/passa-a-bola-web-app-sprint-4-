// src/components/UploadModal.jsx

import { useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import { storage, db } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { X, UploadCloud, Trophy, Camera, Library } from 'lucide-react';

// ++ ALTERAÇÃO AQUI ++ Recebemos a nova propriedade onUploadSuccess
const UploadModal = ({ onClose, onUploadSuccess }) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [championshipId, setChampionshipId] = useState('');

  const recordInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file || !currentUser) {
      alert('Por favor, selecione um vídeo e esteja logado!');
      return;
    }
    setUploading(true);
    try {
      const fileName = `${currentUser.uid}_${Date.now()}`;
      const storageRef = ref(storage, `videos/${currentUser.uid}/${fileName}`);
      await uploadBytes(storageRef, file);
      const videoUrl = await getDownloadURL(storageRef);

      // ++ ALTERAÇÃO AQUI ++ Guardamos os dados do novo vídeo
      const newVideoData = {
        uid: currentUser.uid,
        userName: currentUser.displayName,
        avatarUrl: currentUser.photoURL || null,
        videoUrl: videoUrl,
        caption: caption,
        championshipId: championshipId.trim(),
        likes: 0,
        comments: 0,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'videos'), newVideoData);

      showToast('Vídeo postado com sucesso!');

      // ++ ALTERAÇÃO AQUI ++ Chamamos a função do componente pai
      if (onUploadSuccess) {
        onUploadSuccess({ id: docRef.id, ...newVideoData });
      }

      onClose();
      // -- REMOVIDO -- window.location.reload();
    } catch (error) {
      console.error('Erro no upload: ', error);
      alert('Falha ao enviar o vídeo.');
    }
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-11/12 max-w-md text-white relative">
        <button onClick={onClose} className="absolute top-3 right-3">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4">Postar Vídeo</h2>
        <form onSubmit={handleUpload}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Selecione o vídeo
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => recordInputRef.current.click()}
                className="flex flex-col items-center justify-center p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Camera size={24} className="mb-1" />
                <span className="text-sm">Gravar</span>
              </button>
              <button
                type="button"
                onClick={() => galleryInputRef.current.click()}
                className="flex flex-col items-center justify-center p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Library size={24} className="mb-1" />
                <span className="text-sm">Galeria</span>
              </button>
            </div>
            <input
              ref={recordInputRef}
              type="file"
              accept="video/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
            <input
              ref={galleryInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
            {file && (
              <p className="text-xs text-center mt-3 text-gray-400 truncate">
                Arquivo selecionado: {file.name}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="caption" className="block text-sm font-medium mb-2">
              Legenda
            </label>
            <textarea
              id="caption"
              rows="3"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-gray-700 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              placeholder="Escreva uma legenda..."
              disabled={uploading}
            ></textarea>
          </div>

          <div className="mb-6">
            <label
              htmlFor="championshipId"
              className="flex items-center gap-2 text-sm font-medium mb-2"
            >
              <Trophy size={16} /> Anexar Campeonato (Opcional)
            </label>
            <input
              id="championshipId"
              type="text"
              value={championshipId}
              onChange={(e) => setChampionshipId(e.target.value)}
              className="w-full bg-gray-700 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              placeholder="Cole o ID do campeonato aqui"
              disabled={uploading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)] font-bold py-3 px-4 rounded-lg flex justify-center items-center gap-2 disabled:opacity-50"
            disabled={uploading || !file}
          >
            <UploadCloud size={20} />
            {uploading ? 'Enviando...' : 'Postar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
