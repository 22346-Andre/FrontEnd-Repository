import api from './api';

export const importacaoService = {
  async importarLote(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('ficheiro', file);

    const response = await api.post('/api/importacao/lote', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};
