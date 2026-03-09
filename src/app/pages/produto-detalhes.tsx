import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { ArrowLeft, TrendingDown, TrendingUp, Package, ShoppingCart, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '../services/api';
import { toast } from 'sonner';

export default function ProdutoDetalhes() {
  const { id } = useParams();
  const [produto, setProduto] = useState<any>(null);
  const [movimentacoes, setMovimentacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🚨 ESTADOS PARA EDITAR O PRODUTO
  const [dialogEditOpen, setDialogEditOpen] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<any>(null);

  useEffect(() => {
    carregarDados();
  }, [id]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const resProduto = await api.get(`/produtos/${id}`);
      setProduto(resProduto.data);
      try {
        const resMov = await api.get(`/movimentacoes/produto/${id}`);
        setMovimentacoes(resMov.data);
      } catch (e) {
        console.log("Histórico vazio assumido.");
      }
    } catch (error) {
      toast.error("Erro ao carregar os detalhes do produto.");
    } finally {
      setLoading(false);
    }
  };

  const handleSalvarEdicao = async () => {
    try {
      const dadosParaEnviar = {
        ...produtoEditando,
        quantidadeMinima: produtoEditando.estoqueMinimo || produtoEditando.quantidadeMinima
      };
      const response = await api.put(`/produtos/${id}`, dadosParaEnviar);
      setProduto(response.data);
      setDialogEditOpen(false);
      toast.success('Produto atualizado com sucesso!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao editar produto.');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  if (!produto) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Produto não encontrado no Banco de Dados</p>
        <Link to="/produtos"><Button className="mt-4">Voltar para Produtos</Button></Link>
      </div>
    );
  }

  const precoCusto = produto.precoCusto || 0;
  const precoVenda = produto.precoVenda || 0;
  const quantidade = produto.quantidade || 0;
  const valorTotalEstoque = quantidade * precoCusto;
  const margemLucro = precoCusto > 0 ? (((precoVenda - precoCusto) / precoCusto) * 100).toFixed(1) : '100.0';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/produtos"><Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <div><h1 className="text-3xl font-bold">{produto.nome}</h1><p className="text-gray-600">Detalhes e Movimentações</p></div>
        </div>
        {/* 🚨 BOTÃO DE EDITAR PRODUTO */}
        <Button onClick={() => { setProdutoEditando(produto); setDialogEditOpen(true); }} className="gap-2">
          <Edit className="h-4 w-4" /> Editar Produto
        </Button>
      </div>

      {/* 🚨 MODAL DE EDIÇÃO */}
      <Dialog open={dialogEditOpen} onOpenChange={setDialogEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Editar Informações</DialogTitle></DialogHeader>
          {produtoEditando && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2 col-span-2"><Label>Nome do Produto</Label><Input value={produtoEditando.nome} onChange={e => setProdutoEditando({...produtoEditando, nome: e.target.value})} /></div>
              <div className="space-y-2"><Label>Categoria</Label><Input value={produtoEditando.categoria || ''} onChange={e => setProdutoEditando({...produtoEditando, categoria: e.target.value})} /></div>
              <div className="space-y-2"><Label>Código de Barras</Label><Input value={produtoEditando.codigoBarras || ''} onChange={e => setProdutoEditando({...produtoEditando, codigoBarras: e.target.value})} /></div>
              <div className="space-y-2"><Label>Preço de Custo (R$)</Label><Input type="number" step="0.01" value={produtoEditando.precoCusto} onChange={e => setProdutoEditando({...produtoEditando, precoCusto: parseFloat(e.target.value)})} /></div>
              <div className="space-y-2"><Label>Preço de Venda (R$)</Label><Input type="number" step="0.01" value={produtoEditando.precoVenda} onChange={e => setProdutoEditando({...produtoEditando, precoVenda: parseFloat(e.target.value)})} /></div>
              <div className="space-y-2"><Label>Estoque Mínimo</Label><Input type="number" value={produtoEditando.estoqueMinimo || produtoEditando.quantidadeMinima} onChange={e => setProdutoEditando({...produtoEditando, estoqueMinimo: parseInt(e.target.value), quantidadeMinima: parseInt(e.target.value)})} /></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setDialogEditOpen(false)}>Cancelar</Button><Button onClick={handleSalvarEdicao}>Salvar</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Informações do Produto</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div><p className="text-sm text-gray-600">Código de Barras</p><p className="font-mono text-lg">{produto.codigoBarras || '-'}</p></div>
                <div><p className="text-sm text-gray-600">Categoria</p><p className="font-medium">{produto.categoria || '-'}</p></div>
                <div><p className="text-sm text-gray-600">Fornecedor</p><p className="font-medium">{produto.fornecedor?.nome || 'Nenhum'}</p></div>
              </div>
              <div className="space-y-4">
                <div><p className="text-sm text-gray-600">Quantidade Atual</p><p className="text-3xl font-bold text-blue-600">{quantidade}</p></div>
                <div><p className="text-sm text-gray-600">Estoque Mínimo</p><p className="text-lg font-medium">{produto.estoqueMinimo || produto.quantidadeMinima}</p></div>
                <div><p className="text-sm text-gray-600">Preço Venda</p><p className="text-lg font-medium">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(precoVenda)}</p></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Valor em Estoque</CardTitle><Package className="h-4 w-4 text-blue-600" /></CardHeader><CardContent><div className="text-2xl font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorTotalEstoque)}</div></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Margem de Lucro</CardTitle><ShoppingCart className="h-4 w-4 text-green-600" /></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{margemLucro}%</div></CardContent></Card>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Histórico de Movimentações</CardTitle></CardHeader>
        <CardContent>
          {movimentacoes.length === 0 ? <div className="text-center py-8 text-gray-600">Nenhuma movimentação registrada.</div> : (
            <Table>
              <TableHeader><TableRow><TableHead>Data/Hora</TableHead><TableHead>Tipo</TableHead><TableHead>Qtd</TableHead></TableRow></TableHeader>
              <TableBody>
                {movimentacoes.map(mov => (
                  <TableRow key={mov.id}>
                    <TableCell>{format(new Date(mov.dataMovimentacao), "dd/MM/yyyy HH:mm", { locale: ptBR })}</TableCell>
                    <TableCell>{mov.tipo === 'ENTRADA' ? <span className="text-green-600">Entrada</span> : <span className="text-red-600">Saída</span>}</TableCell>
                    <TableCell className="font-medium">{mov.quantidade}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}