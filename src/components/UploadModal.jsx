import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { storage, db } from '../firebase'; // Importar do nosso firebase.js
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { X, UploadCloud } from 'lucide-react';

const UploadModal = ({ onClose }) => {
  const { currentUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file || !currentUser) {
      alert('Por favor, selecione um vídeo e esteja logado!');
      return;
    }
    setUploading(true);
    try {
      // 1. Criar referência e fazer upload para o Firebase Storage
      const fileName = `${currentUser.uid}_${Date.now()}`;
      const storageRef = ref(storage, `videos/${currentUser.uid}/${fileName}`);
      await uploadBytes(storageRef, file);

      // 2. Obter a URL de download do vídeo
      const videoUrl = await getDownloadURL(storageRef);

      // 3. Salvar as informações do vídeo no Firestore
      await addDoc(collection(db, 'videos'), {
        uid: currentUser.uid,
        userName: currentUser.displayName,
        avatarUrl: currentUser.photoURL || null, // Salva a URL da foto atual ou nulo
        videoUrl: videoUrl,
        caption: caption,
        likes: 0,
        comments: 0,
        createdAt: serverTimestamp(),
      });

      alert('Vídeo postado com sucesso!');
      onClose();
      window.location.reload(); // Recarrega a página para atualizar as listas
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
            <label
              htmlFor="video-upload"
              className="block text-sm font-medium mb-2"
            >
              Selecione o vídeo
            </label>
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--primary-color)] file:text-white hover:file:bg-[var(--primary-color-hover)]"
              disabled={uploading}
            />
          </div>
          <div className="mb-6">
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
