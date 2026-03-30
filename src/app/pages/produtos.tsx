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
import { produtoService, Produto, ProdutoDTO, Imposto } from '../services/produto.service'; // 🟢 Import do Imposto
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

  // 🟢 NOVO: O estado inicial agora inclui os campos fiscais vazios para evitar bugs
  const estadoInicialProduto = {
    nome: '',
    codigoBarras: '',
    quantidadeMinima: 0,
    quantidade: 0,
    precoVenda: 0,
    precoCusto: 0,
    categoria: '',
    fornecedorId: 0,
    ncm: '',
    cfop: '',
    finalidadeEstoque: 'REVENDA',
    impostos: [] as Imposto[]
  };

  const [novoProduto, setNovoProduto] = useState<ProdutoDTO & { quantidade: number }>(estadoInicialProduto);

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

  // --- 🟢 LÓGICA DE IMPOSTOS (CRIAR PRODUTO) ---
  const adicionarLinhaImpostoNovo = () => {
    setNovoProduto({
      ...novoProduto,
      impostos: [...(novoProduto.impostos || []), { sigla: '', esfera: 'Estadual', aliquota: 0 }]
    });
  };

  const atualizarImpostoNovo = (index: number, campo: string, valor: any) => {
    const novaLista = [...(novoProduto.impostos || [])];
    novaLista[index] = { ...novaLista[index], [campo]: valor };
    setNovoProduto({ ...novoProduto, impostos: novaLista });
  };

  const removerImpostoNovo = (index: number) => {
    const novaLista = (novoProduto.impostos || []).filter((_, i) => i !== index);
    setNovoProduto({ ...novoProduto, impostos: novaLista });
  };

  // --- 🟢 LÓGICA DE IMPOSTOS (EDITAR PRODUTO) ---
  const abrirModalEdicao = (produto: Produto) => {
    setProdutoEditando({
      ...produto,
      impostos: produto.impostos || [], // Garante que nunca fica indefinido
      finalidadeEstoque: produto.finalidadeEstoque || 'REVENDA'
    });
    setDialogEditOpen(true);
  };

  const adicionarLinhaImpostoEdit = () => {
    if (!produtoEditando) return;
    setProdutoEditando({
      ...produtoEditando,
      impostos: [...(produtoEditando.impostos || []), { sigla: '', esfera: 'Estadual', aliquota: 0 }]
    });
  };

  const atualizarImpostoEdit = (index: number, campo: string, valor: any) => {
    if (!produtoEditando) return;
    const novaLista = [...(produtoEditando.impostos || [])];
    novaLista[index] = { ...novaLista[index], [campo]: valor };
    setProdutoEditando({ ...produtoEditando, impostos: novaLista });
  };

  const removerImpostoEdit = (index: number) => {
    if (!produtoEditando) return;
    const novaLista = (produtoEditando.impostos || []).filter((_, i) => i !== index);
    setProdutoEditando({ ...produtoEditando, impostos: novaLista });
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
      setNovoProduto({ ...estadoInicialProduto, fornecedorId: fornecedores.length > 0 ? fornecedores[0].id : 0 });
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
          <p className="text-gray-600">Gerencie todos os seus produtos e tributações</p>
        </div>
        
        {/* --- MODAL DE CRIAR PRODUTO --- */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Novo Produto</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Produto</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h3 className="font-semibold text-gray-700 border-b pb-2">Informações Básicas</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Nome</Label><Input value={novoProduto.nome} onChange={e => setNovoProduto({...novoProduto, nome: e.target.value})} /></div>
                  <div className="space-y-2"><Label>Cód. Barras</Label><Input value={novoProduto.codigoBarras} onChange={e => setNovoProduto({...novoProduto, codigoBarras: e.target.value})} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Categoria</Label><Input value={novoProduto.categoria} onChange={e => setNovoProduto({...novoProduto, categoria: e.target.value})} /></div>
                  <div className="space-y-2">
                    <Label>Fornecedor</Label>
                    <select className="w-full px-3 py-2 border rounded-md bg-white" value={novoProduto.fornecedorId} onChange={e => setNovoProduto({...novoProduto, fornecedorId: Number(e.target.value)})}>
                      <option value={0}>Selecione um fornecedor</option>
                      {fornecedores.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <h3 className="font-semibold text-gray-700 border-b pb-2">Estoque e Preços</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2"><Label>Qtd Inicial</Label><Input type="number" value={novoProduto.quantidade} onChange={e => setNovoProduto({...novoProduto, quantidade: Number(e.target.value)})} /></div>
                  <div className="space-y-2"><Label>Qtd Mínima</Label><Input type="number" value={novoProduto.quantidadeMinima} onChange={e => setNovoProduto({...novoProduto, quantidadeMinima: Number(e.target.value)})} /></div>
                  <div className="space-y-2"><Label>Custo (R$)</Label><Input type="number" step="0.01" value={novoProduto.precoCusto} onChange={e => setNovoProduto({...novoProduto, precoCusto: Number(e.target.value)})} /></div>
                  <div className="space-y-2"><Label>Venda (R$)</Label><Input type="number" step="0.01" value={novoProduto.precoVenda} onChange={e => setNovoProduto({...novoProduto, precoVenda: Number(e.target.value)})} /></div>
                </div>
              </div>

              {/* 🟢 DADOS FISCAIS */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-4 border border-gray-200">
                <h3 className="font-semibold text-gray-700 border-b pb-2">Dados Fiscais e Tributação</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Finalidade do Estoque</Label>
                    <select className="w-full px-3 py-2 border rounded-md bg-white" value={novoProduto.finalidadeEstoque} onChange={e => setNovoProduto({ ...novoProduto, finalidadeEstoque: e.target.value })}>
                      <option value="REVENDA">Revenda</option>
                      <option value="USO_INTERNO">Uso Interno</option>
                      <option value="MATERIA_PRIMA">Matéria-Prima</option>
                    </select>
                  </div>
                  <div className="space-y-2"><Label>NCM</Label><Input placeholder="Ex: 84713012" value={novoProduto.ncm || ''} onChange={e => setNovoProduto({ ...novoProduto, ncm: e.target.value })} /></div>
                  <div className="space-y-2"><Label>CFOP</Label><Input placeholder="Ex: 5102" value={novoProduto.cfop || ''} onChange={e => setNovoProduto({ ...novoProduto, cfop: e.target.value })} /></div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-center mb-2">
                    <Label>Impostos Aplicáveis</Label>
                    <Button type="button" variant="outline" size="sm" onClick={adicionarLinhaImpostoNovo}>
                      <Plus className="h-4 w-4 mr-2" /> Adicionar Imposto
                    </Button>
                  </div>

                  {(novoProduto.impostos || []).map((imposto, index) => (
                    <div key={index} className="flex gap-2 items-center mt-2">
                      <Input placeholder="Sigla (Ex: ICMS)" className="w-1/3" value={imposto.sigla} onChange={e => atualizarImpostoNovo(index, 'sigla', e.target.value)} />
                      <select className="w-1/3 px-3 py-2 border rounded-md bg-white" value={imposto.esfera} onChange={e => atualizarImpostoNovo(index, 'esfera', e.target.value)}>
                        <option value="Estadual">Estadual</option>
                        <option value="Federal">Federal</option>
                        <option value="Municipal">Municipal</option>
                      </select>
                      <div className="relative w-1/3">
                        <Input type="number" placeholder="Alíquota" value={imposto.aliquota} onChange={e => atualizarImpostoNovo(index, 'aliquota', Number(e.target.value))} />
                        <span className="absolute right-3 top-2 text-gray-500">%</span>
                      </div>
                      <Button type="button" variant="ghost" className="text-red-500 p-2" onClick={() => removerImpostoNovo(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {(novoProduto.impostos?.length === 0) && <p className="text-xs text-gray-500 italic">Produto isento (nenhum imposto cadastrado).</p>}
                </div>
              </div>

            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleAdicionarProduto}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* --- MODAL DE EDITAR PRODUTO --- */}
        <Dialog open={dialogEditOpen} onOpenChange={setDialogEditOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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

                {/* 🟢 DADOS FISCAIS (EDIÇÃO) */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-4 border border-gray-200 mt-4">
                  <h3 className="font-semibold text-gray-700 border-b pb-2">Dados Fiscais e Tributação</h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Finalidade do Estoque</Label>
                      <select className="w-full px-3 py-2 border rounded-md bg-white" value={produtoEditando.finalidadeEstoque} onChange={e => setProdutoEditando({ ...produtoEditando, finalidadeEstoque: e.target.value })}>
                        <option value="REVENDA">Revenda</option>
                        <option value="USO_INTERNO">Uso Interno</option>
                        <option value="MATERIA_PRIMA">Matéria-Prima</option>
                      </select>
                    </div>
                    <div className="space-y-2"><Label>NCM</Label><Input placeholder="Ex: 84713012" value={produtoEditando.ncm || ''} onChange={e => setProdutoEditando({ ...produtoEditando, ncm: e.target.value })} /></div>
                    <div className="space-y-2"><Label>CFOP</Label><Input placeholder="Ex: 5102" value={produtoEditando.cfop || ''} onChange={e => setProdutoEditando({ ...produtoEditando, cfop: e.target.value })} /></div>
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between items-center mb-2">
                      <Label>Impostos Aplicáveis</Label>
                      <Button type="button" variant="outline" size="sm" onClick={adicionarLinhaImpostoEdit}>
                        <Plus className="h-4 w-4 mr-2" /> Adicionar Imposto
                      </Button>
                    </div>

                    {(produtoEditando.impostos || []).map((imposto, index) => (
                      <div key={index} className="flex gap-2 items-center mt-2">
                        <Input placeholder="Sigla (Ex: ICMS)" className="w-1/3" value={imposto.sigla} onChange={e => atualizarImpostoEdit(index, 'sigla', e.target.value)} />
                        <select className="w-1/3 px-3 py-2 border rounded-md bg-white" value={imposto.esfera} onChange={e => atualizarImpostoEdit(index, 'esfera', e.target.value)}>
                          <option value="Estadual">Estadual</option>
                          <option value="Federal">Federal</option>
                          <option value="Municipal">Municipal</option>
                        </select>
                        <div className="relative w-1/3">
                          <Input type="number" placeholder="Alíquota" value={imposto.aliquota} onChange={e => atualizarImpostoEdit(index, 'aliquota', Number(e.target.value))} />
                          <span className="absolute right-3 top-2 text-gray-500">%</span>
                        </div>
                        <Button type="button" variant="ghost" className="text-red-500 p-2" onClick={() => removerImpostoEdit(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
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
                        {/* 🟢 O onClick chama abrirModalEdicao para preparar os Impostos! */}
                        <Button size="sm" variant="outline" onClick={() => abrirModalEdicao(produto)}>
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