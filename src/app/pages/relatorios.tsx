import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { FileText, Download, BarChart3, Package, Calendar, TrendingUp, CheckCircle2 } from 'lucide-react';
import { relatorioService } from '../services/relatorio.service';
import { toast } from 'sonner';

interface Relatorio {
  id: string;
  titulo: string;
  descricao: string;
  icone: any;
  tipo: string;
  cor: string;
  metodo: () => Promise<void>;
}

export default function Relatorios() {
  const [gerando, setGerando] = useState<string | null>(null);

  const relatorios: Relatorio[] = [
    {
      id: '1',
      titulo: 'Relatório de Balanço Geral',
      descricao: 'Lista completa com todos os produtos, quantidades, valores e fornecedores',
      icone: Package,
      tipo: 'balanco',
      cor: 'blue',
      metodo: relatorioService.downloadBalancoPdf
    },
    {
      id: '2',
      titulo: 'Histórico de Movimentações',
      descricao: 'Todas as entradas e saídas de estoque do período selecionado',
      icone: FileText,
      tipo: 'movimentacoes',
      cor: 'green',
      metodo: relatorioService.downloadMovimentacoesPdf
    },
    {
      id: '3',
      titulo: 'Inventário Fiscal',
      descricao: 'Relatório completo para prestação de contas e auditorias fiscais',
      icone: BarChart3,
      tipo: 'inventario',
      cor: 'purple',
      metodo: relatorioService.downloadInventarioPdf
    }
  ];

  const handleGerarRelatorio = async (relatorio: Relatorio) => {
    setGerando(relatorio.tipo);
    
    try {
      await relatorio.metodo();
      
      toast.success(`📄 Relatório "${relatorio.titulo}" gerado com sucesso!`, {
        description: 'O download começará automaticamente.'
      });
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setGerando(null);
    }
  };

  const getCorClasses = (cor: string) => {
    const cores: { [key: string]: { bg: string; icon: string; border: string } } = {
      blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-200' },
      purple: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-200' },
      red: { bg: 'bg-red-50', icon: 'text-red-600', border: 'border-red-200' },
      orange: { bg: 'bg-orange-50', icon: 'text-orange-600', border: 'border-orange-200' },
      green: { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-200' },
      emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-200' }
    };
    return cores[cor] || cores.blue;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Central de Relatórios</h1>
        <p className="text-gray-600">Exporte relatórios completos em PDF</p>
      </div>

      {/* Cards de Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Relatórios Disponíveis</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{relatorios.length}</div>
            <p className="text-xs text-gray-600">Tipos de relatórios</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Download Automático</CardTitle>
            <Download className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PDF</div>
            <p className="text-xs text-gray-600">Formato profissional</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Geração</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Instantânea</div>
            <p className="text-xs text-gray-600">Em tempo real</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dados Atualizados</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-gray-600">Informações reais</p>
          </CardContent>
        </Card>
      </div>

      {/* Grid de Relatórios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatorios.map((relatorio) => {
          const cores = getCorClasses(relatorio.cor);
          const Icone = relatorio.icone;
          const estaGerando = gerando === relatorio.tipo;

          return (
            <Card key={relatorio.id} className={`${cores.bg} ${cores.border} border-2 hover:shadow-lg transition-shadow`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`h-12 w-12 rounded-lg ${cores.bg} border-2 ${cores.border} flex items-center justify-center`}>
                    <Icone className={`h-6 w-6 ${cores.icon}`} />
                  </div>
                  <FileText className={`h-5 w-5 ${cores.icon} opacity-50`} />
                </div>
                <CardTitle className="mt-4">{relatorio.titulo}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 min-h-[40px]">
                  {relatorio.descricao}
                </p>
                
                <Button
                  onClick={() => handleGerarRelatorio(relatorio)}
                  disabled={estaGerando}
                  className="w-full gap-2"
                  variant={estaGerando ? "secondary" : "default"}
                >
                  {estaGerando ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Baixar PDF
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Informações sobre os Relatórios */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Sobre os Relatórios</h3>
              <div className="space-y-1 text-sm text-gray-700">
                <p>✅ <strong>Formato:</strong> Todos os relatórios são gerados em PDF profissional</p>
                <p>✅ <strong>Dados em tempo real:</strong> Informações sempre atualizadas do seu estoque</p>
                <p>✅ <strong>Exportação rápida:</strong> Geração instantânea com um clique</p>
                <p>✅ <strong>Histórico completo:</strong> Acesse movimentações de qualquer período</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dica de Uso */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="text-2xl">💡</div>
            <div>
              <h3 className="font-semibold mb-2">Dica: Use relatórios para:</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• <strong>Auditorias:</strong> Relatório Completo de Estoque</li>
                <li>• <strong>Planejamento de Compras:</strong> Curva ABC e Estoque Baixo</li>
                <li>• <strong>Prestação de contas:</strong> Relatório Financeiro</li>
                <li>• <strong>Controle de qualidade:</strong> Relatório de Validade</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}