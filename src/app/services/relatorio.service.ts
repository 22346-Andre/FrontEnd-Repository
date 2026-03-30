import api from './api';

export const relatorioService = {
  // 🟢 Parâmetros opcionais mantidos
  async downloadBalancoPdf(dataInicio?: string, dataFim?: string): Promise<void> {
    const response = await api.get('/relatorios/balanco/pdf', { // 🟢 /api removido
      params: { dataInicio, dataFim },
      responseType: 'blob',
    });
    this.downloadArquivo(response.data, 'balanco_estoque.pdf');
  },

  async downloadMovimentacoesPdf(dataInicio?: string, dataFim?: string): Promise<void> {
    const response = await api.get('/relatorios/movimentacoes/pdf', { // 🟢 /api removido
      params: { dataInicio, dataFim },
      responseType: 'blob',
    });
    this.downloadArquivo(response.data, 'movimentacoes.pdf');
  },

  async downloadInventarioPdf(dataInicio?: string, dataFim?: string): Promise<void> {
    const response = await api.get('/relatorios/inventario/pdf', { // 🟢 /api removido
      params: { dataInicio, dataFim },
      responseType: 'blob',
    });
    this.downloadArquivo(response.data, 'inventario_fiscal.pdf');
  },

  async downloadPerdasPdf(dataInicio?: string, dataFim?: string): Promise<void> {
    const response = await api.get('/relatorios/perdas/pdf', { // 🟢 /api removido
      params: { dataInicio, dataFim },
      responseType: 'blob',
    });
    this.downloadArquivo(response.data, 'relatorio_perdas.pdf');
  },

  downloadArquivo(data: any, nomeArquivo: string) {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', nomeArquivo);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};