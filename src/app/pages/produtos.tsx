import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Plus, Search, Edit, Trash2, AlertCircle } from 'lucide-react';
import { produtoService, Produto, ProdutoDTO } from '../services/produto.service';
import { fornecedorService, Fornecedor } from '../services/fornecedor.service';
import { toast } from 'sonner';
import api from '../services/api';

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  
  const [searchParams] = useSearchParams();
  const [busca, setBusca] = useState(searchParams.get('q') || '');
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [dialogEditOpen, setDialogEditOpen] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);

  const [novoProduto, setNovoProduto] = useState<ProdutoDTO & { quantidade: number }>({
    nome: '',
    codigoBarras: '',
    quantidadeMinima: 0,
    quantidade: 0,
    precoVenda: 0,
    precoCusto: 0,
    categoria: '',
    fornecedorId: 0 
  });

  useEffect(() => {
    const queryVoz = searchParams.get('q');
    if (queryVoz !== null) {
      setBusca(queryVoz);
    }
  }, [searchParams]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [produtosData, fornecedoresData] = await Promise.all([
        produtoService.listarTodos(),
        fornecedorService.listarTodos()
      ]);
      setProdutos(produtosData);
      setFornecedores(fornecedoresData);
    } catch (error) {
      toast.error('Erro ao carregar produtos. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdicionarProduto = async () => {
    if (novoProduto.fornecedorId === 0 && fornecedores.length > 0) {
      toast.error('Por favor, selecione um Fornecedor!');
      return;
    }

    try {
      await produtoService.criar(novoProduto);
      toast.success('Produto adicionado com sucesso!');
      setDialogOpen(false);
      setNovoProduto({
        nome: '', codigoBarras: '', quantidadeMinima: 0, quantidade: 0, 
        precoVenda: 0, precoCusto: 0, categoria: '', 
        fornecedorId: fornecedores.length > 0 ? fornecedores[0].id : 0
      });
      carregarDados();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao adicionar produto');
    }
  };

  const handleSalvarEdicao = async () => {
    if (!produtoEditando) return;
    try {
      const dadosParaEnviar = {
        ...produtoEditando,
        quantidadeMinima: (produtoEditando as any).estoqueMinimo || produtoEditando.quantidadeMinima
      };
      await api.put(`/produtos/${produtoEditando.id}`, dadosParaEnviar);
      toast.success('Produto atualizado com sucesso!');
      setDialogEditOpen(false);
      carregarDados(); 
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao editar produto.');
    }
  };

  const handleExcluirProduto = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
    try {
      await produtoService.deletar(id);
      setProdutos(produtos.filter(p => p.id !== id));
      toast.success('Produto excluído com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir produto');
    }
  };

  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    produto.codigoBarras?.includes(busca)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Catálogo de Produtos</h1>
          <p className="text-gray-600">Gerencie todos os seus produtos</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Novo Produto</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Produto</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Nome</Label><Input value={novoProduto.nome} onChange={e => setNovoProduto({...novoProduto, nome: e.target.value})} /></div>
                <div className="space-y-2"><Label>Cód. Barras</Label><Input value={novoProduto.codigoBarras} onChange={e => setNovoProduto({...novoProduto, codigoBarras: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Categoria</Label><Input value={novoProduto.categoria} onChange={e => setNovoProduto({...novoProduto, categoria: e.target.value})} /></div>
                <div className="space-y-2">
                  <Label>Fornecedor</Label>
                  <select className="w-full px-3 py-2 border rounded-md" value={novoProduto.fornecedorId} onChange={e => setNovoProduto({...novoProduto, fornecedorId: Number(e.target.value)})}>
                    <option value={0}>Selecione um fornecedor</option>
                    {fornecedores.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Qtd Inicial</Label><Input type="number" value={novoProduto.quantidade} onChange={e => setNovoProduto({...novoProduto, quantidade: Number(e.target.value)})} /></div>
                <div className="space-y-2"><Label>Qtd Mínima</Label><Input type="number" value={novoProduto.quantidadeMinima} onChange={e => setNovoProduto({...novoProduto, quantidadeMinima: Number(e.target.value)})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Preço Custo (R$)</Label><Input type="number" step="0.01" value={novoProduto.precoCusto} onChange={e => setNovoProduto({...novoProduto, precoCusto: Number(e.target.value)})} /></div>
                <div className="space-y-2"><Label>Preço Venda (R$)</Label><Input type="number" step="0.01" value={novoProduto.precoVenda} onChange={e => setNovoProduto({...novoProduto, precoVenda: Number(e.target.value)})} /></div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleAdicionarProduto}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={dialogEditOpen} onOpenChange={setDialogEditOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Editar Produto</DialogTitle></DialogHeader>
            {produtoEditando && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Nome</Label><Input value={produtoEditando.nome} onChange={e => setProdutoEditando({...produtoEditando, nome: e.target.value})} /></div>
                  <div className="space-y-2"><Label>Cód. Barras</Label><Input value={produtoEditando.codigoBarras || ''} onChange={e => setProdutoEditando({...produtoEditando, codigoBarras: e.target.value})} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Categoria</Label><Input value={produtoEditando.categoria || ''} onChange={e => setProdutoEditando({...produtoEditando, categoria: e.target.value})} /></div>
                  <div className="space-y-2"><Label>Estoque Mínimo</Label><Input type="number" value={(produtoEditando as any).estoqueMinimo || produtoEditando.quantidadeMinima} onChange={e => setProdutoEditando({...produtoEditando, quantidadeMinima: Number(e.target.value), estoqueMinimo: Number(e.target.value)} as any)} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Preço Custo (R$)</Label><Input type="number" step="0.01" value={produtoEditando.precoCusto} onChange={e => setProdutoEditando({...produtoEditando, precoCusto: Number(e.target.value)})} /></div>
                  <div className="space-y-2"><Label>Preço Venda (R$)</Label><Input type="number" step="0.01" value={produtoEditando.precoVenda} onChange={e => setProdutoEditando({...produtoEditando, precoVenda: Number(e.target.value)})} /></div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogEditOpen(false)}>Cancelar</Button>
              <Button onClick={handleSalvarEdicao}>Salvar Alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Buscar por nome ou código de barras..." value={busca} onChange={(e) => setBusca(e.target.value)} className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Código de Barras</TableHead>
                <TableHead>Categoria</TableHead>
                {/* 🚨 NOVA COLUNA: Curva ABC */}
                <TableHead className="text-center">Curva ABC</TableHead>
                <TableHead className="text-right">Quantidade</TableHead>
                <TableHead className="text-right">Preço Venda</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {produtosFiltrados.map((produto) => {
                const estoqueBaixo = produto.quantidade < produto.quantidadeMinima;
                return (
                  <TableRow key={produto.id}>
                    <TableCell>
                      <div className="flex items-center gap-2" title={estoqueBaixo ? "Estoque abaixo do mínimo!" : undefined}>
                        {estoqueBaixo && <AlertCircle className="h-4 w-4 text-red-500" />}
                        <span className="font-medium">{produto.nome}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{produto.codigoBarras || '-'}</TableCell>
                    <TableCell>{produto.categoria || '-'}</TableCell>
                    
                    {/* 🚨 A MÁGICA VISUAL DA CURVA ABC */}
                    <TableCell className="text-center">
                      {produto.classificacaoABC === 'A' && (
                        <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-800 border border-green-200">
                          Classe A
                        </span>
                      )}
                      {produto.classificacaoABC === 'B' && (
                        <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-yellow-100 text-yellow-800 border border-yellow-200">
                          Classe B
                        </span>
                      )}
                      {produto.classificacaoABC === 'C' && (
                        <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
                          Classe C
                        </span>
                      )}
                      {!produto.classificacaoABC && (
                        <span className="text-[10px] text-gray-400 italic">Em análise</span>
                      )}
                    </TableCell>

                    <TableCell className={`text-right ${estoqueBaixo ? 'text-red-600 font-bold' : ''}`}>{produto.quantidade || 0}</TableCell>
                    <TableCell className="text-right">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.precoVenda || 0)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => { setProdutoEditando(produto); setDialogEditOpen(true); }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleExcluirProduto(produto.id)} className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {produtosFiltrados.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-600">Nenhum produto encontrado.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}