import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api'; // 🚀 O nosso carteiro!

export default function Importacao() {
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null);
  const [importando, setImportando] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.xml'))) {
      setArquivoSelecionado(file);
    } else {
      toast.error('Por favor, selecione um arquivo CSV ou XML válido');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArquivoSelecionado(file);
    }
  };

  // 🚀 AQUI ACONTECE A MAGIA REAL - LIGAÇÃO AO JAVA
  const handleImportar = async () => {
    if (!arquivoSelecionado) {
      toast.error('Por favor, selecione um arquivo primeiro');
      return;
    }

    setImportando(true);

    try {
      // 1. Cria o pacote com o ficheiro para enviar
      const formData = new FormData();
      formData.append('ficheiro', arquivoSelecionado);

      // 2. Manda para a nossa porta real no Java
      const response = await api.post('/importacao/produtos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // 3. Mostra o relatório que o Java gerou!
      toast.success('Importação Finalizada!', {
        description: response.data,
        duration: 8000 // Mantém a notificação visível mais tempo
      });
      
      handleRemoverArquivo();
      
    } catch (error: any) {
      console.error('Erro na importação:', error);
      const msgErro = error.response?.data || 'Erro ao processar o arquivo no servidor. Verifique o formato do CSV.';
      toast.error('Falha na Importação', { description: msgErro });
    } finally {
      setImportando(false);
    }
  };

  const handleRemoverArquivo = () => {
    setArquivoSelecionado(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Central de Importação</h1>
        <p className="text-gray-600">Importe produtos em massa via CSV ou XML</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload de Arquivo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                dragOver
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Upload className={`h-16 w-16 mx-auto mb-4 ${dragOver ? 'text-blue-500' : 'text-gray-400'}`} />
              <p className="text-lg font-medium mb-2">
                Arraste seu arquivo CSV ou XML aqui
              </p>
              <p className="text-sm text-gray-600 mb-4">
                ou clique no botão abaixo para selecionar
              </p>
              <input
                ref={inputRef}
                type="file"
                accept=".csv,.xml"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                onClick={() => inputRef.current?.click()}
                variant="outline"
              >
                Selecionar Arquivo
              </Button>
            </div>

            {arquivoSelecionado && (
              <div className="bg-gray-50 border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-medium">{arquivoSelecionado.name}</p>
                      <p className="text-sm text-gray-600">
                        {(arquivoSelecionado.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleRemoverArquivo}
                    className="text-red-600"
                  >
                    Remover
                  </Button>
                </div>
              </div>
            )}

            <Button
              onClick={handleImportar}
              disabled={!arquivoSelecionado || importando}
              className="w-full"
              size="lg"
            >
              {importando ? 'A enviar e processar no Servidor...' : 'Iniciar Importação'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instruções de Importação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Formato CSV Aceito:</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
                <div className="text-blue-300">nome;descricao;codigoBarras;categoria;precoCusto;precoVenda;quantidade;quantidadeMinima;ncm;unidade;fornecedorId</div>
                <div>Arroz 5kg;Saco de arroz;789123;Alimentos;22.50;28.90;50;10;12345;UN;</div>
                <div>Feijão 1kg;Feijao preto;789124;Alimentos;7.20;9.90;30;5;12346;UN;</div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium mb-2 text-blue-900">Dicas Importantes:</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Certifique-se de usar o separador <strong>Ponto e Vírgula (;)</strong></li>
                <li>Use ponto (.) como separador decimal (Ex: 19.50)</li>
                <li>Se o produto já existir (mesmo nome), o sistema somará o estoque e atualizará os preços.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}