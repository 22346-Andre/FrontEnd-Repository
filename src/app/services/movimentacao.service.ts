import api from './api';

export interface Movimentacao {
  id: number;
  tipo: 'ENTRADA' | 'SAIDA';
  quantidade: number;
  produtoNome: string;
  data: string;
  usuario: string;
}

export const movimentacaoService = {
  async listarTodas(): Promise<Movimentacao[]> {
    const response = await api.get('/movimentacoes');
    return response.data;
  },
};
