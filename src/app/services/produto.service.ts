import api from './api';

export interface Produto {
  id: number;
  nome: string;
  codigoBarras: string;
  categoria: string;
  precoCusto: number;
  precoVenda: number;
  quantidade: number;
  quantidadeMinima: number;
  fornecedorId: number;
  fornecedorNome?: string;
  classificacaoABC?: string;
}

export interface ProdutoDTO {
  nome: string;
  codigoBarras: string;
  categoria: string;
  precoCusto: number;
  precoVenda: number;
  quantidadeMinima: number;
  fornecedorId: number;
}

export interface LoteDTO {
  quantidade: number;
  dataValidade?: string;
  lote?: string;
}

export interface SaidaDTO {
  quantidadeDesejada: number;
}

export const produtoService = {
  async listarTodos(): Promise<Produto[]> {
    const response = await api.get('/produtos');
    return response.data;
  },

  async buscarPorId(id: number): Promise<Produto> {
    const response = await api.get(`/produtos/${id}`);
    return response.data;
  },

  async listarCriticos(): Promise<Produto[]> {
    const response = await api.get('/produtos/criticos');
    return response.data;
  },

  async buscarAvancada(params: {
    categoria?: string;
    precoMin?: number;
    precoMax?: number;
    dataInicio?: string;
  }): Promise<Produto[]> {
    const response = await api.get('/produtos/busca-avancada', { params });
    return response.data;
  },

  async criar(produto: ProdutoDTO): Promise<Produto> {
    const response = await api.post('/produtos', produto);
    return response.data;
  },

  async atualizar(id: number, produto: ProdutoDTO): Promise<Produto> {
    const response = await api.put(`/produtos/${id}`, produto);
    return response.data;
  },

  async deletar(id: number): Promise<void> {
    await api.delete(`/produtos/${id}`);
  },

  async adicionarLote(id: number, lote: LoteDTO): Promise<Produto> {
    const response = await api.post(`/produtos/${id}/lotes`, lote);
    return response.data;
  },

  async registrarSaida(id: number, saida: SaidaDTO): Promise<string> {
    const response = await api.post(`/produtos/${id}/saida`, saida);
    return response.data;
  },
};
