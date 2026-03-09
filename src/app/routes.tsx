// 🚨 CORREÇÃO 1: Importar SEMPRE do 'react-router-dom'
import { createBrowserRouter, Navigate } from 'react-router';
import { DashboardLayout } from './layouts/dashboard-layout';
import Login from './pages/login';
import Cadastro from './pages/cadastro';
import Dashboard from './pages/dashboard';
import Produtos from './pages/produtos';
import ProdutoDetalhes from './pages/produto-detalhes';
import Fornecedores from './pages/fornecedores';
import Importacao from './pages/importacao';
import Scanner from './pages/scanner';
import Configuracoes from './pages/configuracoes';
import SugestoesCompra from './pages/sugestoes-compra';
import Relatorios from './pages/relatorios';

import { ProtectedRoute } from './components/ProtectedRoute';

export const router = createBrowserRouter([
  // ==========================================
  // 🔓 ROTAS PÚBLICAS
  // ==========================================
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/cadastro',
    element: <Cadastro />
  },
  
  // ==========================================
  // 🔐 ROTAS PRIVADAS (A Catraca do Sistema)
  // ==========================================
  {
    // 🚨 CORREÇÃO 2: A catraca agora é a dona da rota principal '/'
    path: '/', 
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />, 
        children: [
          // Se o usuário aceder apenas a "localhost:5173/", vai direto para o Dashboard!
          {
            index: true,
            element: <Navigate to="/dashboard" replace />
          },
          {
            path: 'dashboard',
            element: <Dashboard />
          },
          {
            path: 'produtos',
            element: <Produtos />
          },
          {
            path: 'produtos/:id',
            element: <ProdutoDetalhes />
          },
          {
            path: 'fornecedores',
            element: <Fornecedores />
          },
          {
            path: 'importacao',
            element: <Importacao />
          },
          {
            path: 'scanner',
            element: <Scanner />
          },
          {
            path: 'sugestoes-compra',
            element: <SugestoesCompra />
          },
          {
            path: 'relatorios',
            element: <Relatorios />
          },
          {
            path: 'configuracoes',
            element: <Configuracoes />
          }
        ]
      }
    ]
  },

  // ==========================================
  // 🚫 ROTA DE ERRO (404 - Página não encontrada)
  // ==========================================
  {
    path: '*',
    element: (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 text-blue-500">404</h1>
          <p className="text-gray-400 mb-8 text-xl">Oops! Esta página não existe.</p>
          <a href="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
            Voltar para a Segurança
          </a>
        </div>
      </div>
    )
  }
]);