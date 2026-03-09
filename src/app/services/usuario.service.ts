import api from './api';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: string;
  ativo: boolean;
}

export interface UsuarioDTO {
  nome: string;
  email: string;
  senha: string;
  role: string;
}

export const usuarioService = {
  async listarTodos(): Promise<Usuario[]> {
    const response = await api.get('/usuarios');
    return response.data;
  },

  async buscarPorId(id: number): Promise<Usuario> {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  async criar(usuario: UsuarioDTO): Promise<Usuario> {
    const response = await api.post('/usuarios', usuario);
    return response.data;
  },

  async atualizar(id: number, usuario: UsuarioDTO): Promise<Usuario> {
    const response = await api.put(`/usuarios/${id}`, usuario);
    return response.data;
  },

  async deletar(id: number): Promise<void> {
    await api.delete(`/usuarios/${id}`);
  },
};
