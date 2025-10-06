import { Routes, Route } from 'react-router-dom';

// Componentes de Layout e Proteção
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Páginas Públicas
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

// Páginas Protegidas
import HubPage from './pages/HubPage.jsx';
import CourtsPage from './pages/CourtsPage.jsx';
import FintaPage from './pages/FintaPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

function App() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rotas Protegidas que usam o Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<HubPage />} />
          <Route path="/courts" element={<CourtsPage />} />
          <Route path="/finta" element={<FintaPage />} />
          <Route path="/minha-conta" element={<ProfilePage />} />
          {/* --- NOVA ROTA ADICIONADA --- */}
          <Route path="/profile/:userId" element={<ProfilePage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
