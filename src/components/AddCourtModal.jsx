import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { storage, db } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { X, UploadCloud, Wifi, ParkingSquare, Users, Dribbble, Sun, Utensils } from 'lucide-react';

const resourcesOptions = [
  { id: 'wifi', label: 'Wi-Fi', icon: <Wifi size={20} /> },
  { id: 'estacionamento', label: 'Estacionamento', icon: <ParkingSquare size={20} /> },
  { id: 'vestiario', label: 'Vestiário', icon: <Users size={20} /> },
  { id: 'lanchonete', label: 'Lanchonete', icon: <Utensils size={20} /> },
  { id: 'iluminacao', label: 'Iluminação', icon: <Sun size={20} /> },
];

// O modal agora aceita uma prop `courtToEdit`
const AddCourtModal = ({ onClose, onActionSuccess, courtToEdit }) => {
  const { currentUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  
  // Define se estamos no modo de edição
  const isEditMode = Boolean(courtToEdit);

  // Estados do formulário
  const [venueName, setVenueName] = useState('');
  const [address, setAddress] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [modality, setModality] = useState('Futsal');
  const [selectedResources, setSelectedResources] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [error, setError] = useState('');

  // Efeito para preencher o formulário se estivermos no modo de edição
  useEffect(() => {
    if (isEditMode) {
      setVenueName(courtToEdit.venueName);
      setAddress(courtToEdit.address);
      setHourlyRate(courtToEdit.hourlyRate);
      setModality(courtToEdit.modality);
      setPhotoPreview(courtToEdit.photoURL);
      // Converte o array de recursos em um objeto para o state
      const resourcesObj = courtToEdit.resources.reduce((acc, resource) => {
        acc[resource] = true;
        return acc;
      }, {});
      setSelectedResources(resourcesObj);
    }
  }, [courtToEdit, isEditMode]);


  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleResourceChange = (e) => {
    const { id, checked } = e.target;
    setSelectedResources(prev => ({ ...prev, [id]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!venueName || !address || !hourlyRate) {
      setError('Por favor, preencha nome, endereço e preço.');
      return;
    }
    // No modo de criação, a foto é obrigatória. Na edição, não.
    if (!isEditMode && !photoFile) {
        setError('Por favor, envie uma foto da quadra.');
        return;
    }

    setError('');
    setIsUploading(true);

    try {
      let photoURL = courtToEdit?.photoURL; // Mantém a URL antiga por padrão

      // Se um novo arquivo foi selecionado, faz o upload
      if (photoFile) {
        const photoRef = ref(storage, `venues/${currentUser.uid}/${Date.now()}_${photoFile.name}`);
        await uploadBytes(photoRef, photoFile);
        photoURL = await getDownloadURL(photoRef);
      }

      const resources = Object.keys(selectedResources).filter(key => selectedResources[key]);
      
      const courtData = {
        organizerId: currentUser.uid,
        venueName,
        address,
        hourlyRate: parseFloat(hourlyRate),
        modality,
        resources,
        photoURL,
        status: courtToEdit?.status || 'Ativo'
      };

      if (isEditMode) {
        // Se for edição, atualiza o documento existente
        const courtRef = doc(db, 'venues', courtToEdit.id);
        await updateDoc(courtRef, courtData);
      } else {
        // Se for criação, adiciona um novo documento
        await addDoc(collection(db, 'venues'), {
            ...courtData,
            createdAt: serverTimestamp(),
        });
      }

      onActionSuccess();
      onClose();
    } catch (err) {
      console.error("Erro ao salvar quadra: ", err);
      setError('Ocorreu um erro ao salvar a quadra. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div onClick={(e) => e.stopPropagation()} className="bg-[var(--bg-color2)] border-2 border-gray-700/50 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-[scaleUp_0.3s_ease-out_forwards]">
        <header className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">{isEditMode ? 'Editar Quadra' : 'Cadastrar Nova Quadra'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Fechar modal"><X size={24} /></button>
        </header>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && <p className="text-red-400 bg-red-500/10 p-2 rounded-md text-sm">{error}</p>}

          <div>
            <label className="text-sm font-medium text-gray-300">Foto do Local</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    {photoPreview ? (
                    <img src={photoPreview} alt="Pré-visualização" className="mx-auto h-24 w-auto rounded-md" />
                    ) : (
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-500" />
                    )}
                    <div className="flex text-sm text-gray-500">
                    <label htmlFor="photo-upload" className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-[var(--primary-color)] hover:text-pink-400 px-2">
                        <span>{isEditMode ? 'Trocar imagem' : 'Envie um arquivo'}</span>
                        <input id="photo-upload" name="photo-upload" type="file" className="sr-only" accept="image/*" onChange={handlePhotoChange} />
                    </label>
                    </div>
                    <p className="text-xs text-gray-600">PNG, JPG, GIF até 10MB</p>
                </div>
            </div>
          </div>
          
          {/* O resto do formulário é igual */}
          <div>
            <label htmlFor="venueName" className="text-sm font-medium text-gray-300">Nome da Quadra*</label>
            <input type="text" id="venueName" value={venueName} onChange={(e) => setVenueName(e.target.value)} className="w-full mt-1 bg-gray-700 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]" />
          </div>

          <div>
            <label htmlFor="address" className="text-sm font-medium text-gray-300">Endereço*</label>
            <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full mt-1 bg-gray-700 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="hourlyRate" className="text-sm font-medium text-gray-300">Preço por Hora (R$)*</label>
              <input type="number" id="hourlyRate" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} className="w-full mt-1 bg-gray-700 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]" />
            </div>
            <div>
              <label htmlFor="modality" className="text-sm font-medium text-gray-300">Modalidade*</label>
              <select id="modality" value={modality} onChange={(e) => setModality(e.target.value)} className="w-full mt-1 bg-gray-700 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]">
                <option>Futsal</option>
                <option>Society</option>
                <option>Campo</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">Recursos Disponíveis</label>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {resourcesOptions.map(option => (
                <div key={option.id}>
                  <input type="checkbox" id={option.id} checked={selectedResources[option.id] || false} onChange={handleResourceChange} className="hidden peer" />
                  <label htmlFor={option.id} className="flex items-center gap-2 p-2 text-gray-400 bg-gray-700 rounded-lg cursor-pointer peer-checked:bg-[var(--primary-color)] peer-checked:text-white hover:bg-gray-600 transition-colors">
                    {option.icon}
                    <span className="text-xs font-semibold">{option.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)] text-black font-bold py-2 px-6 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
              disabled={isUploading}
            >
              <UploadCloud size={20} />
              {isUploading ? 'Salvando...' : (isEditMode ? 'Salvar Alterações' : 'Salvar Quadra')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourtModal;