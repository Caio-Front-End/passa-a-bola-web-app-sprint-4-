// src/pages/MyVenuesPage.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Página temporária que redireciona para o dashboard
const MyVenuesPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/dashboard');
    }, [navigate]);
    return null; // Não renderiza nada, apenas redireciona
};

export default MyVenuesPage;