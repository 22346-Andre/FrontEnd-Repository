import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../contexts/auth-context';

export function ProtectedRoute() {
  // O Segurança escuta se o usuário está logado e se o sistema ainda está lendo o disco
  const { isAuthenticated, isLoading } = useAuth();

  // 1. Enquanto estiver lendo o disco, mostra uma tela de carregamento (A Paciência do Segurança)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 2. Terminou de carregar. Não tem o Token? Chuta pro login!
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Tem o Token? Libera a catraca para o Dashboard!
  return <Outlet />;
}