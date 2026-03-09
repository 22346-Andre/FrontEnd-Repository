import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Camera, Plus, Minus, Package, UploadCloud, FileCode, Trash2, Barcode, FileUp, CheckCircle, Info, Search } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { produtoService, Produto } from '../services/produto.service';

export default function ScannerPDV() {
  // --- ESTADOS DO CATÁLOGO E BUSCA ---
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [quantidadeMovimento, setQuantidadeMovimento] = useState<number>(1);
  const [inputBuscaFocado, setInputBuscaFocado] = useState(false);

  // --- ESTADOS DO SCANNER (CÂMERA E USB) ---
  const [codigoBarras, setCodigoBarras] = useState('');
  const [scannerAtivo, setScannerAtivo] = useState(false);
  const [ultimaAcao, setUltimaAcao] = useState<{ tipo: string; nome: string; timestamp: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- ESTADOS DO XML ---
  const [file, setFile] = useState<File | null>(null);
  const [loadingXml, setLoadingXml] = useState(false);
  const [resultados, setResultados] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Carrega os produtos ao abrir a tela
  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const data = await produtoService.listarTodos();
      setProdutos(data);
    } catch (error) {
      toast.error('Erro ao carregar catálogo de produtos.');
    }
  };

  // 2. Foco da Pistola USB: Só força o foco no input invisível se o usuário NÃO estiver digitando na busca manual
  useEffect(() => {
    if (inputRef.current && !scannerAtivo && !inputBuscaFocado) {
      inputRef.current.focus();
    }
  }, [scannerAtivo, codigoBarras, inputBuscaFocado]);

  // 3. Função central para quando um código é lido (Pistola ou Câmera)
  const processarCodigoLido = (codigo: string) => {
    const produtoEncontrado = produtos.find(p => p.codigoBarras === codigo);
    if (produtoEncontrado) {
      selecionarProduto(produtoEncontrado);
      toast.success(`Produto localizado: ${produtoEncontrado.nome}`);
    } else {
      toast.error(`Código ${codigo} não encontrado no sistema!`);
    }
    setCodigoBarras(''); // Limpa para a próxima leitura
  };

  // 4. A MÁGICA DA CÂMERA
  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    if (scannerAtivo) {
      scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: { width: 250, height: 150 } }, false);
      scanner.render(
        (decodedText) => {
          setScannerAtivo(false); 
          scanner?.clear();       
          processarCodigoLido(decodedText); // Envia para a inteligência
        },
        (error) => { /* Ignora erros de frame vazio */ }
      );
    }
    return () => {
      if (scanner) scanner.clear().catch(e => console.error("Erro ao limpar", e));
    };
  }, [scannerAtivo, produtos]);

  // 5. A PISTOLA FÍSICA (USB)
  const handleKeyDownPistola = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (codigoBarras.trim() === '') return;
      processarCodigoLido(codigoBarras.trim());
    }
  };

  // 6. BUSCA MANUAL (Filtro)
  const produtosFiltrados = produtos.filter(p => 
    p.nome.toLowerCase().includes(termoBusca.toLowerCase()) || 
    (p.codigoBarras && p.codigoBarras.includes(termoBusca))
  );

  const selecionarProduto = (produto: Produto) => {
    setProdutoSelecionado(produto);
    setTermoBusca(''); 
    setQuantidadeMovimento(1); 
  };

  // --- FUNÇÕES DE MOVIMENTAÇÃO (CAIXA EXPRESSO) ---
  const registrarEntrada = async () => {
    if (!produtoSelecionado) return;
    try {
      await produtoService.adicionarLote(produtoSelecionado.id, { quantidade: quantidadeMovimento });
      registrarSucesso('Entrada');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao registrar entrada.');
    }
  };

  const registrarSaida = async () => {
    if (!produtoSelecionado) return;
    if (quantidadeMovimento > produtoSelecionado.quantidade) {
      toast.error(`Estoque insuficiente! Saldo: ${produtoSelecionado.quantidade}`);
      return;
    }
    try {
      await produtoService.registrarSaida(produtoSelecionado.id, { quantidadeDesejada: quantidadeMovimento });
      registrarSucesso('Saída');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao registrar saída.');
    }
  };

  const registrarSucesso = (tipo: string) => {
    toast.success(`${quantidadeMovimento} unidade(s) de ${tipo} em ${produtoSelecionado?.nome}!`);
    setUltimaAcao({
      tipo: tipo,
      nome: produtoSelecionado!.nome,
      timestamp: new Date().toLocaleString('pt-BR')
    });
    setProdutoSelecionado(null);
    carregarProdutos();
  };

  // --- FUNÇÕES DO XML ---
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) validarEGuardarArquivo(e.dataTransfer.files[0]);
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) validarEGuardarArquivo(e.target.files[0]);
  };

  const validarEGuardarArquivo = (arquivo: File) => {
    if (!arquivo.name.toLowerCase().endsWith('.xml') && arquivo.type !== 'text/xml') {
      toast.error('Formato inválido! Envie apenas arquivos XML de Notas Fiscais.');
      return;
    }
    setFile(arquivo);
    setResultados([]); 
  };

  const handleProcessarXML = async () => {
    if (!file) return;
    try {
      setLoadingXml(true);
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/importacao/processar-xml', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResultados(response.data);
      toast.success("Nota Fiscal lida com 100% de precisão!");
    } catch (error: any) {
      toast.error(error.response?.data || "Erro de comunicação com o Servidor.");
    } finally {
      setLoadingXml(false);
    }
  };

  const confirmarImportacao = async () => {
    try {
      const toastId = toast.loading("Aguarde... Atualizando estoque.");
      await api.post('/importacao/salvar', resultados);
      toast.dismiss(toastId);
      toast.success(`${resultados.length} produtos adicionados ao estoque com sucesso!`);
      setResultados([]);
      setFile(null);
      carregarProdutos(); // Atualiza a lista da aba PDV
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.response?.data || "Erro ao salvar no banco de dados.");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Central de Importação e PDV</h1>
        <p className="text-gray-600">Registre movimentações (Leitor/Manual) ou dê entrada automática via NF-e (XML)</p>
      </div>

      <Tabs defaultValue="pdv" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mb-6">
          <TabsTrigger value="pdv" className="gap-2"><Barcode className="h-4 w-4" /> Leitor & Caixa (PDV)</TabsTrigger>
          <TabsTrigger value="xml" className="gap-2"><FileUp className="h-4 w-4" /> Importar NF-e (XML)</TabsTrigger>
        </TabsList>

        {/* ========================================================= */}
        {/* ABA 1: CAIXA / PDV (Busca Manual e Scanner) */}
        {/* ========================================================= */}
        <TabsContent value="pdv">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* LADO ESQUERDO: Busca Manual e Scanner */}
            <Card className="border-t-4 border-t-blue-600 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="h-5 w-5 text-blue-600" />
                  Buscar Produto
                </CardTitle>
                <CardDescription>Use o leitor, a câmera ou digite o nome</CardDescription>
              </CardHeader>
              <CardContent>
                
                {/* Input Invisível para a Pistola USB funcionar no fundo */}
                <input 
                  type="text" 
                  ref={inputRef} 
                  className="opacity-0 absolute w-0 h-0" 
                  value={codigoBarras} 
                  onChange={(e) => setCodigoBarras(e.target.value)} 
                  onKeyDown={handleKeyDownPistola}
                />

                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input 
                    placeholder="Ex: Arroz, Feijão, 78910..." 
                    className="pl-10 h-12 text-lg"
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                    onFocus={() => setInputBuscaFocado(true)}
                    onBlur={() => setInputBuscaFocado(false)}
                  />
                </div>

                {/* Lista de Resultados da Busca */}
                {termoBusca && (
                  <div className="border rounded-md max-h-64 overflow-y-auto bg-gray-50 mb-4">
                    {produtosFiltrados.length === 0 ? (
                      <p className="p-4 text-center text-gray-500">Nenhum produto encontrado.</p>
                    ) : (
                      produtosFiltrados.map((p) => (
                        <div key={p.id} onClick={() => selecionarProduto(p)} className="p-3 border-b hover:bg-blue-50 cursor-pointer flex justify-between items-center transition-colors">
                          <div>
                            <p className="font-semibold text-gray-800">{p.nome}</p>
                            <p className="text-xs text-gray-500">{p.codigoBarras || 'Sem código'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-700">{p.quantidade} un</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Área da Câmera Mobile */}
                {!termoBusca && (
                  <div className="min-h-[220px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 relative mt-4">
                    {scannerAtivo ? (
                      <div id="reader" className="w-full h-full"></div>
                    ) : (
                      <div className="text-center p-6 cursor-pointer w-full h-full hover:bg-gray-100 transition-colors flex flex-col items-center" onClick={() => setScannerAtivo(true)}>
                        <Camera className="h-16 w-16 mb-4 text-gray-400" />
                        <p className="text-gray-600 font-medium">Ativar Câmera Mobile</p>
                        <p className="text-sm text-gray-400 mt-2 max-w-[200px]">A pistola USB já está ativa automaticamente.</p>
                      </div>
                    )}
                  </div>
                )}

                {scannerAtivo && (
                   <Button variant="outline" className="w-full text-red-600 mt-4" onClick={() => setScannerAtivo(false)}>Cancelar Câmera</Button>
                )}
              </CardContent>
            </Card>

            {/* LADO DIREITO: Ação de Caixa Expresso */}
            <Card className={`shadow-md transition-all duration-300 ${produtoSelecionado ? 'border-t-4 border-t-green-500 ring-2 ring-green-100' : 'opacity-50 grayscale'}`}>
              <CardHeader className="pb-3 text-center">
                <CardTitle className="text-xl">Caixa Expresso</CardTitle>
                <CardDescription>
                  {produtoSelecionado ? 'Confirme a movimentação' : 'Aguardando bipe ou seleção...'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center pt-2">
                
                {produtoSelecionado ? (
                  <div className="w-full space-y-6">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                      <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <h3 className="text-xl font-bold text-gray-800">{produtoSelecionado.nome}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Estoque atual: <span className={`font-bold text-lg ${produtoSelecionado.quantidade <= produtoSelecionado.quantidadeMinima ? 'text-red-600' : 'text-green-600'}`}>{produtoSelecionado.quantidade}</span>
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label className="text-center font-semibold text-gray-700">Quantidade a movimentar</Label>
                      <div className="flex items-center justify-center gap-4">
                        <Button variant="outline" size="icon" onClick={() => setQuantidadeMovimento(Math.max(1, quantidadeMovimento - 1))}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input 
                          type="number" 
                          className="w-24 text-center text-xl font-bold h-12" 
                          value={quantidadeMovimento}
                          onChange={(e) => setQuantidadeMovimento(Number(e.target.value))}
                          min={1}
                        />
                        <Button variant="outline" size="icon" onClick={() => setQuantidadeMovimento(quantidadeMovimento + 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <Button onClick={registrarEntrada} className="h-14 bg-green-500 hover:bg-green-600 text-lg shadow-green-200 shadow-lg">
                        <Plus className="mr-2 h-5 w-5" /> Entrada
                      </Button>
                      <Button onClick={registrarSaida} className="h-14 bg-red-500 hover:bg-red-600 text-lg shadow-red-200 shadow-lg">
                        <Minus className="mr-2 h-5 w-5" /> Saída (Venda)
                      </Button>
                    </div>
                    
                    <Button variant="ghost" className="w-full text-gray-400" onClick={() => setProdutoSelecionado(null)}>
                      Cancelar Seleção
                    </Button>
                  </div>
                ) : (
                  <div className="py-10 flex flex-col items-center opacity-40">
                    <Barcode className="h-24 w-24 text-gray-800 mb-4" />
                    <p className="text-gray-800 font-medium">Bipe um produto para começar</p>
                  </div>
                )}

                {/* Histórico da Última Ação */}
                {!produtoSelecionado && ultimaAcao && (
                  <div className="w-full bg-gray-50 border rounded-lg p-4 mt-4">
                    <h3 className="font-medium mb-2 text-sm text-gray-500">Último Registro:</h3>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className={`font-bold ${ultimaAcao.tipo === 'Entrada' ? 'text-green-600' : 'text-red-600'}`}>{ultimaAcao.tipo}</span>
                        <p className="font-medium text-sm text-gray-700 mt-1">{ultimaAcao.nome}</p>
                      </div>
                      <span className="text-xs text-gray-400">{ultimaAcao.timestamp}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ========================================================= */}
        {/* ABA 2: IMPORTAÇÃO DE NF-e (XML) - INTACTA COMO VOCÊ FEZ */}
        {/* ========================================================= */}
        <TabsContent value="xml">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
              <CardHeader>
                <CardTitle>Enviar Documento Oficial</CardTitle>
                <CardDescription>Arraste o arquivo XML da Nota Fiscal (NF-e)</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-10">
                {!file ? (
                  <div className="w-full flex flex-col items-center cursor-pointer p-8" onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}>
                    <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center mb-6"><UploadCloud className="h-10 w-10 text-blue-600" /></div>
                    <h3 className="text-lg font-semibold text-gray-700">Clique ou arraste o seu XML</h3>
                    <p className="text-sm text-gray-500 mt-2">Apenas ficheiros terminados em .xml</p>
                  </div>
                ) : (
                  <div className="w-full flex flex-col items-center">
                    <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-6"><FileCode className="h-10 w-10 text-green-600" /></div>
                    <h3 className="text-lg font-semibold text-gray-700 max-w-full truncate px-4">{file.name}</h3>
                    <div className="flex gap-4 mt-8 w-full px-8">
                      <Button variant="outline" className="flex-1 text-red-600" onClick={() => { setFile(null); setResultados([]); }}><Trash2 className="h-4 w-4 mr-2" /> Remover</Button>
                      <Button className="flex-1" onClick={handleProcessarXML} disabled={loadingXml}>{loadingXml ? "A processar..." : "Ler NF-e Oficial"}</Button>
                    </div>
                  </div>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept=".xml, text/xml, application/xml" onChange={handleFileInput} />
              </CardContent>
            </Card>

            <Card className="bg-amber-50 border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800"><Info className="h-5 w-5" /> Dica para o Gestor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-amber-900">
                <p><strong>Por que usar o XML e não o PDF?</strong></p>
                <p className="text-sm">O arquivo XML é o padrão oficial da Receita Federal (SEFAZ). O XML contém os dados de forma <strong>100% estruturada e exata</strong>.</p>
                <p className="text-sm">Ao usar o XML, o sistema garante precisão absoluta na extração de <strong>nomes, códigos de barras e preços de custo</strong>.</p>
              </CardContent>
            </Card>
          </div>

          {resultados.length > 0 && (
            <Card className="mt-6 border-green-200 shadow-md">
              <CardHeader className="bg-green-50/50 border-b border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-green-800 flex items-center gap-2"><CheckCircle className="h-5 w-5" /> Extração Perfeita</CardTitle>
                    <CardDescription>O sistema encontrou {resultados.length} produtos estruturados na Nota Fiscal.</CardDescription>
                  </div>
                  <Button onClick={confirmarImportacao} className="bg-green-600 hover:bg-green-700 shadow-sm">Confirmar e Salvar no Estoque</Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">Código de Barras</TableHead>
                      <TableHead>Produto Exato</TableHead>
                      <TableHead className="text-right">Custo Unit.</TableHead>
                      <TableHead className="text-right pr-6">Qtd</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resultados.map((prod, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-mono text-gray-500 pl-6">{prod.codigoBarras}</TableCell>
                        <TableCell className="font-medium">{prod.nome}</TableCell>
                        <TableCell className="text-right text-gray-600">R$ {prod.precoCusto.toFixed(2)}</TableCell>
                        <TableCell className="text-right pr-6"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">+{prod.quantidade}</span></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}