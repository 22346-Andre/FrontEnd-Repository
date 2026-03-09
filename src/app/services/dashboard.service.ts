import api from './api';

export const dashboardService = {
  // Puxa as 4 caixas principais do topo do Dashboard
  async obterResumo() {
    const response = await api.get('/estatisticas');
    return {
      capitalImobilizado: response.data.capitalImobilizado || 0,
      giroEstoque: response.data.giroEstoque || 0,
      totalProdutos: response.data.totalProdutos || 0,
      produtosCriticos: response.data.produtosCriticos || 0,
    };
  },

  // Puxa os dados para montar o gráfico da Curva ABC
  async obterGrafico() {
    const response = await api.get('/estatisticas');
    const curva = response.data.curvaABC || [];
    
    const categorias = ['A', 'B', 'C'];
    const dadosGrafico = categorias.map(cat => {
      const itens = curva.filter((c: any) => c.classe === cat);
      return {
        categoria: `Classe ${cat}`,
        porcentagem: curva.length > 0 ? (itens.length / curva.length) * 100 : 0
      };
    });

    return dadosGrafico;
  }
};