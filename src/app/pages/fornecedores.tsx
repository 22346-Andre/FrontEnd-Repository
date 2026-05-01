import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api';

interface Fornecedor {
  id: number;
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
}

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  
  const [searchParams] = useSearchParams();
  const [busca, setBusca] = useState(searchParams.get('q') || '');
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [novoFornecedor, setNovoFornecedor] = useState({ nome: '', cnpj: '', telefone: '', email: '' });

  const [dialogEditOpen, setDialogEditOpen] = useState(false);
  const [fornecedorEditando, setFornecedorEditando] = useState<Fornecedor | null>(null);

  useEffect(() => {
    const queryVoz = searchParams.get('q');
    if (queryVoz !== null) {
      setBusca(queryVoz);
    }
  }, [searchParams]);

  useEffect(() => {
    carregarFornecedores();
  }, []);

  const carregarFornecedores = async () => {
    try {
      const response = await api.get('/fornecedores');
      setFornecedores(response.data);
    } catch (error) {
      toast.error('Erro ao carregar a lista de fornecedores.');
    }
  };

  const handleAdicionarFornecedor = async () => {
    try {
      await api.post('/fornecedores', novoFornecedor);
      toast.success('Fornecedor adicionado com sucesso!');
      setDialogOpen(false);
      setNovoFornecedor({ nome: '', cnpj: '', telefone: '', email: '' });
      carregarFornecedores(); 
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao adicionar fornecedor.');
    }
  };

  const handleSalvarEdicao = async () => {
    if (!fornecedorEditando) return;
    try {
      await api.put(`/fornecedores/${fornecedorEditando.id}`, fornecedorEditando);
      toast.success('Fornecedor atualizado com sucesso!');
      setDialogEditOpen(false);
      carregarFornecedores(); 
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar fornecedor.');
    }
  };

  const handleExcluirFornecedor = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja apagar este fornecedor?")) return;
    try {
      await api.delete(`/fornecedores/${id}`);
      toast.success('Fornecedor excluído com sucesso!');
      carregarFornecedores(); 
    } catch (error) {
      toast.error('Erro ao excluir fornecedor.');
    }
  };

  const fornecedoresFiltrados = fornecedores.filter((fornecedor) =>
    fornecedor.nome.toLowerCase().includes(busca.toLowerCase()) ||
    fornecedor.cnpj.includes(busca)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestão de Fornecedores</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie seus fornecedores e parceiros</p>
        </div>
        
        {/* MODAL ADICIONAR */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <div className="inline-block">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Novo Fornecedor
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent className="dark:bg-gray-900 dark:border-gray-800">
            <DialogHeader>
              <DialogTitle className="dark:text-white">Adicionar Novo Fornecedor</DialogTitle>
              <DialogDescription className="dark:text-gray-400">Preencha as informações do fornecedor abaixo.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label className="dark:text-gray-200">Nome do Fornecedor</Label>
                <Input 
                  value={novoFornecedor.nome} 
                  onChange={(e) => setNovoFornecedor({ ...novoFornecedor, nome: e.target.value })} 
                  className="dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-gray-200">CNPJ</Label>
                <Input 
                  placeholder="00.000.000/0000-00" 
                  value={novoFornecedor.cnpj} 
                  onChange={(e) => setNovoFornecedor({ ...novoFornecedor, cnpj: e.target.value })} 
                  className="dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-gray-200">Telefone</Label>
                <Input 
                  placeholder="(11) 98765-4321" 
                  value={novoFornecedor.telefone} 
                  onChange={(e) => setNovoFornecedor({ ...novoFornecedor, telefone: e.target.value })} 
                  className="dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-gray-200">E-mail</Label>
                <Input 
                  type="email" 
                  placeholder="contato@fornecedor.com" 
                  value={novoFornecedor.email} 
                  onChange={(e) => setNovoFornecedor({ ...novoFornecedor, email: e.target.value })} 
                  className="dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:placeholder:text-gray-500"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">Cancelar</Button>
              <Button onClick={handleAdicionarFornecedor}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* MODAL EDITAR */}
        <Dialog open={dialogEditOpen} onOpenChange={setDialogEditOpen}>
          <DialogContent className="dark:bg-gray-900 dark:border-gray-800">
            <DialogHeader>
              <DialogTitle className="dark:text-white">Editar Fornecedor</DialogTitle>
              <DialogDescription className="dark:text-gray-400">Atualize os dados do fornecedor abaixo.</DialogDescription>
            </DialogHeader>
            {fornecedorEditando && (
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label className="dark:text-gray-200">Nome</Label>
                  <Input 
                    value={fornecedorEditando.nome} 
                    onChange={(e) => setFornecedorEditando({ ...fornecedorEditando, nome: e.target.value })} 
                    className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="dark:text-gray-200">CNPJ</Label>
                  <Input 
                    value={fornecedorEditando.cnpj} 
                    onChange={(e) => setFornecedorEditando({ ...fornecedorEditando, cnpj: e.target.value })} 
                    className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="dark:text-gray-200">Telefone</Label>
                  <Input 
                    value={fornecedorEditando.telefone} 
                    onChange={(e) => setFornecedorEditando({ ...fornecedorEditando, telefone: e.target.value })} 
                    className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="dark:text-gray-200">E-mail</Label>
                  <Input 
                    value={fornecedorEditando.email} 
                    onChange={(e) => setFornecedorEditando({ ...fornecedorEditando, email: e.target.value })} 
                    className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogEditOpen(false)} className="dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">Cancelar</Button>
              <Button onClick={handleSalvarEdicao}>Salvar Alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Buscar por nome ou CNPJ..." 
              value={busca} 
              onChange={(e) => setBusca(e.target.value)} 
              className="pl-10 dark:bg-gray-900 dark:text-white dark:border-gray-700 dark:placeholder:text-gray-500" 
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="dark:border-gray-700">
                <TableHead className="dark:text-gray-300">Nome</TableHead>
                <TableHead className="dark:text-gray-300">CNPJ</TableHead>
                <TableHead className="dark:text-gray-300">Telefone</TableHead>
                <TableHead className="dark:text-gray-300">E-mail</TableHead>
                <TableHead className="text-right dark:text-gray-300">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fornecedoresFiltrados.length === 0 ? (
                <TableRow className="dark:border-gray-700">
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground dark:text-gray-400">Nenhum fornecedor encontrado.</TableCell>
                </TableRow>
              ) : (
                fornecedoresFiltrados.map((fornecedor) => (
                  <TableRow key={fornecedor.id} className="dark:border-gray-700 dark:hover:bg-gray-700/50">
                    <TableCell className="font-medium dark:text-white">{fornecedor.nome}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">{fornecedor.cnpj}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">{fornecedor.telefone}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300">{fornecedor.email}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => { setFornecedorEditando(fornecedor); setDialogEditOpen(true); }}
                          className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleExcluirFornecedor(fornecedor.id)} 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:border-gray-600 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
