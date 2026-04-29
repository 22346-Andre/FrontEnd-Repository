import api from './api';

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  accessToken: string;
  token: string;
  expiresIn: number;
}

// ✅ INTERFACE ATUALIZADA: Agora os nomes batem 100% com o Java!
export interface RegistroEmpresaDTO {
  razaoSocial: string;
  nomeFantasia?: string;
  cnpj: string;
  emailContato?: string;
  telefoneEmpresa?: string;
  nomeDono: string;
  email: string;
  senha: string;
  telefoneAdmin?: string;
}

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  
  // 🚨 NOVO: Login com o Token do Google
  async loginComGoogle(googleToken: string) {
    const response = await api.post('/auth/login/google', { token: googleToken });
    return response.data;
  },

  async registrarEmpresa(data: RegistroEmpresaDTO): Promise<string> {
    const response = await api.post('/auth/registrar-empresa', data);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Busca os dados reais de quem acabou de logar
  async getMe() {
    const response = await api.get('/usuarios/me');
    return response.data;
  }
};