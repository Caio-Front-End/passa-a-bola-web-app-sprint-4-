// src/components/CreateChampionshipModal.jsx

import { useState } from 'react';
import ModalWrapper from './ModalWrapper';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext'; // 1. IMPORTADO O HOOK
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ArrowLeft, ArrowRight, CheckCircle, Copy } from 'lucide-react';

const CreateChampionshipModal = ({ onClose }) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast(); // 2. INICIADO O HOOK
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    cep: '',
    street: '',
    neighborhood: '',
    city: '',
    number: '',
    date: '',
    time: '',
    format: 'rachao',
    modality: 'futsal',
    numberOfTeams: 2,
    access: 'publico',
    password: '',
    teamFormation: 'manual',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdChampionshipId, setCreatedChampionshipId] = useState(null);
  const [copied, setCopied] = useState(false);

  const playersPerTeam = { futsal: 5, society: 7, campo: 11 };
  const calculatedMaxCapacity =
    formData.numberOfTeams * playersPerTeam[formData.modality];

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.cep || !formData.date || !formData.time) {
        setError('Preencha todos os campos obrigatórios da Etapa 1.');
        return;
      }
    }
    if (step === 2) {
      if (!formData.numberOfTeams || parseInt(formData.numberOfTeams) < 2) {
        setError('O campeonato precisa ter pelo menos 2 times.');
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCepChange = async (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    setFormData((prev) => ({ ...prev, cep }));
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

  const handleSubmit = async () => {
    if (formData.access === 'privado' && !formData.password) {
      setError('É necessário definir uma senha para campeonatos privados.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const maxCapacity = calculatedMaxCapacity;

      const newChampionshipData = {
        ...formData,
        maxCapacity,
        organizerUid: currentUser.uid,
        organizerName: currentUser.displayName || currentUser.name,
        participants: [
          {
            uid: currentUser.uid,
            name: currentUser.displayName || currentUser.name,
          },
        ],
        createdAt: serverTimestamp(),
      };

      if (formData.teamFormation === 'manual') {
        const teams = [];
        for (let i = 0; i < formData.numberOfTeams; i++) {
          const team = {
            name: `Time ${String.fromCharCode(65 + i)}`,
            players: [],
          };
          if (i === 0) {
            team.players.push({
              uid: currentUser.uid,
              name: currentUser.displayName || currentUser.name,
            });
          }
          teams.push(team);
        }
        newChampionshipData.teams = teams;
      }

      const docRef = await addDoc(
        collection(db, 'championships'),
        newChampionshipData,
      );

      showToast(); // 3. CHAMADA DO TOAST NO MOMENTO DO SUCESSO
      setCreatedChampionshipId(docRef.id);
    } catch (e) {
      console.error('Erro ao adicionar documento: ', e);
      setError('Ocorreu um erro ao salvar o campeonato. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    const textArea = document.createElement('textarea');
    textArea.value = createdChampionshipId;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    document.body.removeChild(textArea);
  };

  const renderStep = () => {
    if (createdChampionshipId) {
      return (
        <div className="p-6 text-center">
          <CheckCircle
            size={48}
            className="mx-auto text-[var(--primary-color)] mb-4"
          />
          <h3 className="text-xl font-bold text-white">Campeonato Criado!</h3>
          <p className="text-gray-400 mt-2 mb-4">
            Compartilhe o ID abaixo para que outras atletas possam encontrar e
            se inscrever:
          </p>
          <div className="bg-gray-900 rounded-lg p-3 flex flex-col items-center justify-between gap-4">
            <span className="font-mono text-lg text-gray-300">
              {createdChampionshipId}
            </span>
            <button
              onClick={handleCopyToClipboard}
              className="w-full mt-2 bg-[var(--primary-color)] text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center justify-center gap-2"
            >
              <Copy size={16} />
              {copied ? 'Copiado!' : 'Copiar ID'}
            </button>
          </div>
          <button
            onClick={onClose}
            className="mt-6 w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg"
          >
            Fechar
          </button>
        </div>
      );
    }

    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="font-bold text-white text-lg">
              Etapa 1: Localização
            </h3>
            <input
              type="text"
              name="name"
              placeholder="Nome do Campeonato"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 bg-[var(--bg-color2)] rounded-md text-white"
            />
            <input
              type="text"
              name="cep"
              placeholder="CEP"
              value={formData.cep}
              onChange={handleCepChange}
              className="w-full p-2 bg-[var(--bg-color2)] rounded-md text-white"
            />
            <input
              type="text"
              name="street"
              placeholder="Rua"
              value={formData.street}
              onChange={handleChange}
              className="w-full p-2 bg-[var(--bg-color2)] rounded-md text-white"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="number"
                placeholder="Número"
                value={formData.number}
                onChange={handleChange}
                className="w-full p-2 bg-[var(--bg-color2)] rounded-md text-white"
              />
              <input
                type="text"
                name="neighborhood"
                placeholder="Bairro"
                value={formData.neighborhood}
                onChange={handleChange}
                className="w-full p-2 bg-[var(--bg-color2)] rounded-md text-white"
              />
            </div>
            <input
              type="text"
              name="city"
              placeholder="Cidade"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-2 bg-[var(--bg-color2)] rounded-md text-white"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 bg-[var(--bg-color2)] rounded-md text-white"
              />
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full p-2 bg-[var(--bg-color2)] rounded-md text-white"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="font-bold text-white text-lg">
              Etapa 2: Regras da Competição
            </h3>
            <select
              name="format"
              value={formData.format}
              onChange={handleChange}
              className="w-full p-2 bg-[var(--bg-color2)] rounded-md text-white"
            >
              <option value="rachao">Rachão</option>
              <option value="grupos-mata-mata">
                Fase de Grupos + Mata-Mata
              </option>
              <option value="mata-mata">Somente Mata-Mata</option>
              <option value="pontos-corridos">Pontos Corridos</option>
            </select>
            <select
              name="modality"
              value={formData.modality}
              onChange={handleChange}
              className="w-full p-2 bg-[var(--bg-color2)] rounded-md text-white"
            >
              <option value="futsal">Futsal (5 por time)</option>
              <option value="society">Society (7 por time)</option>
              <option value="campo">Campo (11 por time)</option>
            </select>
            <input
              type="number"
              name="numberOfTeams"
              placeholder="Quantidade de Times"
              value={formData.numberOfTeams}
              onChange={handleChange}
              className="w-full p-2 bg-[var(--bg-color2)] rounded-md text-white"
              min="2"
            />
            <p className="text-sm text-gray-400 text-center">
              Total de atletas: {calculatedMaxCapacity}
            </p>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="font-bold text-white text-lg">
              Etapa 3: Configurações Finais
            </h3>
            <select
              name="access"
              value={formData.access}
              onChange={handleChange}
              className="w-full p-2 bg-[var(--bg-color2)] rounded-md text-white"
            >
              <option value="publico">Público</option>
              <option value="privado">Privado</option>
            </select>
            {formData.access === 'privado' && (
              <input
                type="password"
                name="password"
                placeholder="Senha Simples"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 bg-[var(--bg-color2)] rounded-md text-white"
              />
            )}
            <select
              name="teamFormation"
              value={formData.teamFormation}
              onChange={handleChange}
              className="w-full p-2 bg-[var(--bg-color2)] rounded-md text-white"
            >
              <option value="manual">Atletas escolhem o time</option>
              <option value="sorteio">Sorteio automático</option>
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  const StepIndicator = ({ currentStep }) => {
    return (
      <div className="flex justify-center items-center mb-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors ${
                currentStep >= s
                  ? 'bg-[var(--primary-color)] text-white'
                  : 'bg-gray-700 text-gray-400'
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`w-12 h-1 transition-colors ${
                  currentStep > s ? 'bg-[var(--primary-color)]' : 'bg-gray-700'
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <ModalWrapper title="Criar Novo Campeonato" onClose={onClose}>
      <div className="p-6">
        {!createdChampionshipId && <StepIndicator currentStep={step} />}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {renderStep()}
        {!createdChampionshipId && (
          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
              >
                <ArrowLeft size={18} /> Voltar
              </button>
            ) : (
              <div></div>
            )}
            {step < 3 ? (
              <button
                onClick={handleNext}
                className="bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)] text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
              >
                Avançar <ArrowRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
              >
                {loading ? 'Publicando...' : 'Publicar Campeonato'}
              </button>
            )}
          </div>
        )}
      </div>
    </ModalWrapper>
  );
};

export default CreateChampionshipModal;
