# 🔧 Configuração da API Backend

## URL da API

Edite o arquivo `/src/app/services/api.ts` e altere a constante `API_BASE_URL` para apontar para o seu backend:

```typescript
// DESENVOLVIMENTO LOCAL
const API_BASE_URL = 'http://localhost:8080';

// PRODUÇÃO (quando fizer deploy)
// const API_BASE_URL = 'https://seu-backend.herokuapp.com';
```

---

## ✅ Integração Concluída!

### Serviços Criados

Todos os serviços estão prontos e localizados em `/src/app/services/`:

1. **`api.ts`** - Configuração base do Axios com interceptors
2. **`auth.service.ts`** - Login e cadastro de empresa
3. **`produto.service.ts`** - CRUD de produtos + lotes + saídas
4. **`fornecedor.service.ts`** - CRUD de fornecedores
5. **`dashboard.service.ts`** - Estatísticas e gráficos
6. **`compra.service.ts`** - Sugestões de compra
7. **`movimentacao.service.ts`** - Histórico de movimentações
8. **`usuario.service.ts`** - Gestão de usuários
9. **`relatorio.service.ts`** - Download de PDFs
10. **`importacao.service.ts`** - Upload de arquivos

### Páginas Atualizadas

✅ **Dashboard** - Busca dados reais da API
✅ **Produtos** - CRUD completo funcionando
✅ **Login/Cadastro** - Autenticação real com JWT

### Próximas Páginas a Atualizar

Para concluir a integração completa, você ainda precisa atualizar:

- [ ] Fornecedores
- [ ] Sugestões de Compra
- [ ] Produto Detalhes
- [ ] Relatórios
- [ ] Configurações

---

## 🚀 Como Testar

### 1. Certifique-se que o Backend está Rodando

```bash
# No diretório do backend Spring Boot
./mvnw spring-boot:run
```

O backend deve estar rodando em `http://localhost:8080`

### 2. Inicie o Frontend

```bash
# No diretório do frontend
npm run dev
```

### 3. Teste o Fluxo

1. Acesse `http://localhost:5173/cadastro`
2. Cadastre uma nova empresa
3. Será redirecionado para o dashboard com dados reais!

---

## 🔐 Funcionamento da Autenticação

### Login
1. Usuário digita email/senha
2. Frontend envia `POST /auth/login`
3. Backend retorna `{ token, expiresIn }`
4. Token é salvo no `localStorage`
5. Todas as requisições seguintes incluem `Authorization: Bearer {token}`

### Proteção de Rotas
- Interceptor adiciona token automaticamente
- Se token inválido (401), usuário é deslogado
- Erros são tratados com toasts informativos

---

## 📝 Exemplo de Uso

### Buscar Produtos
```typescript
import { produtoService } from '../services/produto.service';

const produtos = await produtoService.listarTodos();
```

### Criar Produto
```typescript
const novoProduto = await produtoService.criar({
  nome: 'Arroz 5kg',
  codigoBarras: '7891234567890',
  categoria: 'Alimentos',
  precoCusto: 12.50,
  precoVenda: 18.90,
  quantidadeMinima: 10,
  fornecedorId: 1
});
```

### Download de PDF
```typescript
import { relatorioService } from '../services/relatorio.service';

await relatorioService.downloadBalancoPdf();
// PDF baixado automaticamente!
```

---

## ⚠️ Importante: CORS

Certifique-se que seu backend Spring Boot permite requisições do frontend:

```java
@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class ProdutoController {
  // ...
}
```

Ou configure globalmente:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

---

## 🐛 Troubleshooting

### "Não foi possível conectar ao servidor"
- Verifique se o backend está rodando em `http://localhost:8080`
- Verifique CORS no backend
- Abra o console do navegador (F12) para ver erros

### "401 Unauthorized"
- Token expirou ou é inválido
- Faça login novamente
- Verifique se o token está sendo enviado nas requisições

### "Erro ao carregar dados"
- Verifique se o endpoint existe no backend
- Verifique a estrutura do JSON retornado
- Compare com a interface TypeScript esperada

---

## 📊 Status de Integração

✅ **Autenticação**
- Login
- Cadastro de Empresa
- Logout
- Interceptors JWT

✅ **Dashboard**
- Estatísticas
- Gráficos
- Produtos Críticos

✅ **Produtos**
- Listar
- Criar
- Deletar
- Buscar (nome/código)

🔄 **Em Andamento**
- Atualizar produto
- Adicionar lote
- Registrar saída
- Demais páginas

---

**Tudo pronto para conectar com sua API! 🎉**
