import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { TrendingUp, Package, AlertCircle, DollarSign, Accessibility, Lock, CheckCircle, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { VoiceCommandsHelp } from '../components/voice-commands-help';
import { dashboardService } from '../services/dashboard.service';
import { produtoService, Produto } from '../services/produto.service';
import { toast } from 'sonner';

// A interface agora só precisa dos números reais, limpamos o curvaABC velho
interface DashboardStats {
  capitalImobilizado: number;
  giroEstoque: number;
  totalProdutos: number;
  produtosCriticos: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    capitalImobilizado: 0,
    giroEstoque: 0,
    totalProdutos: 0,
    produtosCriticos: 0
  });
  
  const [produtosBaixoEstoque, setProdutosBaixoEstoque] = useState<Produto[]>([]);
  const [todosProdutos, setTodosProdutos] = useState<Produto[]>([]); 
  const [loading, setLoading] = useState(true);
  const [acessoFinanceiroNegado, setAcessoFinanceiroNegado] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);

    try {
      const resumo = await dashboardService.obterResumo();
      setStats(resumo);
    } catch (error: any) {
      if (error.response && (error.response.status === 400 || error.response.status === 403)) {
        setAcessoFinanceiroNegado(true); 
      } else {
        toast.error('Erro ao carregar estatísticas financeiras.');
      }
    }

    try {
      const listaProdutos = await produtoService.listarTodos();
      setTodosProdutos(listaProdutos);
    } catch (error) {
      console.error("Não foi possível carregar a lista de produtos", error);
    }

    try {
      const produtosCriticos = await produtoService.listarCriticos();
      setProdutosBaixoEstoque(produtosCriticos);
    } catch (error) {
      // Silencioso
    }

    setLoading(false);
  };

  const formatarDadosGrafico = () => {
    if (todosProdutos.length === 0) return [];
    
    let totalA = 0;
    let totalB = 0;
    let totalC = 0;

    todosProdutos.forEach((p) => {
      // 🚨 Usamos a variável exata que alimenta a tabela
      const letra = p.classificacaoABC || '';
      if (letra === 'A') totalA++;
      if (letra === 'B') totalB++;
      if (letra === 'C') totalC++;
    });
    
    const totalGeral = totalA + totalB + totalC;
    if (totalGeral === 0) return [];

    return [
      { categoria: 'Classe A', porcentagem: Math.round((totalA / totalGeral) * 100), cor: '#10b981' },
      { categoria: 'Classe B', porcentagem: Math.round((totalB / totalGeral) * 100), cor: '#f59e0b' },
      { categoria: 'Classe C', porcentagem: Math.round((totalC / totalGeral) * 100), cor: '#ef4444' },
    ];
  };

  const curvaABCDataReal = formatarDadosGrafico();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Calculando inteligência financeira...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Visão geral e inteligência do seu estoque</p>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                <Accessibility className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-blue-900">Acessibilidade Ativada</h3>
                <p className="text-sm text-blue-700">
                  Use o microfone para comandos de voz ou ajuste o contraste.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <VoiceCommandsHelp />
              <Button variant="outline" size="sm" className="gap-2 bg-white" onClick={() => {
                window.dispatchEvent(new CustomEvent('open-accessibility-menu'));
              }}>
                <Accessibility className="h-4 w-4" />
                Menu de Acessibilidade
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-gray-700">Capital Imobilizado</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            {acessoFinanceiroNegado ? (
              <div className="flex items-center text-gray-400 mt-2">
                <Lock className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Acesso Restrito</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-black text-gray-900">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.capitalImobilizado)}
                </div>
                <p className="text-xs text-gray-500 font-medium mt-1">Valor total em prateleira</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-gray-700">Giro de Estoque</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            {acessoFinanceiroNegado ? (
              <div className="flex items-center text-gray-400 mt-2">
                <Lock className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Acesso Restrito</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-black text-gray-900">{stats.giroEstoque}x</div>
                <p className="text-xs text-gray-500 font-medium mt-1">Giro nos últimos 30 dias</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-gray-700">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-gray-900">{stats.totalProdutos}</div>
            <p className="text-xs text-gray-500 font-medium mt-1">Itens cadastrados</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-gray-700">Atenção Necessária</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-red-600">{stats.produtosCriticos}</div>
            <p className="text-xs text-gray-500 font-medium mt-1">Estoque crítico / baixo</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md border-t-4 border-t-indigo-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-900">
              <PieChart className="h-5 w-5" />
              Curva ABC - Peso Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent>
            {curvaABCDataReal.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={curvaABCDataReal}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="categoria" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value}% dos itens ativos`} />
                    <Bar dataKey="porcentagem" name="Porcentagem (%)" radius={[4, 4, 0, 0]}>
                      {curvaABCDataReal.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.cor} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500 shadow-sm" />
                    <span><strong>Classe A:</strong> Maior impacto no seu dinheiro</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-yellow-500 shadow-sm" />
                    <span><strong>Classe B:</strong> Impacto intermediário</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500 shadow-sm" />
                    <span><strong>Classe C:</strong> Menor impacto financeiro</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-gray-400 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                <PieChart className="h-12 w-12 text-gray-300 mb-3" />
                <p className="font-medium text-gray-500">Gráfico Indisponível</p>
                <p className="text-sm text-center max-w-xs mt-1">
                  Adicione preços de custo e quantidades aos seus produtos para gerar o gráfico.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md border-t-4 border-t-red-500">
          <CardHeader>
            <CardTitle className="text-red-900 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Estoque Crítico (Reposição Urgente)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
              {produtosBaixoEstoque.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                  <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-10 w-10 text-green-500" />
                  </div>
                  <p className="font-bold text-xl text-green-700">Tudo sob controle!</p>
                  <p className="text-sm mt-1">Nenhum produto atingiu o nível mínimo.</p>
                </div>
              ) : (
                produtosBaixoEstoque.map((produto) => (
                  <div
                    key={produto.id}
                    className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl transition-all hover:bg-red-100 hover:shadow-sm"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-sm text-red-900">{produto.nome}</p>
                      <p className="text-xs text-red-700 mt-1">
                        Estoque atual: <span className="font-black text-red-700 text-sm">{produto.quantidade}</span> | 
                        Mínimo exigido: <span className="font-medium">{produto.quantidadeMinima}</span>
                      </p>
                    </div>
                    <Link to={`/scanner`}>
                      <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-600 hover:text-white transition-colors">
                        Dar Entrada
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}