import { useState, useRef } from 'react';
import ModalWrapper from './ModalWrapper.jsx';
import { User, Hash, Star, Heart, MapPin, Save, Upload } from 'lucide-react';
import SeletorAdmin from './SeletorAdmin.jsx';

const EditProfileModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    apelido: user.apelido || '',
    idade: user.idade || '',
    posicao: user.posicao || '',
    timeCoracao: user.timeCoracao || '',
    cidadeEstado: user.cidadeEstado || '',
    userType: user.userType || 'jogadora',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(user.photoURL);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserTypeChange = (newUserType) => {
    setFormData((prev) => ({ ...prev, userType: newUserType }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave({ formData, photoFile });
    setIsSaving(false);
  };

  const isAtleta = formData.userType === 'jogadora';

  return (
    <ModalWrapper title="Editar Perfil" onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
        <div className="flex flex-col items-center gap-4">
          <img
            src={
              photoPreview ||
              `https://placehold.co/128x128/b554b5/FFFFFF?text=${
                user.name?.charAt(0) || '?'
              }`
            }
            alt="Pré-visualização do perfil"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-600"
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 text-sm"
          >
            <Upload size={16} />
            Trocar Foto
          </button>
        </div>

        <SeletorAdmin
          selected={formData.userType}
          setSelected={handleUserTypeChange}
        />

        <div className="relative">
          <User
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            name="name"
            placeholder="Nome completo"
            value={formData.name}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
          />
        </div>

        {isAtleta && (
          <>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                name="apelido"
                placeholder="Apelido de destaque"
                value={formData.apelido}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              />
            </div>
            <div className="relative">
              <Hash
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="number"
                name="idade"
                placeholder="Idade"
                value={formData.idade}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              />
            </div>
            <div className="relative">
              <Star
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select
                name="posicao"
                value={formData.posicao}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 bg-gray-700 text-white rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              >
                <option value="" disabled>
                  Posição favorita
                </option>
                <option value="goleira">Goleira</option>
                <option value="fixo">Fixo / Zagueira</option>
                <option value="ala">Ala / Lateral</option>
                <option value="pivo">Pivô / Atacante</option>
              </select>
            </div>
            <div className="relative">
              <Heart
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                name="timeCoracao"
                placeholder="Time do coração"
                value={formData.timeCoracao}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              />
            </div>
            <div className="relative">
              <MapPin
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                name="cidadeEstado"
                placeholder="Sua cidade e estado"
                value={formData.cidadeEstado}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              />
            </div>
          </>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full flex justify-center items-center gap-2 bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)] text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50"
          >
            <Save size={20} />
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default EditProfileModal;
