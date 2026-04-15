import axios from 'axios';
import { toast } from 'sonner';

// Configure a URL base da sua API Spring Boot
const API_BASE_URL = 'https://smartstock-backend-j7em.onrender.com'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🚨 A MÁGICA SILENCIOSA: Ignora o toast se for bloqueio nas estatísticas OU na lista de usuários
    const url = error.config?.url || '';
    const isRotaRestrita = url.includes('/estatisticas') || url.includes('/usuarios');
    const isAcessoNegado = error.response && (error.response.status === 400 || error.response.status === 403);
    
    if (isRotaRestrita && isAcessoNegado) {
      return Promise.reject(error); // Rejeita em silêncio sem mostrar o Toast!
    }

    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Token inválido ou expirado
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          toast.error('Sessão expirada. Faça login novamente.');
          window.location.href = '/login';
          break;
        case 403:
          toast.error('Você não tem permissão para realizar esta ação.');
          break;
        case 404:
          toast.error('Recurso não encontrado.');
          break;
        case 500:
          toast.error('Erro no servidor. Tente novamente mais tarde.');
          break;
        default:
          toast.error('Erro ao processar requisição.');
      }
    } else if (error.request) {
      toast.error('Não foi possível conectar ao servidor. Verifique sua conexão.');
    }
    return Promise.reject(error);
  }
);

export default api;