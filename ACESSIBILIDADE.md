# 🚀 EstoqueMax - Funcionalidades de Acessibilidade

## 📋 Visão Geral

O EstoqueMax implementa funcionalidades avançadas de acessibilidade para garantir que o sistema seja inclusivo e acessível para todos os usuários, incluindo pessoas com deficiência visual, auditiva ou dificuldades motoras.

---

## ♿ Funcionalidades Implementadas

### 1. Menu de Acessibilidade Flutuante

Um menu fixo no canto direito da tela que oferece:

#### 🎨 Alto Contraste (Padrão Governo)
- **Fundo preto** com **letras amarelas/brancas**
- Segue as diretrizes de acessibilidade do governo brasileiro
- Ideal para pessoas com baixa visão ou daltonismo
- Ativação com um clique
- Preferências salvas no localStorage

#### 📏 Controle de Tamanho de Fonte
- **A-** Diminuir fonte (mínimo 80%)
- **A+** Aumentar fonte (máximo 150%)
- **↻ Reset** para tamanho padrão (100%)
- Ajusta todo o sistema proporcionalmente
- Ideal para idosos e pessoas com baixa visão

### 2. VLibras - Avatar de Libras

🤟 **Tradução automática para Libras (Língua Brasileira de Sinais)**

- Avatar oficial do Governo Federal
- Traduz TODO o conteúdo da tela para Libras
- Integração via script oficial: `vlibras.gov.br`
- Widget flutuante na lateral direita
- Atende à Lei Brasileira de Inclusão (LBI)

**Como usar:**
1. O avatar aparece automaticamente no canto inferior direito
2. Clique no botão do VLibras
3. O avatar traduzirá o texto em libras

### 3. Comandos de Voz (Web Speech API)

🎙️ **O "Efeito UAU" - Controle por voz nativo do navegador**

#### Tecnologia
- **Web Speech API** (nativa do Chrome/Edge/Safari)
- Reconhecimento de fala em Português Brasileiro
- Síntese de voz para feedback auditivo
- Não requer APIs externas ou custos adicionais

#### Comandos Disponíveis

##### 🔍 Busca de Produtos
```
"Buscar Arroz"
"Procurar Feijão"
"Encontrar Açúcar"
```
- Busca automática na tela de produtos
- Filtra a tabela em tempo real

##### 📦 Entrada de Estoque
```
"Dar entrada em 10 pacotes de Arroz"
"Adicionar 5 unidades de Feijão"
"Entrada de 20 kg de Açúcar"
```
- Extrai quantidade e produto automaticamente
- Registra a movimentação

##### 📤 Saída de Estoque
```
"Dar saída de 3 unidades de Arroz"
"Remover 2 pacotes de Feijão"
"Vender 5 unidades de Açúcar"
```
- Registra vendas por voz
- Atualiza estoque automaticamente

##### 🧭 Navegação
```
"Ir para Dashboard"
"Abrir Produtos"
"Ir para Fornecedores"
"Abrir Importação"
"Ir para Scanner"
```
- Navegação entre telas por voz
- Rápido e intuitivo

##### ❓ Ajuda
```
"Ajuda"
"Comandos disponíveis"
```
- Lista todos os comandos disponíveis
- Feedback por voz

#### Como Usar

1. **Ativar o microfone**
   - Clique no botão 🎤 no header (canto superior direito)
   - Permita o acesso ao microfone quando solicitado

2. **Falar o comando**
   - Aguarde o toast "🎤 Escutando..."
   - Fale seu comando claramente
   - O texto reconhecido aparece em tempo real

3. **Feedback**
   - Toast visual com a ação executada
   - Feedback de voz confirmando a ação
   - Ação executada automaticamente

#### Compatibilidade
- ✅ Google Chrome (recomendado)
- ✅ Microsoft Edge
- ✅ Safari
- ⚠️ Firefox (suporte limitado)

---

## 🎯 Benefícios para o Público-Alvo

### Para Idosos
- Fontes maiores e ajustáveis
- Alto contraste para melhor leitura
- Comandos de voz para evitar erros de digitação

### Para Pessoas com Baixa Visão
- Alto contraste (amarelo sobre preto)
- Controle total do tamanho da fonte
- Leitura de tela compatível

### Para Pessoas Surdas
- VLibras para tradução em Libras
- Interface visual clara e intuitiva

### Para Pessoas com Dificuldades Motoras
- Comandos de voz reduzem necessidade de digitação
- Navegação simplificada

### Para Gestores de Mercadinho
- Entrada rápida de estoque por voz (mãos livres)
- Busca rápida sem precisar digitar
- Aumenta produtividade

---

## 🏆 Diferenciais para a Banca

### 1. Conformidade Legal
- ✅ Atende à Lei Brasileira de Inclusão (LBI - Lei 13.146/2015)
- ✅ VLibras oficial do Governo Federal
- ✅ Padrão de alto contraste do Governo

### 2. Tecnologia Inovadora
- 🎤 Web Speech API sem custos adicionais
- 🧠 Processamento inteligente de comandos
- 🔊 Feedback visual e auditivo

### 3. Facilidade de Implementação
- 📦 VLibras: 2 linhas de código
- 🎨 Alto contraste: classes CSS
- 🎙️ Comandos de voz: API nativa

### 4. Experiência do Usuário
- ⚡ Rápido e intuitivo
- 🎯 Comandos naturais em português
- 💾 Preferências salvas automaticamente

---

## 💻 Implementação Técnica

### Arquivos Principais

```
/src/app/
├── contexts/
│   └── accessibility-context.tsx      # Contexto de acessibilidade
├── components/
│   ├── accessibility-menu.tsx         # Menu flutuante
│   ├── voice-command.tsx              # Componente de voz
│   └── voice-commands-help.tsx        # Ajuda de comandos
└── App.tsx                            # Integração VLibras
```

### Estilos
```
/src/styles/theme.css
└── .high-contrast { ... }             # Tema de alto contraste
```

### Eventos Customizados
```typescript
// Busca por voz
window.dispatchEvent(new CustomEvent('voice-search', { detail: searchTerm }));

// Movimentação de estoque
window.dispatchEvent(new CustomEvent('voice-stock-movement', { detail: { command, data } }));
```

---

## 🎓 Demonstração para a Banca

### Script de Apresentação

1. **Mostrar Menu de Acessibilidade**
   - Abrir menu flutuante
   - Ativar alto contraste
   - Ajustar tamanho da fonte

2. **Demonstrar VLibras**
   - Ativar o avatar
   - Mostrar tradução de um texto

3. **"Efeito UAU" - Comandos de Voz**
   - Clicar no microfone
   - Falar: "Buscar Arroz"
   - Mostrar resultado instantâneo
   - Falar: "Dar entrada em 10 pacotes de Feijão"
   - Mostrar registro da movimentação
   - Falar: "Ir para Dashboard"
   - Mostrar navegação automática

4. **Destacar Benefícios**
   - Mãos livres no estoque
   - Acessibilidade inclusiva
   - Sem custos adicionais

---

## 📊 Impacto no Mercado

### Públicos Atendidos
- 👴 **45 milhões** de brasileiros com 60+ anos
- 👁️ **6,5 milhões** com deficiência visual
- 🤟 **10 milhões** de surdos
- 🏪 **1,5 milhões** de pequenos comércios

### Vantagem Competitiva
- ♿ Único sistema de gestão de estoque com acessibilidade completa
- 🇧🇷 Atende legislação brasileira
- 💰 Custo zero para implementação
- 🚀 Diferencial de mercado

---

## 🔧 Como Testar

1. **Alto Contraste**
   - Clique no botão de acessibilidade (canto direito)
   - Clique em "Ativar" alto contraste
   - Observe a mudança para amarelo sobre preto

2. **Tamanho da Fonte**
   - Clique em A+ várias vezes
   - Observe todo o texto aumentar
   - Clique em A- para diminuir
   - Clique em ↻ para resetar

3. **VLibras**
   - Aguarde o avatar carregar (canto inferior direito)
   - Clique no botão do VLibras
   - Selecione um texto na tela
   - Observe a tradução em Libras

4. **Comandos de Voz**
   - Chrome ou Edge recomendado
   - Clique no botão de microfone (header)
   - Permita acesso ao microfone
   - Fale: "Buscar Arroz"
   - Observe a busca automática
   - Experimente outros comandos

---

## 🎉 Conclusão

O EstoqueMax não é apenas um sistema de gestão de estoque. É uma **solução inclusiva** que:

- ✅ Atende à legislação brasileira
- ✅ Usa tecnologia de ponta sem custos extras
- ✅ Melhora a experiência de TODOS os usuários
- ✅ Oferece diferencial competitivo no mercado
- ✅ Demonstra responsabilidade social

**"Tecnologia que transforma, inclusão que importa!"** 🚀

---

## 📝 Referências

- [VLibras Oficial](https://www.vlibras.gov.br/)
- [Web Speech API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Lei Brasileira de Inclusão - Lei 13.146/2015](http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm)
- [WCAG 2.1 - Diretrizes de Acessibilidade](https://www.w3.org/WAI/WCAG21/quickref/)
