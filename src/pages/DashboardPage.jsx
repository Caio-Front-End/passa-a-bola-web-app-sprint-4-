import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db, storage } from '../firebase';
import { collection, query, where, getDocs, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { DollarSign, CalendarDays, MapPin, Star, Plus, MoreVertical, Edit, Trash2 } from 'lucide-react';
import AddCourtModal from '../components/AddCourtModal';

// Componentes StatCard e ReservationItem (sem alterações)
const StatCard = ({ icon, title, value, subtext, iconBgColor }) => {
  return (
    <div className="bg-[var(--bg-color2)] p-4 rounded-lg shadow flex items-start gap-4">
      <div className={`p-3 rounded-md ${iconBgColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-gray-500">{subtext}</p>
      </div>
    </div>
  );
};
const ReservationItem = ({ title, subtitle, date, time, price, status, statusColor }) => {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-700/30 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-700 rounded-lg">
          <CalendarDays size={20} className="text-gray-400" />
        </div>
        <div>
          <p className="font-semibold text-white">{title}</p>
          <p className="text-xs text-gray-400">{subtitle} &middot; {date} &middot; {time}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-white">R$ {price}</p>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor}`}>{status}</span>
      </div>
    </div>
  );
};


// --- ALTERAÇÃO APLICADA AQUI ---
const CourtItem = ({ court, onEdit, onDelete }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const statusColor = court.status === 'Ativo' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300';

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        // 1. Container agora é 'relative' e NÃO tem 'overflow-hidden'
        <div className="bg-[var(--bg-color2)] rounded-lg shadow-lg flex gap-4 relative">
            {/* 2. Imagem agora tem a borda arredondada aplicada diretamente nela */}
            <img
                src={court.photoURL}
                alt={court.venueName}
                className="w-32 object-cover flex-shrink-0 rounded-l-lg"
            />
            
            {/* 3. O menu é posicionado em relação ao container principal */}
            <div ref={menuRef} className="absolute top-2 left-2 z-10">
                <button onClick={() => setMenuOpen(!menuOpen)} className="p-1 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors">
                    <MoreVertical size={18} />
                </button>
                {menuOpen && (
                    <div className="absolute left-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
                        <button onClick={() => { onEdit(court); setMenuOpen(false); }} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-t-md">
                            <Edit size={14} /> Editar
                        </button>
                        <button onClick={() => { onDelete(court); setMenuOpen(false); }} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-b-md">
                            <Trash2 size={14} /> Excluir
                        </button>
                    </div>
                )}
            </div>

            {/* Container de detalhes */}
            <div className="p-3 flex-grow flex flex-col justify-center">
                <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-white">{court.venueName}</h4>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor} flex-shrink-0`}>{court.status}</span>
                </div>
                <div className="text-sm space-y-1 text-gray-400">
                    <p className="text-xs truncate">{court.address}</p>
                    <p className="text-xs">{court.modality} &middot; R$ {court.hourlyRate}/hr</p>
                    {court.resources?.length > 0 && <p className="text-xs truncate">Recursos: {court.resources.join(', ')}</p>}
                </div>
            </div>
        </div>
    );
};
// --- FIM DA ALTERAÇÃO ---

const DashboardPage = ({...props}) => {
  const { currentUser } = useAuth();
  const [editingCourt, setEditingCourt] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourts = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "venues"),
        where("organizerId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const courtsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourts(courtsList);
    } catch (error) {
        console.error("Erro ao buscar quadras: ", error)
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    if(currentUser) {
        fetchCourts();
    }
  }, [currentUser]);

  const handleOpenModalForCreate = () => {
    setEditingCourt(null);
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (court) => {
    setEditingCourt(court);
    setIsModalOpen(true);
  };

  const handleDeleteCourt = async (court) => {
    if (window.confirm(`Tem certeza que deseja excluir a quadra "${court.venueName}"? Esta ação não pode ser desfeita.`)) {
        try {
            await deleteDoc(doc(db, "venues", court.id));
            if (court.photoURL) {
                const imageRef = ref(storage, court.photoURL);
                await deleteObject(imageRef);
            }
            fetchCourts();
        } catch (error) {
            console.error("Erro ao excluir quadra: ", error);
            alert("Não foi possível excluir a quadra. Tente novamente.");
        }
    }
  };
  
  return (
    <>
      <div className="p-4 md:p-8 bg-[var(--bg-color)] text-gray-200 min-h-full font-sans">
        <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard do Organizador</h1>
            <p className="text-md text-gray-400">Gerencie seus espaços e reservas</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleOpenModalForCreate} className="bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)] text-black font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
              <Plus size={20} /> Nova Quadra
            </button>
          </div>
        </header>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<DollarSign size={24} className="text-green-400" />} iconBgColor="bg-green-500/10" title="Receita Total" value="R$ 15.240" subtext="+ 12% este mês" />
          <StatCard icon={<CalendarDays size={24} className="text-blue-400" />} iconBgColor="bg-blue-500/10" title="Reservas do Mês" value="89" subtext="+ 6% este mês" />
          <StatCard icon={<MapPin size={24} className="text-orange-400" />} iconBgColor="bg-orange-500/10" title="Quadras Ativas" value={`${courts.filter(c => c.status === 'Ativo').length} de ${courts.length} total`} />
          <StatCard icon={<Star size={24} className="text-yellow-400" />} iconBgColor="bg-yellow-500/10" title="Avaliação Média" value="4.8" subtext="★★★★☆" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-[var(--bg-color2)] p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Reservas Recentes</h3>
              <a href="#" className="text-sm font-semibold text-[var(--primary-color)] hover:underline">Ver Todas</a>
            </div>
            <div className="space-y-2">
              <ReservationItem title="Ana Silva" subtitle="Arena Principal" date="25 Set 2024" time="14:00 - 16:00" price="160" status="Confirmado" statusColor="bg-blue-500/20 text-blue-300" />
              <ReservationItem title="Carlos Santos" subtitle="Quadra 2" date="26 Set 2024" time="19:00 - 21:00" price="120" status="Pendente" statusColor="bg-green-500/20 text-green-300" />
            </div>
          </div>

          <div className="lg:col-span-1 bg-[var(--bg-color2)] p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4">Minhas Quadras</h3>
            {loading ? <p className="text-center text-gray-400">Carregando quadras...</p> : courts.length > 0 ? (
              <div className="space-y-4">
                {courts.map(court => (
                  <CourtItem key={court.id} court={court} onEdit={handleOpenModalForEdit} onDelete={handleDeleteCourt} />
                ))}
              </div>
            ) : <p className="text-sm text-center text-gray-400 py-4">Nenhuma quadra cadastrada ainda.</p>}
            <button onClick={handleOpenModalForCreate} className="w-full mt-6 bg-gray-700/50 hover:bg-gray-700 text-gray-300 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <Plus size={20} /> Cadastrar Nova Quadra
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && <AddCourtModal onClose={() => setIsModalOpen(false)} onActionSuccess={fetchCourts} courtToEdit={editingCourt} />}
    </>
  );
};

export default DashboardPage;