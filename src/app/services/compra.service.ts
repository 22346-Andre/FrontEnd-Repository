import api from './api';

export interface SugestaoCompraDTO {
  produtoId: number;
  produtoNome: string;
  quantidadeAtual: number;
  quantidadeMinima: number;
  quantidadeSugerida: number;
  fornecedorId: number;
  fornecedorNome: string;
  precoCusto: number;
  valorTotal: number;
}

export const compraService = {
  async obterSugestoes(): Promise<SugestaoCompraDTO[]> {
    const response = await api.get('/compras/sugestoes-whatsapp');
    return response.data;
  },
};
