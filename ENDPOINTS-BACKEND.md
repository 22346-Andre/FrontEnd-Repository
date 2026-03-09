# 🔗 Documentação de Endpoints - Backend Spring Boot

## Base URL
```
https://seu-backend.com/api
```

---

## 🔐 Autenticação (`/auth`)

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@email.com",
  "senha": "senha123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 3600
}
```

### Registrar Empresa
```http
POST /auth/registrar-empresa
Content-Type: application/json

{
  "nomeDono": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123",
  "cnpj": "12.345.678/0001-90",
  "razaoSocial": "Mercadinho Silva LTDA",
  "nomeFantasia": "Mercadinho do João",
  "celular": "(11) 98765-4321"
}

Response:
"Empresa e usuário registrados com sucesso!"
```

---

## 📦 Produtos (`/produtos`)

### Listar Todos
```http
GET /produtos
Authorization: Bearer {token}

Response: Array<Produto>
```

### Busca Avançada
```http
GET /produtos/busca-avancada?categoria=Alimentos&precoMin=10&precoMax=100
Authorization: Bearer {token}

Query Params:
- categoria (optional): string
- precoMin (optional): number
- precoMax (optional): number
- dataInicio (optional): ISO DateTime

Response: Array<Produto>
```

### Listar Estoque Crítico
```http
GET /produtos/criticos
Authorization: Bearer {token}

Response: Array<Produto> (apenas produtos abaixo do estoque mínimo)
```

### Cadastrar Produto
```http
POST /produtos
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Arroz Branco 5kg",
  "codigoBarras": "7891234567890",
  "categoria": "Alimentos",
  "precoCusto": 12.50,
  "precoVenda": 18.90,
  "quantidadeMinima": 10,
  "fornecedorId": 1
}

Response: Produto
```

### Atualizar Produto
```http
PUT /produtos/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Arroz Branco 5kg Premium",
  "precoCusto": 13.00,
  "precoVenda": 19.90
}

Response: Produto
```

### Deletar Produto
```http
DELETE /produtos/{id}
Authorization: Bearer {token}

Response: 204 No Content
```

### Adicionar Lote (Entrada de Estoque)
```http
POST /produtos/{id}/lotes
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantidade": 100,
  "dataValidade": "2026-12-31",
  "lote": "LOTE123"
}

Response: Produto
```

### Registrar Saída (FEFO)
```http
POST /produtos/{id}/saida
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantidadeDesejada": 10
}

Response: "Saída de 10 unidades registada com sucesso! Lotes atualizados via FEFO."
```

---

## 🏢 Fornecedores (`/fornecedores`)

### Listar Todos
```http
GET /fornecedores
Authorization: Bearer {token}

Response: Array<Fornecedor>
```

### Criar Fornecedor
```http
POST /fornecedores
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Distribuidora ABC",
  "cnpj": "12.345.678/0001-90",
  "telefone": "(11) 3456-7890",
  "email": "contato@abc.com.br",
  "endereco": "Rua das Flores, 123"
}

Response: Fornecedor
```

### Atualizar Fornecedor
```http
PUT /fornecedores/{id}
Authorization: Bearer {token}
Content-Type: application/json

Response: Fornecedor
```

### Deletar Fornecedor
```http
DELETE /fornecedores/{id}
Authorization: Bearer {token}

Response: 204 No Content
```

---

## 📊 Dashboard (`/dashboard`)

### Obter Resumo
```http
GET /dashboard/resumo
Authorization: Bearer {token}

Response: {
  "capitalImobilizado": 45000.00,
  "giroEstoque": 3.2,
  "totalProdutos": 150,
  "produtosCriticos": 12
}
```

### Obter Dados do Gráfico
```http
GET /dashboard/grafico
Authorization: Bearer {token}

Response: Array<{
  "mes": "Janeiro",
  "entradas": 1000,
  "saidas": 800
}>
```

---

## 📈 Estatísticas (`/api/estatisticas`)

### Obter Estatísticas Gerais
```http
GET /api/estatisticas
Authorization: Bearer {token}
Permissões: ADMIN ou SUPER_ADMIN

Response: {
  "capitalImobilizado": 45000.00,
  "giroEstoque": 3.2,
  "margemLucro": 35.5,
  "produtosClasseA": 15,
  "produtosClasseB": 45,
  "produtosClasseC": 90
}
```

---

## 🛒 Compras (`/compras`)

### Obter Sugestões de Compra
```http
GET /compras/sugestoes-whatsapp
Authorization: Bearer {token}

Response: Array<{
  "produtoNome": "Arroz 5kg",
  "quantidadeAtual": 3,
  "quantidadeMinima": 10,
  "quantidadeSugerida": 15,
  "fornecedorNome": "Distribuidora ABC",
  "valorTotal": 187.50
}>
```

---

## 📄 Relatórios (`/api/relatorios`)

### Relatório de Balanço Geral (PDF)
```http
GET /api/relatorios/balanco/pdf
Authorization: Bearer {token}

Response: application/pdf
Filename: balanco_estoque_smartstock.pdf
```

### Relatório de Movimentações (PDF)
```http
GET /api/relatorios/movimentacoes/pdf
Authorization: Bearer {token}

Response: application/pdf
Filename: historico_movimentacoes_smartstock.pdf
```

### Relatório de Inventário Fiscal (PDF)
```http
GET /api/relatorios/inventario/pdf
Authorization: Bearer {token}

Response: application/pdf
Filename: inventario_fiscal_smartstock.pdf
```

---

## 🔄 Movimentações (`/movimentacoes`)

### Listar Todas
```http
GET /movimentacoes
Authorization: Bearer {token}

Response: Array<{
  "id": 1,
  "tipo": "ENTRADA",
  "quantidade": 100,
  "produtoNome": "Arroz 5kg",
  "data": "2026-03-01T10:30:00",
  "usuario": "João Silva"
}>
```

---

## 👥 Usuários (`/usuarios`)

### Listar Todos
```http
GET /usuarios
Authorization: Bearer {token}
Permissões: ADMIN ou SUPER_ADMIN

Response: Array<Usuario>
```

### Buscar por ID
```http
GET /usuarios/{id}
Authorization: Bearer {token}

Response: Usuario
```

### Criar Novo Usuário
```http
POST /usuarios
Authorization: Bearer {token}
Permissões: ADMIN ou SUPER_ADMIN
Content-Type: application/json

{
  "nome": "Maria Silva",
  "email": "maria@mercadinho.com",
  "senha": "senha123",
  "role": "FUNCIONARIO"
}

Response: Usuario
```

### Atualizar Usuário
```http
PUT /usuarios/{id}
Authorization: Bearer {token}
Permissões: ADMIN ou SUPER_ADMIN
Content-Type: application/json

Response: Usuario
```

### Deletar Usuário
```http
DELETE /usuarios/{id}
Authorization: Bearer {token}
Permissões: ADMIN ou SUPER_ADMIN

Response: 204 No Content
```

---

## 🏢 Empresas (`/empresas`)

### Listar Todas (Apenas Suporte)
```http
GET /empresas
Authorization: Bearer {token}
Permissões: SUPER_ADMIN

Response: Array<Empresa>
```

### Cadastrar Empresa (Apenas Suporte)
```http
POST /empresas
Authorization: Bearer {token}
Permissões: SUPER_ADMIN
Content-Type: application/json

Response: Empresa
```

---

## 📤 Importação (`/api/importacao`)

### Importar em Lote (CSV/Excel)
```http
POST /api/importacao/lote
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
- ficheiro: File (CSV ou Excel)

Response: "Importação concluída: 150 produtos processados com sucesso!"
```

---

## 🔔 Webhooks (`/api/webhooks`)

### Receber Venda Externa
```http
POST /api/webhooks/vendas
Content-Type: application/json

{
  "produtoId": 1,
  "quantidade": 5,
  "origemVenda": "PDV_EXTERNO"
}

Response: "Venda externa processada com sucesso!"
```

---

## 📝 Notas Importantes

### Headers Obrigatórios
Todas as rotas protegidas requerem:
```http
Authorization: Bearer {seu_token_jwt}
Content-Type: application/json
```

### Níveis de Permissão
- **SUPER_ADMIN**: Acesso total ao sistema (suporte)
- **ADMIN**: Gestores da empresa (dono/gerente)
- **FUNCIONARIO**: Caixas e estoquistas

### Códigos de Status HTTP
- `200 OK`: Sucesso
- `201 Created`: Recurso criado
- `204 No Content`: Sucesso sem conteúdo (DELETE)
- `400 Bad Request`: Dados inválidos
- `401 Unauthorized`: Token inválido/ausente
- `403 Forbidden`: Sem permissão
- `404 Not Found`: Recurso não encontrado
- `500 Internal Server Error`: Erro no servidor

### Configuração CORS
O backend deve permitir requisições do frontend:
```java
@CrossOrigin(origins = "http://localhost:5173")
```

### Formato de Data
Usar ISO 8601:
```
2026-03-01T10:30:00
```

---

## 🔧 Exemplos de Integração no Frontend

### Configurar Axios
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://seu-backend.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Exemplo de Uso
```typescript
// Login
const login = async (email: string, senha: string) => {
  const response = await api.post('/auth/login', { email, senha });
  localStorage.setItem('token', response.data.token);
};

// Listar Produtos
const getProdutos = async () => {
  const response = await api.get('/produtos');
  return response.data;
};

// Criar Produto
const createProduto = async (produto: ProdutoDTO) => {
  const response = await api.post('/produtos', produto);
  return response.data;
};

// Download de PDF
const downloadRelatorio = async () => {
  const response = await api.get('/api/relatorios/balanco/pdf', {
    responseType: 'blob'
  });
  
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'relatorio.pdf';
  link.click();
};
```

---

## ✅ Checklist de Integração

- [ ] Configurar base URL do backend
- [ ] Implementar interceptor de autenticação
- [ ] Adicionar tratamento de erros global
- [ ] Implementar refresh token (se aplicável)
- [ ] Configurar CORS no backend
- [ ] Testar todos os endpoints
- [ ] Implementar loading states
- [ ] Adicionar feedback de erro ao usuário
- [ ] Implementar logout automático em 401
- [ ] Validar dados antes de enviar

---

**EstoqueMax Backend API** - *Documentação v1.0*
