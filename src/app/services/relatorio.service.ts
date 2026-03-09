import api from './api';

export const relatorioService = {
  async downloadBalancoPdf(): Promise<void> {
    const response = await api.get('/api/relatorios/balanco/pdf', {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'balanco_estoque.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  async downloadMovimentacoesPdf(): Promise<void> {
    const response = await api.get('/api/relatorios/movimentacoes/pdf', {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'movimentacoes.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  async downloadInventarioPdf(): Promise<void> {
    const response = await api.get('/api/relatorios/inventario/pdf', {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'inventario_fiscal.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
