# 🛠️ Configuração do Projeto WellShop

## 📋 Pré-requisitos

Antes de executar o projeto, você precisa configurar o Supabase:

### 1. Executar Schema SQL

No painel do Supabase, vá para **SQL Editor** e execute o conteúdo do arquivo `database-schema.sql`:

```sql
-- Tabela para rastrear cliques de afiliados
create table public.clicks (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Habilitar contagem rápida para o dashboard
create or replace view product_stats as
select 
  p.name,
  count(c.id) as total_clicks
from products p
left join clicks c on p.id = c.product_id
group by p.name;

-- Habilitar RLS para segurança
alter table public.clicks enable row level security;

-- Política para permitir inserções anônimas (tracking de cliques)
create policy "Allow anonymous insert for clicks" on public.clicks
  for insert with check (true);

-- Política para permitir leituras autenticadas
create policy "Allow authenticated read for clicks" on public.clicks
  for select using (auth.role() = 'authenticated');
```

### 2. Configurar Storage

1. No painel Supabase, vá para **Storage**
2. Crie um novo bucket chamado `products`
3. Configure as políticas de acesso:
   - Permitir uploads para usuários autenticados
   - Permitir downloads públicos

### 3. Configurar Auth

1. Vá para **Authentication** > **Settings**
2. Configure seu email de administrador
3. Crie um usuário admin ou use existente

## 🚀 Executar o Projeto

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   └── ProductCard.tsx          # Componente de card de produto
├── pages/
│   ├── ProductDetail.tsx         # Página de detalhes do produto
│   ├── AdminPanel.tsx           # Painel administrativo
│   └── AdminLogin.tsx           # Login do admin
├── services/
│   ├── supabase.ts             # Configuração do Supabase
│   ├── productService.ts        # Serviço de produtos
│   ├── analyticsService.ts      # Analytics de cliques
│   └── uploadService.ts         # Upload de imagens
├── hooks/
│   └── useDebounce.ts         # Hook para debounce
├── App.tsx                    # Componente principal com rotas
├── main.tsx                   # Entry point
└── index.css                   # Estilos globais
```

## ✅ Funcionalidades Implementadas

### 🛍️ Catálogo Público
- ✅ Listagem de produtos com grid responsivo
- ✅ Filtros por loja, categoria e busca
- ✅ Ordenação (recentes, preço, avaliação)
- ✅ Paginação completa
- ✅ Produtos em destaque
- ✅ Analytics de cliques integrado

### 📱 Página de Detalhes
- ✅ Layout inspirado Apple (imagem esquerda, info direita)
- ✅ Metatags SEO dinâmicas
- ✅ Botão CTA destacado
- ✅ Informações completas do produto

### 🔐 Painel Admin
- ✅ Login seguro com Supabase Auth
- ✅ Dashboard com estatísticas
- ✅ CRUD completo de produtos
- ✅ Upload de imagens para Storage
- ✅ Analytics de cliques

### 📊 Analytics
- ✅ Tracking de cliques em tempo real
- ✅ Dashboard com estatísticas
- ✅ View SQL para consultas rápidas

## 🎨 Design System

- **Cores**: Fundo `#FAFAFA`, texto `#374151`, primary `#2563eb`
- **Tipografia**: Inter (font-light para descrições, font-bold para preços)
- **Componentes**: Bordas `rounded-2xl`, sombras `shadow-sm`
- **Responsivo**: Mobile-first com breakpoints otimizados

## 🔗 Variáveis de Ambiente

O projeto usa `.env` para configuração:

```env
VITE_SUPABASE_URL=seu_supabase_url
VITE_SUPABASE_ANON_KEY=sua_supabase_anon_key
```

## 📱 Rotas da Aplicação

- `/` - Catálogo principal
- `/product/:id` - Detalhes do produto
- `/admin/login` - Login administrativo
- `/admin` - Painel admin (protegido)

## 🚀 Deploy

O projeto está pronto para deploy em plataformas como:
- Vercel (recomendado)
- Netlify
- AWS Amplify
- Supabase Edge Functions

## 📝 Notas de Desenvolvimento

- O projeto usa **TypeScript** para type safety
- **Tailwind CSS** para estilização rápida
- **React Router** para navegação
- **Sonner** para notificações toast
- **Lucide React** para ícones minimalistas

## 🔄 Próximos Passos

1. Configurar bucket de Storage no Supabase
2. Executar schema SQL no painel
3. Criar usuário administrador
4. Testar upload de imagens
5. Verificar analytics de cliques
