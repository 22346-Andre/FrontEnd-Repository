// Dados mock para demonstração do sistema

export interface Produto {
  id: string;
  nome: string;
  codigoBarras: string;
  quantidade: number;
  quantidadeMinima: number;
  precoVenda: number;
  precoCusto: number;
  categoria: string;
  fornecedorId: string;
  classificacaoABC: 'A' | 'B' | 'C';
}

export interface Fornecedor {
  id: string;
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
}

export interface Movimentacao {
  id: string;
  produtoId: string;
  tipo: 'entrada' | 'saida';
  quantidade: number;
  origem: 'balcao' | 'mercado_livre' | 'manual';
  data: string;
  observacao?: string;
}

export interface Estatisticas {
  capitalImobilizado: number;
  giroEstoque: number;
  produtosCadastrados: number;
  produtosEstoqueBaixo: number;
  curvaABC: {
    A: number;
    B: number;
    C: number;
  };
}

export const mockFornecedores: Fornecedor[] = [
  {
    id: '1',
    nome: 'Distribuidora Central Ltda',
    cnpj: '12.345.678/0001-90',
    telefone: '(11) 98765-4321',
    email: 'contato@distribuidoracentral.com.br'
  },
  {
    id: '2',
    nome: 'Atacado São Paulo',
    cnpj: '98.765.432/0001-10',
    telefone: '(11) 91234-5678',
    email: 'vendas@atacadosp.com.br'
  },
  {
    id: '3',
    nome: 'Indústria de Alimentos Brasil',
    cnpj: '11.222.333/0001-44',
    telefone: '(11) 93456-7890',
    email: 'comercial@alimentosbrasil.com.br'
  }
];

export const mockProdutos: Produto[] = [
  {
    id: '1',
    nome: 'Arroz Tipo 1 - 5kg',
    codigoBarras: '7891234567890',
    quantidade: 45,
    quantidadeMinima: 20,
    precoVenda: 28.90,
    precoCusto: 22.50,
    categoria: 'Alimentos',
    fornecedorId: '1',
    classificacaoABC: 'A'
  },
  {
    id: '2',
    nome: 'Feijão Preto - 1kg',
    codigoBarras: '7891234567891',
    quantidade: 8,
    quantidadeMinima: 15,
    precoVenda: 9.90,
    precoCusto: 7.20,
    categoria: 'Alimentos',
    fornecedorId: '1',
    classificacaoABC: 'A'
  },
  {
    id: '3',
    nome: 'Óleo de Soja - 900ml',
    codigoBarras: '7891234567892',
    quantidade: 32,
    quantidadeMinima: 25,
    precoVenda: 8.50,
    precoCusto: 6.80,
    categoria: 'Alimentos',
    fornecedorId: '2',
    classificacaoABC: 'B'
  },
  {
    id: '4',
    nome: 'Açúcar Cristal - 1kg',
    codigoBarras: '7891234567893',
    quantidade: 5,
    quantidadeMinima: 20,
    precoVenda: 5.90,
    precoCusto: 4.20,
    categoria: 'Alimentos',
    fornecedorId: '2',
    classificacaoABC: 'A'
  },
  {
    id: '5',
    nome: 'Café Torrado e Moído - 500g',
    codigoBarras: '7891234567894',
    quantidade: 18,
    quantidadeMinima: 10,
    precoVenda: 15.90,
    precoCusto: 12.50,
    categoria: 'Alimentos',
    fornecedorId: '3',
    classificacaoABC: 'B'
  },
  {
    id: '6',
    nome: 'Macarrão Espaguete - 500g',
    codigoBarras: '7891234567895',
    quantidade: 3,
    quantidadeMinima: 15,
    precoVenda: 4.50,
    precoCusto: 3.20,
    categoria: 'Alimentos',
    fornecedorId: '1',
    classificacaoABC: 'C'
  },
  {
    id: '7',
    nome: 'Leite Integral UHT - 1L',
    codigoBarras: '7891234567896',
    quantidade: 24,
    quantidadeMinima: 30,
    precoVenda: 5.20,
    precoCusto: 4.10,
    categoria: 'Laticínios',
    fornecedorId: '3',
    classificacaoABC: 'A'
  },
  {
    id: '8',
    nome: 'Sabonete em Barra - 90g',
    codigoBarras: '7891234567897',
    quantidade: 50,
    quantidadeMinima: 20,
    precoVenda: 2.90,
    precoCusto: 1.80,
    categoria: 'Higiene',
    fornecedorId: '2',
    classificacaoABC: 'C'
  }
];

export const mockMovimentacoes: Movimentacao[] = [
  {
    id: '1',
    produtoId: '2',
    tipo: 'saida',
    quantidade: 3,
    origem: 'balcao',
    data: '2026-02-27T10:30:00',
    observacao: 'Venda no balcão'
  },
  {
    id: '2',
    produtoId: '2',
    tipo: 'saida',
    quantidade: 2,
    origem: 'mercado_livre',
    data: '2026-02-26T15:45:00',
    observacao: 'Venda via Mercado Livre - Webhook'
  },
  {
    id: '3',
    produtoId: '2',
    tipo: 'entrada',
    quantidade: 20,
    origem: 'manual',
    data: '2026-02-25T09:00:00',
    observacao: 'Entrada de estoque - Fornecedor'
  },
  {
    id: '4',
    produtoId: '2',
    tipo: 'saida',
    quantidade: 5,
    origem: 'balcao',
    data: '2026-02-24T14:20:00',
    observacao: 'Venda no balcão'
  },
  {
    id: '5',
    produtoId: '2',
    tipo: 'saida',
    quantidade: 2,
    origem: 'mercado_livre',
    data: '2026-02-23T11:10:00',
    observacao: 'Venda via Mercado Livre - Webhook'
  }
];

export const mockEstatisticas: Estatisticas = {
  capitalImobilizado: 45678.90,
  giroEstoque: 2.3,
  produtosCadastrados: mockProdutos.length,
  produtosEstoqueBaixo: mockProdutos.filter(p => p.quantidade < p.quantidadeMinima).length,
  curvaABC: {
    A: 45,
    B: 30,
    C: 25
  }
};
