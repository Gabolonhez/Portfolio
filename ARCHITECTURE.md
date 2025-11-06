# 📁 Arquitetura do Projeto - Portfolio Gabriel Bolonhez

## 🏗️ Estrutura de Pastas

Este projeto segue os princípios de **Clean Code** e **Clean Architecture** para manter o código organizado, escalável e fácil de manter.

```
src/
├── css/                    # Estilos organizados por seção
│   ├── global.css         # Estilos globais e variáveis
│   ├── header.css         # Hero/Header section
│   ├── about.css          # Sobre mim
│   ├── acordeon.css       # Componente acordeão
│   ├── skills.css         # Seção de habilidades
│   ├── languages.css      # Idiomas
│   ├── portfolio.css      # Projetos
│   ├── experience.css     # Experiência profissional
│   ├── education.css      # Formação acadêmica
│   ├── contact.css        # Contato
│   ├── need-website.css   # CTA para serviços
│   └── footer.css         # Rodapé
│
├── js/                    # JavaScript organizado em módulos
│   ├── core/             # ⚙️ Núcleo da aplicação
│   │   ├── config.js     # Configurações centralizadas
│   │   └── main.js       # Lógica principal e fetch de dados
│   │
│   ├── components/       # 🧩 Componentes da interface
│   │   ├── acordeon.js   # Lógica do acordeão
│   │   ├── hero.js       # Animações da seção hero
│   │   ├── portfolio.js  # Interações dos projetos
│   │   └── about.js      # Seção sobre mim
│   │
│   ├── utils/            # 🛠️ Utilitários
│   │   ├── changeTheme.js    # Troca de tema (dark/light)
│   │   └── changeLanguage.js # Troca de idioma (PT/EN)
│   │
│   └── animations/       # ✨ Animações e efeitos
│       ├── enhancements.js   # Scroll animations e observers
│       └── lazyLoading.js    # Carregamento lazy de imagens
│
├── data/                  # Dados do perfil
│   ├── profilePT.json    # Conteúdo em português
│   └── profileEN.json    # Conteúdo em inglês
│
├── images/               # Imagens e ícones
│   └── icons/           # Ícones de tecnologias
│
└── files/               # Arquivos para download (CV, etc)
```

## 🎯 Princípios Aplicados

### 1. **Single Responsibility Principle (SRP)**
Cada arquivo tem uma única responsabilidade:
- `config.js` - Apenas configurações
- `changeTheme.js` - Apenas troca de tema
- `acordeon.js` - Apenas lógica do acordeão

### 2. **DRY (Don't Repeat Yourself)**
- Constantes centralizadas em `config.js`
- Funções auxiliares reutilizáveis
- Estilos compartilhados em `global.css`

### 3. **Separation of Concerns**
- **Core**: Lógica de negócio e dados
- **Components**: Componentes da UI
- **Utils**: Funções utilitárias
- **Animations**: Efeitos visuais

### 4. **Clean Architecture**
```
Presentation Layer (HTML/CSS)
      ↓
Application Layer (Components/Utils)
      ↓
Domain Layer (Core/Main Logic)
      ↓
Data Layer (JSON Files)
```

## 📦 Módulos JavaScript

### Core (`src/js/core/`)

#### `config.js`
Configurações centralizadas da aplicação:
- URLs de API
- Constantes de idioma e tema
- Configurações de animação
- Funções auxiliares de configuração

**Exports:**
```javascript
API, LANGUAGE, THEME, ANIMATION, LOADING, SELECTORS
getProfileURL(), getLoadingText(), getErrorText(), isLanguageSupported()
```

#### `main.js`
Lógica principal da aplicação:
- Gerenciamento de estado de carregamento
- Fetch de dados do perfil com retry
- Renderização de seções
- Inicialização da aplicação

### Components (`src/js/components/`)

#### `acordeon.js`
Gerencia os acordeões expansíveis:
- Toggle de abrir/fechar
- Event listeners

#### `hero.js`
Seção hero com animações:
- Contador animado de stats
- Intersection Observer
- Animações de entrada

#### `portfolio.js`
Seção de projetos:
- Animações escalonadas de cards
- Hover effects
- Lazy loading de projetos

#### `about.js`
Seção sobre mim:
- Atualização de conteúdo
- Animações de blocos de história

### Utils (`src/js/utils/`)

#### `changeTheme.js`
Gerenciamento de tema:
- Troca dark/light mode
- Persistência em localStorage
- Atualização de ícone

#### `changeLanguage.js`
Gerenciamento de idioma:
- Troca PT/EN
- Recarga de conteúdo
- Persistência de preferência

### Animations (`src/js/animations/`)

#### `enhancements.js`
Melhorias visuais:
- Scroll animations
- Intersection Observer
- Smooth scroll para links

#### `lazyLoading.js`
Carregamento otimizado:
- Lazy loading de imagens
- Melhora performance inicial
- Intersection Observer para imagens

## 🚀 Ordem de Carregamento

Os scripts são carregados no `index.html` na seguinte ordem:

```html
<!-- 1. Core Scripts -->
<script type="module" src="src/js/core/config.js"></script>
<script src="src/js/core/main.js"></script>

<!-- 2. Component Scripts -->
<script src="src/js/components/acordeon.js"></script>
<script src="src/js/components/hero.js"></script>
<script src="src/js/components/portfolio.js"></script>
<script src="src/js/components/about.js"></script>

<!-- 3. Utility Scripts -->
<script src="src/js/utils/changeLanguage.js"></script>
<script src="src/js/utils/changeTheme.js"></script>

<!-- 4. Animation Scripts -->
<script src="src/js/animations/enhancements.js"></script>
<script src="src/js/animations/lazyLoading.js"></script>
```

## 🔄 Fluxo de Dados

```
1. Usuário acessa a página
   ↓
2. config.js carrega configurações
   ↓
3. main.js busca dados do JSON (PT ou EN)
   ↓
4. Components renderizam o conteúdo
   ↓
5. Utils permitem interações (tema, idioma)
   ↓
6. Animations melhoram a experiência visual
```

## 📝 Boas Práticas Implementadas

### ✅ Código Limpo
- Nomes descritivos de variáveis e funções
- Funções pequenas e focadas
- Comentários apenas quando necessário
- Código auto-explicativo

### ✅ Manutenibilidade
- Arquivos pequenos e específicos
- Separação clara de responsabilidades
- Fácil localização de código
- Estrutura escalável

### ✅ Performance
- Lazy loading de imagens
- Scripts otimizados
- CSS minificado em produção
- Fetch com retry e error handling

### ✅ Acessibilidade
- ARIA labels em botões
- Semântica HTML correta
- Navegação por teclado
- Alto contraste de cores

## 🗑️ Arquivos Removidos

Durante a refatoração, os seguintes arquivos foram removidos:

- ❌ `src/js/scripts.js` - Arquivo vazio com código comentado
- ❌ `src/js/api.js` - Duplicação de lógica (movida para main.js)
- ❌ `src/css/dark-blue-theme.css` - Estilos já implementados em outros arquivos

## 🔧 Como Adicionar Novos Recursos

### Novo Componente:
1. Criar arquivo em `src/js/components/nome-componente.js`
2. Adicionar referência no `index.html`
3. Seguir padrão de nomenclatura e estrutura existente

### Nova Configuração:
1. Adicionar em `src/js/core/config.js`
2. Usar exports/imports ES6
3. Documentar com JSDoc

### Novo Estilo:
1. Criar arquivo CSS específico ou adicionar em existente
2. Seguir convenções de nomenclatura (BEM ou similar)
3. Manter consistência com tema atual

---

**Desenvolvido com Clean Code por Gabriel Bolonhez** 🚀
