import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; // Importa o ícone de seta

function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      // Melhoria: navigate(-1) volta para a página anterior na história de navegação
      onClick={() => navigate(-1)}
      className="
        fixed top-5 left-5 z-50
        w-12 h-12
        backdrop-blur-xs
        rounded-full
        cursor-pointer
        flex items-center justify-center
        transition-transform duration-200 ease-in-out
        hover:scale-110
        shadow-lg
        bg-[var(--bg-color)]/10
        hover:bg-[var(--bg-color)]/10
      "
    >
      {/* Utiliza o ícone importado */}
      <ArrowLeft size={35} color="#fff" strokeWidth={2} />
    </button>
  );
}

export default BackButton;

