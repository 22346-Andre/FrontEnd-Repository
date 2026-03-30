import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'; 
import { ArrowLeft, Package, ShoppingCart, Edit, FileText, AlertTriangle, ArrowRightLeft, Scale, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '../services/api';
import { toast } from 'sonner';
import { produtoService } from '../services/produto.service';

export default function ProdutoDetalhes() {
  const { id } = useParams();
  const [produto, setProduto] = useState<any>(null);
  const [movimentacoes, setMovimentacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [dialogEditOpen, setDialogEditOpen] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<any>(null);

  const [dialogPerdaOpen, setDialogPerdaOpen] = useState(false);
  const [perdaQuantidade, setPerdaQuantidade] = useState<string>('');
  const [perdaMotivo, setPerdaMotivo] = useState<string>('');

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

  const handleRegistrarPerda = async () => {
    const qtd = Number(perdaQuantidade);
    if (!qtd || qtd <= 0) {
      toast.error('Informe uma quantidade válida superior a zero.');
      return;
    }
    if (qtd > produto.quantidade) {
      toast.error(`Você não pode relatar uma perda maior que o estoque atual (${produto.quantidade}).`);
      return;
    }
    if (!perdaMotivo.trim()) {
      toast.error('Por favor, informe o motivo da perda (ex: Vencimento, Avaria).');
      return;
    }

    try {
      await produtoService.registrarSaida(Number(id), {
        quantidadeDesejada: qtd,
        tipo: 'QUEBRA_PERDA',
        motivo: perdaMotivo
      });

      toast.success('Quebra/Perda registada com sucesso!');
      setDialogPerdaOpen(false);
      setPerdaQuantidade('');
      setPerdaMotivo('');
      
      carregarDados();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao registar perda.');
    }
  };

  // 🟢 Função para baixar o PDF da NF-e
  const handleBaixarNF = async (movId: number) => {
    try {
      toast.loading("A gerar Documento Fiscal...", { id: 'nf' });
      const response = await api.get(`/relatorios/danfe/${movId}/pdf`, { responseType: 'blob' });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `NF_Operacao_${movId}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      toast.success("Documento baixado com sucesso!", { id: 'nf' });
    } catch (error) {
      toast.error("Erro ao gerar a Nota Fiscal.", { id: 'nf' });
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

  const renderBadgeMovimentacao = (tipo: string) => {
    switch (tipo) {
      case 'ENTRADA': return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">ENTRADA</span>;
      case 'SAIDA': return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">SAÍDA</span>;
      case 'DEVOLUCAO': return <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><ArrowRightLeft className="w-3 h-3"/> DEVOLUÇÃO</span>;
      case 'QUEBRA_PERDA': return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> PERDA</span>;
      case 'AJUSTE_INVENTARIO': return <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-bold">AJUSTE</span>;
      default: return <span>{tipo}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/produtos"><Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              {produto.nome}
              {produto.finalidadeEstoque === 'USO_INTERNO' && <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-md uppercase">Uso Interno</span>}
            </h1>
            <p className="text-gray-600">Detalhes do Estoque</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="destructive" onClick={() => setDialogPerdaOpen(true)} className="gap-2 bg-red-600 hover:bg-red-700">
            <AlertTriangle className="h-4 w-4" /> Registar Perda
          </Button>

          <Button onClick={() => { setProdutoEditando(produto); setDialogEditOpen(true); }} className="gap-2">
            <Edit className="h-4 w-4" /> Editar Produto
          </Button>
        </div>
      </div>

      <Dialog open={dialogPerdaOpen} onOpenChange={setDialogPerdaOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" /> Registar Quebra / Perda
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm border border-red-200">
              Esta ação irá abater os itens do seu stock atual (Saldo: <strong>{produto.quantidade}</strong>) e enviará o custo para o relatório de perdas financeiras.
            </div>
            <div className="space-y-2">
              <Label>Quantidade Perdida</Label>
              <Input type="number" placeholder="Ex: 2" value={perdaQuantidade} onChange={e => setPerdaQuantidade(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Motivo (Avaria, Validade, Furto, etc.)</Label>
              <Input placeholder="Ex: Produto rasgou na prateleira" value={perdaMotivo} onChange={e => setPerdaMotivo(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogPerdaOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleRegistrarPerda}>Confirmar Perda</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogEditOpen} onOpenChange={setDialogEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Editar Informações</DialogTitle></DialogHeader>
          {produtoEditando && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2 col-span-2"><Label>Nome do Produto</Label><Input value={produtoEditando.nome} onChange={e => setProdutoEditando({...produtoEditando, nome: e.target.value})} /></div>
              <div className="space-y-2"><Label>Categoria</Label><Input value={produtoEditando.categoria || ''} onChange={e => setProdutoEditando({...produtoEditando, categoria: e.target.value})} /></div>
              <div className="space-y-2"><Label>Código de Barras</Label><Input value={produtoEditando.codigoBarras || ''} onChange={e => setProdutoEditando({...produtoEditando, codigoBarras: e.target.value})} /></div>
              <div className="space-y-2"><Label>Preço de Custo (R$)</Label><Input type="number" step="0.01" value={produtoEditando.precoCusto} onChange={e => setProdutoEditando({...produtoEditando, precoCusto: parseFloat(e.target.value)})} /></div>
              <div className="space-y-2"><Label>Preço de Venda (R$)</Label><Input type="number" step="0.01" value={produtoEditando.precoVenda} onChange={e => setProdutoEditando({...produtoEditando, precoVenda: parseFloat(e.target.value)})} /></div>
              <div className="space-y-2"><Label>Estoque Mínimo</Label><Input type="number" value={produtoEditando.estoqueMinimo || produtoEditando.quantidadeMinima} onChange={e => setProdutoEditando({...produtoEditando, estoqueMinimo: parseInt(e.target.value), quantidadeMinima: parseInt(e.target.value)})} /></div>
              <div className="space-y-2"><Label>NCM</Label><Input value={produtoEditando.ncm || ''} onChange={e => setProdutoEditando({...produtoEditando, ncm: e.target.value})} /></div>
              <div className="space-y-2"><Label>CFOP</Label><Input value={produtoEditando.cfop || ''} onChange={e => setProdutoEditando({...produtoEditando, cfop: e.target.value})} /></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setDialogEditOpen(false)}>Cancelar</Button><Button onClick={handleSalvarEdicao}>Salvar</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="geral" className="flex items-center gap-2"><Package className="h-4 w-4"/> Visão Geral</TabsTrigger>
          <TabsTrigger value="fiscal" className="flex items-center gap-2"><Scale className="h-4 w-4"/> Fiscal e Tributos</TabsTrigger>
          <TabsTrigger value="historico" className="flex items-center gap-2"><Clock className="h-4 w-4"/> Movimentações</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader><CardTitle>Informações de Estoque</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-5">
                    <div><p className="text-sm text-gray-500 mb-1">Código de Barras</p><p className="font-mono text-lg bg-gray-50 p-2 rounded-md border inline-block">{produto.codigoBarras || 'Sem Código'}</p></div>
                    <div><p className="text-sm text-gray-500 mb-1">Categoria</p><p className="font-medium">{produto.categoria || 'Sem Categoria'}</p></div>
                    <div><p className="text-sm text-gray-500 mb-1">Fornecedor Principal</p><p className="font-medium text-blue-700">{produto.fornecedor?.nome || 'Nenhum fornecedor vinculado'}</p></div>
                  </div>
                  <div className="space-y-5">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <p className="text-sm text-blue-800 font-semibold mb-1">Quantidade Atual</p>
                      <p className="text-4xl font-black text-blue-600">{quantidade} <span className="text-base font-medium">{produto.unidade || 'UN'}</span></p>
                    </div>
                    <div className="flex gap-6">
                      <div><p className="text-sm text-gray-500 mb-1">Estoque Mínimo</p><p className="text-xl font-bold text-gray-700">{produto.estoqueMinimo || produto.quantidadeMinima}</p></div>
                      <div><p className="text-sm text-gray-500 mb-1">Preço Venda</p><p className="text-xl font-bold text-green-600">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(precoVenda)}</p></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Custo Médio Ponderado</CardTitle><Package className="h-4 w-4 text-gray-400" /></CardHeader><CardContent><div className="text-2xl font-bold text-gray-700">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(precoCusto)}</div><p className="text-xs text-gray-500 mt-1">Baseado nas compras</p></CardContent></Card>
              <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Valor Imobilizado (Estoque)</CardTitle><Package className="h-4 w-4 text-blue-600" /></CardHeader><CardContent><div className="text-2xl font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorTotalEstoque)}</div></CardContent></Card>
              <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Margem de Lucro</CardTitle><ShoppingCart className="h-4 w-4 text-green-600" /></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{margemLucro}%</div></CardContent></Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="fiscal">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Scale className="h-5 w-5 text-gray-600"/> Perfil Tributário do Produto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">NCM (Nomenclatura Comum)</p>
                  <p className="font-mono text-xl">{produto.ncm || 'Não informado'}</p>
                </div>
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">CFOP Padrão</p>
                  <p className="font-mono text-xl">{produto.cfop || 'Não informado'}</p>
                </div>
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Finalidade</p>
                  <p className="text-xl font-medium">{produto.finalidadeEstoque || 'REVENDA'}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4 border-b pb-2">Impostos Associados</h4>
                {(!produto.impostos || produto.impostos.length === 0) ? (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-md">
                    <p className="font-semibold flex items-center gap-2"><AlertTriangle className="h-4 w-4"/> Atenção: Produto Isento ou Sem Tributação Cadastrada</p>
                    <p className="text-sm mt-1">Se este produto for tributado, clique em "Editar Produto" para associar o ICMS, IPI, PIS ou COFINS.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Imposto</TableHead>
                        <TableHead>Esfera</TableHead>
                        <TableHead className="text-right">Alíquota (%)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {produto.impostos.map((imp: any, i: number) => (
                        <TableRow key={i}>
                          <TableCell className="font-bold text-gray-800">{imp.sigla}</TableCell>
                          <TableCell className="text-gray-600">{imp.esfera}</TableCell>
                          <TableCell className="text-right font-mono text-blue-600">{imp.aliquota.toFixed(2)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 🟢 AQUI ESTÁ A ABA DO HISTÓRICO COM A TABELA E O BOTÃO DE DOWNLOAD DA NF-E */}
        <TabsContent value="historico">
          <Card>
            <CardHeader><CardTitle>Registro de Movimentações (Auditoria)</CardTitle></CardHeader>
            <CardContent>
              {movimentacoes.length === 0 ? <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">O histórico de movimentações está vazio.</div> : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Motivo / Observação</TableHead>
                      <TableHead className="text-right">Qtd</TableHead>
                      <TableHead className="text-center">Ações</TableHead> {/* 🟢 Coluna de Ações */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movimentacoes.map(mov => (
                      <TableRow key={mov.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="whitespace-nowrap">{format(new Date(mov.dataMovimentacao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</TableCell>
                        <TableCell>{renderBadgeMovimentacao(mov.tipo)}</TableCell>
                        <TableCell className="text-gray-600 text-sm max-w-[300px] truncate" title={mov.motivo || mov.observacao}>
                          {mov.motivo || mov.observacao || '-'}
                        </TableCell>
                        <TableCell className="font-bold text-right text-gray-700">{mov.quantidade}</TableCell>
                        <TableCell className="text-center">
                          {/* 🟢 Botão de Download da NF (Ativo para todas as movimentações) */}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleBaixarNF(mov.id)}
                            title="Baixar Comprovante Fiscal"
                          >
                            <FileText className="h-4 w-4 text-blue-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}