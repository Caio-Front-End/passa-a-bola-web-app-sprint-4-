import { useState, useRef } from 'react';
import ModalWrapper from './ModalWrapper';
import { User, Cake, MapPin, Heart, Shield, Camera } from 'lucide-react';
import SeletorAdmin from './SeletorAdmin';

const EditProfileModal = ({ isOpen, onClose, currentUser, onSave }) => {
  // Trava de segurança para evitar erro se currentUser for undefined
  if (!currentUser) {
    return null;
  }

  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    apelido: currentUser.apelido || '',
    idade: currentUser.idade || '',
    posicao: currentUser.posicao || '',
    timeCoracao: currentUser.timeCoracao || '',
    cidadeEstado: currentUser.cidadeEstado || '',
    userType: currentUser.userType || 'jogadora',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(
    currentUser.photoURL || null,
  );
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserTypeChange = (type) => {
    setFormData((prev) => ({ ...prev, userType: type }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, photoFile);
  };

  return (
    <ModalWrapper title="Editar Perfil" onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
        {/* Seção da Foto */}
        <div className="flex flex-col items-center gap-4">
          <img
            src={
              photoPreview ||
              `https://placehold.co/128x128/b554b5/FFFFFF?text=${(
                currentUser.name || '?'
              ).charAt(0)}`
            }
            alt="Pré-visualização do perfil"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-600"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            ref={fileInputRef}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors text-sm"
          >
            <Camera size={18} />
            Trocar Foto
          </button>
        </div>

        {/* Seletor de Persona */}
        <SeletorAdmin
          selected={formData.userType}
          setSelected={handleUserTypeChange}
        />

        {/* Campos do Formulário */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              className="w-full pl-10 pr-3 py-3 bg-[var(--bg-color2)] rounded-md text-white border border-gray-600 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
            />
          </div>
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
              className="w-full pl-10 pr-3 py-3 bg-[var(--bg-color2)] rounded-md text-white border border-gray-600 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
            />
          </div>
          <div className="relative">
            <Cake
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="number"
              name="idade"
              placeholder="Idade"
              value={formData.idade}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-3 bg-[var(--bg-color2)] rounded-md text-white border border-gray-600 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
            />
          </div>
          <div className="relative">
            <Shield
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <select
              name="posicao"
              value={formData.posicao}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-3 bg-[var(--bg-color2)] rounded-md text-white border border-gray-600 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
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
              className="w-full pl-10 pr-3 py-3 bg-[var(--bg-color2)] rounded-md text-white border border-gray-600 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
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
              className="w-full pl-10 pr-3 py-3 bg-[var(--bg-color2)] rounded-md text-white border border-gray-600 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
            />
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)] text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Salvar
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default EditProfileModal;
