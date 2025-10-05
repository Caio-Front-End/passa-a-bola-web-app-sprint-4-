import { useState } from 'react';
import ModalWrapper from './ModalWrapper.jsx';
import {
  MapPin,
  Trophy,
  SlidersHorizontal,
  Lock,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const Step1 = ({ formData, setFormData, handleCep }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
      <MapPin size={20} /> Localização e Data
    </h3>
    <input
      type="text"
      placeholder="Nome do Campeonato"
      value={formData.name}
      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      className="w-full pl-4 pr-3 py-3 bg-[var(--bg-color2)] rounded-md text-white border border-gray-600 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
    />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input
        type="text"
        placeholder="CEP"
        value={formData.cep}
        onChange={handleCep}
        maxLength="8"
        className="md:col-span-1 w-full pl-4 pr-3 py-3 bg-[var(--bg-color2)] rounded-md text-white border border-gray-600 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
      />
      <input
        type="text"
        placeholder="Rua"
        value={formData.street}
        disabled
        className="md:col-span-2 w-full pl-4 pr-3 py-3 bg-gray-700/50 rounded-md text-gray-400 border border-gray-600"
      />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input
        type="text"
        placeholder="Número"
        value={formData.number}
        onChange={(e) => setFormData({ ...formData, number: e.target.value })}
        className="w-full pl-4 pr-3 py-3 bg-[var(--bg-color2)] rounded-md text-white border border-gray-600 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
      />
      <input
        type="text"
        placeholder="Bairro"
        value={formData.neighborhood}
        disabled
        className="w-full pl-4 pr-3 py-3 bg-gray-700/50 rounded-md text-gray-400 border border-gray-600"
      />
      <input
        type="text"
        placeholder="Cidade"
        value={formData.city}
        disabled
        className="w-full pl-4 pr-3 py-3 bg-gray-700/50 rounded-md text-gray-400 border border-gray-600"
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <input
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        className="w-full pl-4 pr-3 py-3 bg-[var(--bg-color2)] rounded-md text-white border border-gray-600 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
      />
      <input
        type="time"
        value={formData.time}
        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
        className="w-full pl-4 pr-3 py-3 bg-[var(--bg-color2)] rounded-md text-white border border-gray-600 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
      />
    </div>
  </div>
);

const Step2 = ({ formData, setFormData }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
      <Trophy size={20} /> Regras da Competição
    </h3>
    <select
      value={formData.format}
      onChange={(e) => setFormData({ ...formData, format: e.target.value })}
      className="w-full pl-4 pr-3 py-3 bg-[var(--bg-color2)] rounded-md text-white border border-gray-600 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
    >
      <option value="">Formato do Campeonato</option>
      <option value="rachao">Rachão</option>
      <option value="grupos_mata_mata">Fase de Grupos + Mata-Mata</option>
      <option value="mata_mata">Somente Mata-Mata</option>
      <option value="pontos_corridos">Pontos Corridos</option>
    </select>
    <select
      value={formData.modality}
      onChange={(e) => setFormData({ ...formData, modality: e.target.value })}
      className="w-full pl-4 pr-3 py-3 bg-[var(--bg-color2)] rounded-md text-white border border-gray-600 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
    >
      <option value="">Modalidade</option>
      <option value="futsal">Futsal</option>
      <option value="society">Society</option>
      <option value="campo">Campo</option>
    </select>
    <div>
      <label className="text-sm text-gray-300">
        Capacidade Máxima de Atletas
      </label>
      <input
        type="number"
        placeholder="Ex: 20"
        value={formData.maxCapacity}
        onChange={(e) =>
          setFormData({ ...formData, maxCapacity: e.target.value })
        }
        className="w-full mt-1 pl-4 pr-3 py-3 bg-[var(--bg-color2)] rounded-md text-white border border-gray-600 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
      />
    </div>
  </div>
);

const Step3 = ({ formData, setFormData }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
      <SlidersHorizontal size={20} /> Configurações Finais
    </h3>
    <div>
      <label className="text-sm text-gray-300">Acesso ao Campeonato</label>
      <div className="flex gap-4 mt-2">
        <button
          type="button"
          onClick={() => setFormData({ ...formData, access: 'publico' })}
          className={`flex-1 py-3 rounded-md ${
            formData.access === 'publico'
              ? 'bg-[var(--primary-color)]'
              : 'bg-[var(--bg-color2)]'
          }`}
        >
          Público
        </button>
        <button
          type="button"
          onClick={() => setFormData({ ...formData, access: 'privado' })}
          className={`flex-1 py-3 rounded-md ${
            formData.access === 'privado'
              ? 'bg-[var(--primary-color)]'
              : 'bg-[var(--bg-color2)]'
          }`}
        >
          Privado
        </button>
      </div>
    </div>
    {formData.access === 'privado' && (
      <div className="relative">
        <Lock
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="password"
          placeholder="Defina uma senha"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="w-full pl-10 pr-3 py-3 bg-[var(--bg-color2)] rounded-md text-white border border-gray-600 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
        />
      </div>
    )}
    <div>
      <label className="text-sm text-gray-300">Montagem dos Times</label>
      <div className="flex gap-4 mt-2">
        <button
          type="button"
          onClick={() => setFormData({ ...formData, teamFormation: 'escolha' })}
          className={`flex-1 py-3 rounded-md ${
            formData.teamFormation === 'escolha'
              ? 'bg-[var(--primary-color)]'
              : 'bg-[var(--bg-color2)]'
          }`}
        >
          Atletas escolhem
        </button>
        <button
          type="button"
          onClick={() => setFormData({ ...formData, teamFormation: 'sorteio' })}
          className={`flex-1 py-3 rounded-md ${
            formData.teamFormation === 'sorteio'
              ? 'bg-[var(--primary-color)]'
              : 'bg-[var(--bg-color2)]'
          }`}
        >
          Sorteio automático
        </button>
      </div>
    </div>
  </div>
);

const CreateChampionshipModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cep: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    date: '',
    time: '',
    format: '',
    modality: '',
    maxCapacity: '',
    access: 'publico',
    password: '',
    teamFormation: 'escolha',
  });

  const handleCep = async (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    setFormData({ ...formData, cep });
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    if (!currentUser) {
      console.error('Usuário não está logado.');
      return;
    }

    if (formData.modality === 'futsal' && parseInt(formData.maxCapacity) < 10) {
      alert('Para Futsal (5v5), a capacidade mínima é de 10 atletas.');
      setStep(2);
      return;
    }

    setIsSubmitting(true);
    try {
      const finalData = {
        ...formData,
        organizerUid: currentUser.uid,
        organizerName: currentUser.displayName || currentUser.name,
        participants: [],
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'championships'), finalData);
      console.log('Campeonato salvo com ID: ', docRef.id);

      onClose();
    } catch (e) {
      console.error('Erro ao adicionar documento: ', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    <Step1
      formData={formData}
      setFormData={setFormData}
      handleCep={handleCep}
    />,
    <Step2 formData={formData} setFormData={setFormData} />,
    <Step3 formData={formData} setFormData={setFormData} />,
  ];

  return (
    <ModalWrapper title="Criar Novo Campeonato" onClose={onClose}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  step >= s
                    ? 'bg-[var(--primary-color)] text-white'
                    : 'bg-[var(--bg-color2)] text-gray-400'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-12 h-1 ${
                    step > s
                      ? 'bg-[var(--primary-color)]'
                      : 'bg-[var(--bg-color2)]'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="min-h-[300px]">{steps[step - 1]}</div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-700">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="disabled:opacity-50 flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>
          {step < 3 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)] text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Avançar
              <ArrowRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Publicando...' : 'Publicar Campeonato'}
            </button>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
};

export default CreateChampionshipModal;
