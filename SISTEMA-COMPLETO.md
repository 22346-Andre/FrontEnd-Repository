# 🚀 EstoqueMax - Sistema Completo de Gestão de Estoque

## 📋 Visão Geral do Sistema

EstoqueMax é um **SaaS completo** de gestão de estoque desenvolvido especialmente para mercadinhos e pequenos comércios. O sistema oferece 11 telas principais divididas em área pública e área logada, com recursos avançados de acessibilidade e comandos de voz.

---

## 🎯 Estrutura Completa do Sistema

### 📱 Área Pública (2 telas)

#### 1. **Login** (`/login`)
- Design clean e moderno com efeitos animados
- Fundo preto com gradientes azul e roxo
- Grid de pontos e linhas animadas
- Card com backdrop blur
- Autenticação mock preparada para integração com backend

#### 2. **Cadastro de Empresa** (`/cadastro`)
- Formulário completo para nova empresa
- Campos: CNPJ, Razão Social, Nome Fantasia, dados do dono
- Mesmo design clean da tela de login
- Pronto para integração com POST /auth/registrar-empresa

---

### 🏠 Área Logada (9 telas)

#### 3. **Dashboard** (`/dashboard`)
**Visão geral do sistema com:**
- 4 cards de estatísticas principais:
  - Capital Imobilizado (R$)
  - Giro de Estoque (vezes/mês)
  - Produtos Cadastrados
  - Estoque Baixo (alertas)
- Gráfico de Curva ABC (Classificação A, B, C)
- Lista de produtos com estoque crítico
- Banner de recursos de acessibilidade

#### 4. **Catálogo de Produtos** (`/produtos`)
**Gestão completa de produtos:**
- Tabela com todos os produtos
- Busca por nome ou código de barras
- Busca por voz integrada
- CRUD completo (Criar, Ler, Atualizar, Deletar)
- Classificação ABC
- Informações de fornecedor
- Preços de custo e venda

#### 5. **Detalhes do Produto** (`/produtos/:id`)
**Visualização e histórico:**
- Informações completas do produto
- Histórico de movimentações (entradas/saídas)
- Auditoria de alterações
- Gráfico de movimentação temporal
- Dados do fornecedor

#### 6. **Gestão de Fornecedores** (`/fornecedores`)
**Cadastro e gestão:**
- Lista completa de fornecedores
- CRUD de fornecedores
- Informações de contato (telefone, email)
- Endereço completo
- Produtos vinculados

#### 7. **Sugestões de Compra** (`/sugestoes-compra`) ⭐ NOVO
**Sistema inteligente de reposição:**
- Lista automática de produtos para comprar
- Baseado em estoque mínimo e histórico
- Classificação por urgência (Alta, Média, Baixa)
- Quantidade sugerida inteligente (+50% do mínimo)
- Cálculo de valor total por produto
- Botão de aprovar compras
- Pronto para integração com CompraController

#### 8. **Central de Importação** (`/importacao`)
**Upload de arquivos:**
- Drag & drop para CSV e XML
- Preview dos dados importados
- Validação de formato
- Importação em lote de produtos
- Preparado para integração com backend

#### 9. **Scanner/PDV Mobile** (`/scanner`)
**Leitura de código de barras:**
- Interface mobile-first
- Scanner de código de barras
- Busca rápida de produtos
- Entrada/saída rápida de estoque
- Ideal para uso em smartphone

#### 10. **Central de Relatórios** (`/relatorios`) ⭐ NOVO
**Exportação de PDFs:**
- 6 tipos de relatórios:
  1. Relatório Completo de Estoque
  2. Curva ABC
  3. Produtos com Estoque Baixo
  4. Relatório de Validade
  5. Histórico de Movimentações
  6. Relatório Financeiro
- Cards informativos com estatísticas
- Download direto em PDF
- Pronto para integração com RelatorioPdfService (iTextPDF)

#### 11. **Configurações e Equipe** (`/configuracoes`) ⭐ NOVO
**Gestão da empresa e usuários:**
- **Aba Empresa:**
  - Editar dados da empresa (CNPJ, Razão Social, Nome Fantasia)
  - Atualizar contatos (email, celular)
  - Endereço completo
- **Aba Equipe:**
  - Listar todos os funcionários
  - Adicionar novos funcionários (caixas, estoquistas, gerentes)
  - Definir permissões por função
  - Remover funcionários
- Pronto para integração com UsuarioController e EmpresaController

---

## ♿ Recursos de Acessibilidade

### 1. **Menu de Acessibilidade Flutuante**
- Botão fixo no canto direito da tela
- **Alto Contraste:** Fundo preto + texto amarelo (padrão governo)
- **Controle de Fonte:** A-, A+, Reset (80% a 150%)
- Preferências salvas no localStorage
- Disponível em todas as telas logadas

### 2. **VLibras - Tradução para Libras** 🤟
- Avatar oficial do Governo Federal
- Traduz automaticamente para Língua Brasileira de Sinais
- Widget flutuante integrado
- Atende Lei Brasileira de Inclusão (LBI)

### 3. **Comandos de Voz (Web Speech API)** 🎙️
**Comandos disponíveis:**

**Busca:**
- "Buscar Arroz"
- "Procurar Feijão"

**Entrada de Estoque:**
- "Dar entrada em 10 pacotes de Arroz"
- "Adicionar 5 unidades de Feijão"

**Saída de Estoque:**
- "Dar saída de 3 unidades de Arroz"
- "Vender 5 unidades de Açúcar"

**Navegação:**
- "Ir para Dashboard"
- "Abrir Produtos"
- "Abrir Sugestões de Compra"
- "Ir para Relatórios"
- "Abrir Configurações"

**Ajuda:**
- "Ajuda" ou "Comandos disponíveis"

---

## 🎨 Design e UX

### Cores e Estilo
- **Sidebar:** Fundo escuro (gray-900) com ícones
- **Layout:** Clean e moderno com cards brancos
- **Acentos:** Azul e roxo (gradientes)
- **Alertas:** Vermelho para urgente, amarelo para atenção
- **Login/Cadastro:** Fundo preto com efeitos animados

### Responsividade
- ✅ Desktop (lg)
- ✅ Tablet (md)
- ✅ Mobile (sm)
- Sidebar colapsável em mobile
- Header fixo com menu hambúrguer

### Componentes UI
- Shadcn/ui components
- Tailwind CSS v4
- Recharts para gráficos
- Lucide React para ícones
- React Router para navegação

---

## 🔗 Integrações Preparadas

### Endpoints Backend (Java Spring Boot)

**Autenticação:**
- `POST /auth/login`
- `POST /auth/registrar-empresa`

**Produtos:**
- `GET /produtos`
- `GET /produtos/busca-avancada`
- `GET /produtos/criticos`
- `POST /produtos`
- `PUT /produtos/{id}`
- `DELETE /produtos/{id}`
- `POST /produtos/{id}/lotes` (entrada de estoque)
- `POST /produtos/{id}/saida` (saída FEFO)

**Fornecedores:**
- `GET /fornecedores`
- `POST /fornecedores`
- `PUT /fornecedores/{id}`
- `DELETE /fornecedores/{id}`

**Sugestões de Compra:**
- `GET /compras/sugestoes-whatsapp`

**Relatórios:**
- `GET /api/relatorios/balanco/pdf`
- `GET /api/relatorios/movimentacoes/pdf`
- `GET /api/relatorios/inventario/pdf`

**Dashboard:**
- `GET /dashboard/resumo`
- `GET /dashboard/grafico`

**Estatísticas:**
- `GET /api/estatisticas`

**Empresa e Usuários:**
- `GET /empresas`
- `POST /empresas`
- `GET /usuarios`
- `GET /usuarios/{id}`
- `POST /usuarios`
- `PUT /usuarios/{id}`
- `DELETE /usuarios/{id}`

**Importação:**
- `POST /api/importacao/lote` (multipart/form-data)

**Movimentações:**
- `GET /movimentacoes`

**Webhooks:**
- `POST /api/webhooks/vendas`

📄 **Documentação completa:** Ver arquivo `/ENDPOINTS-BACKEND.md`

---

## 📊 Dados Mock

O sistema utiliza dados mock completos para demonstração:

**Produtos:** 15 produtos variados (alimentos, bebidas, higiene)
**Fornecedores:** 5 fornecedores cadastrados
**Movimentações:** Histórico simulado de entradas/saídas
**Estatísticas:** Capital imobilizado, giro de estoque, curva ABC
**Sugestões de Compra:** Geradas automaticamente baseadas em estoque baixo

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** com TypeScript
- **React Router 7** (Data mode)
- **Tailwind CSS v4**
- **Shadcn/ui** (componentes)
- **Recharts** (gráficos)
- **Lucide React** (ícones)
- **Sonner** (toasts)
- **Web Speech API** (comandos de voz)

### Acessibilidade
- **VLibras** (tradução para Libras)
- **Web Speech API** (reconhecimento de voz)
- **Speech Synthesis API** (feedback de voz)
- **localStorage** (preferências do usuário)

---

## 🎓 Diferenciais para a Banca

### 1. **Completude do Sistema**
- ✅ 11 telas totalmente funcionais
- ✅ Área pública + área logada completa
- ✅ CRUD completo em múltiplas entidades
- ✅ Sistema preparado para integração real

### 2. **Recursos Avançados**
- ✅ Comandos de voz em português
- ✅ Acessibilidade (VLibras + alto contraste + fonte ajustável)
- ✅ Sistema inteligente de sugestões de compra
- ✅ Geração de relatórios PDF

### 3. **UX/UI Profissional**
- ✅ Design moderno e clean
- ✅ Totalmente responsivo
- ✅ Feedback visual e sonoro
- ✅ Animações e transições suaves

### 4. **Conformidade Legal**
- ✅ Lei Brasileira de Inclusão (LBI - Lei 13.146/2015)
- ✅ VLibras oficial do Governo Federal
- ✅ WCAG 2.1 (acessibilidade web)

### 5. **Inteligência do Sistema**
- ✅ Cálculo automático de sugestões de compra
- ✅ Classificação ABC de produtos
- ✅ Alertas de estoque crítico
- ✅ Histórico e auditoria completos

---

## 📝 Como Demonstrar na Banca

### 1. **Introdução (2 min)**
"Apresento o EstoqueMax, um SaaS completo de gestão de estoque com 11 telas funcionais, comandos de voz e recursos de acessibilidade."

### 2. **Login e Navegação (2 min)**
- Mostrar tela de login clean
- Fazer login e mostrar dashboard
- Navegar pelas telas usando a sidebar

### 3. **Funcionalidades Core (5 min)**
- **Produtos:** Mostrar CRUD completo
- **Sugestões de Compra:** Sistema inteligente
- **Relatórios:** Geração de PDFs
- **Configurações:** Gestão de equipe

### 4. **"Efeito UAU" - Acessibilidade (3 min)**
- **Menu de Acessibilidade:** Ativar alto contraste e ajustar fonte
- **VLibras:** Mostrar avatar de Libras
- **Comandos de Voz:** 
  - "Buscar Arroz" ✅
  - "Dar entrada em 10 pacotes de Feijão" ✅
  - "Ir para Relatórios" ✅

### 5. **Diferencial Técnico (2 min)**
- Mostrar código organizado (contextos, rotas, componentes)
- Explicar integração preparada com backend Java
- Destacar uso de tecnologias modernas

### 6. **Conclusão (1 min)**
"Um sistema completo, acessível e pronto para o mercado, atendendo legislação brasileira e oferecendo experiência superior aos usuários."

---

## ✅ Checklist de Funcionalidades

### Telas Públicas
- [x] Login com design clean
- [x] Cadastro de empresa
- [x] Validação de formulários
- [x] Feedback visual

### Telas Logadas
- [x] Dashboard com estatísticas
- [x] Catálogo de produtos (CRUD)
- [x] Detalhes e movimentações
- [x] Gestão de fornecedores
- [x] Sugestões inteligentes de compra
- [x] Central de importação (CSV/XML)
- [x] Scanner/PDV mobile
- [x] Central de relatórios (6 tipos)
- [x] Configurações e equipe

### Acessibilidade
- [x] Menu de acessibilidade flutuante
- [x] Alto contraste (padrão governo)
- [x] Ajuste de fonte (A+/A-)
- [x] VLibras integrado
- [x] Comandos de voz (15+ comandos)
- [x] Feedback sonoro
- [x] Preferências salvas

### Recursos Técnicos
- [x] React Router (navegação)
- [x] Context API (estado global)
- [x] TypeScript (tipagem)
- [x] Tailwind CSS (estilização)
- [x] Componentes reutilizáveis
- [x] Responsividade completa
- [x] Mock data estruturado
- [x] Preparado para integração com backend

---

## 🚀 Próximos Passos (Integração Real)

1. **Backend Java Spring Boot:**
   - Implementar controllers
   - Configurar banco de dados
   - Criar serviços de relatório PDF

2. **Autenticação Real:**
   - JWT tokens
   - Refresh tokens
   - Proteção de rotas

3. **Deploy:**
   - Frontend: Vercel/Netlify
   - Backend: Heroku/AWS
   - Database: PostgreSQL

4. **Features Adicionais:**
   - Notificações push
   - Dashboard em tempo real (WebSocket)
   - App mobile nativo
   - Integração com NFe

---

## 📞 Contato e Documentação

- **Documentação de Acessibilidade:** `/ACESSIBILIDADE.md`
- **Este README:** `/SISTEMA-COMPLETO.md`
- **Código Fonte:** `/src/app/`

---

**EstoqueMax** - *Gestão de Estoque Inteligente e Acessível* 🚀

**"Tecnologia que transforma, inclusão que importa!"**

---

*Desenvolvido com ❤️ para mercadinhos e pequenos comércios brasileiros*