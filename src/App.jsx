import { Routes, Route } from 'react-router-dom';

// Componentes de Layout e Proteção
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Páginas Públicas
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Páginas Protegidas
import HubPage from './pages/HubPage';
import CourtsPage from './pages/CourtsPage';
import FintaPage from './pages/FintaPage';

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
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
