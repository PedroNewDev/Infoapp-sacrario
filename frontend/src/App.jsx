import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './context/UserContext';
import BottomTabBar from './components/layout/BottomTabBar';
import CountdownBar from './components/layout/CountdownBar';
import DevPanel from './components/dev/DevPanel';
import Login from './pages/Login';
import DefinirSenha from './pages/DefinirSenha';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Jornada from './pages/Jornada';
import DiaDaJornada from './pages/DiaDaJornada';
import Rosario from './pages/Rosario';
import Comunidade from './pages/Comunidade';
import BibliotecaEspiritual from './pages/BibliotecaEspiritual';
import OracaoLimpeza from './pages/OracaoLimpeza';
import Loja from './pages/Loja';
import Perfil from './pages/Perfil';
import ConsagracaoEterna from './pages/ConsagracaoEterna';
import AcessoExpirado from './pages/AcessoExpirado';
import Conclusao from './pages/Conclusao';

function ProtectedRoute({ children }) {
  const { usuario, carregando } = useUser();

  if (carregando) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!usuario) return <Navigate to="/login" replace />;

  // Verificar expiração
  if (!usuario.acesso_vitalicio && usuario.data_primeiro_login) {
    const diffMs = new Date() - new Date(usuario.data_primeiro_login);
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDias > 45) return <Navigate to="/acesso-expirado" replace />;
  }

  // Verificar onboarding
  if (!usuario.onboarding_completo && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}

function AppLayout({ children }) {
  return (
    <>
      <CountdownBar />
      {children}
      <BottomTabBar />
      <DevPanel />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/definir-senha" element={<DefinirSenha />} />

      {/* Onboarding (sem tab bar) */}
      <Route path="/onboarding" element={
        <ProtectedRoute><Onboarding /></ProtectedRoute>
      } />

      {/* Expiração (sem tab bar) */}
      <Route path="/acesso-expirado" element={<AcessoExpirado />} />

      {/* Conclusão (sem tab bar) */}
      <Route path="/conclusao" element={
        <ProtectedRoute><Conclusao /></ProtectedRoute>
      } />

      {/* Rotas com tab bar */}
      <Route path="/" element={
        <ProtectedRoute><AppLayout><Home /></AppLayout></ProtectedRoute>
      } />
      <Route path="/jornada" element={
        <ProtectedRoute><AppLayout><Jornada /></AppLayout></ProtectedRoute>
      } />
      <Route path="/jornada/:dia" element={
        <ProtectedRoute><AppLayout><DiaDaJornada /></AppLayout></ProtectedRoute>
      } />
      <Route path="/rosario" element={
        <ProtectedRoute><AppLayout><Rosario /></AppLayout></ProtectedRoute>
      } />
      <Route path="/comunidade" element={
        <ProtectedRoute><AppLayout><Comunidade /></AppLayout></ProtectedRoute>
      } />
      <Route path="/biblioteca" element={
        <ProtectedRoute><AppLayout><BibliotecaEspiritual /></AppLayout></ProtectedRoute>
      } />
      <Route path="/oracao-limpeza" element={
        <ProtectedRoute><AppLayout><OracaoLimpeza /></AppLayout></ProtectedRoute>
      } />
      <Route path="/loja" element={
        <ProtectedRoute><AppLayout><Loja /></AppLayout></ProtectedRoute>
      } />
      <Route path="/perfil" element={
        <ProtectedRoute><AppLayout><Perfil /></AppLayout></ProtectedRoute>
      } />
      <Route path="/consagracao-eterna" element={
        <ProtectedRoute><AppLayout><ConsagracaoEterna /></AppLayout></ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
