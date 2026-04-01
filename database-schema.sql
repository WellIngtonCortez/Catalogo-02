-- Primeiro, criar a tabela de produtos se não existir
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric not null,
  original_price numeric,
  image_url text not null,
  affiliate_link text not null,
  store text not null check (store in ('shopee', 'amazon', 'mercadolivre')),
  category text not null,
  rating numeric default 0 check (rating >= 0 and rating <= 5),
  rating_count integer default 0,
  featured boolean default false,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Habilitar RLS para produtos
alter table public.products enable row level security;

-- Política para permitir leituras públicas (catálogo)
create policy "Enable read access for all users" on public.products
  for select using (active = true);

-- Política para permitir inserções apenas para usuários autenticados (admin)
create policy "Enable insert for authenticated users" on public.products
  for insert with check (auth.role() = 'authenticated');

-- Política para permitir atualizações apenas para usuários autenticados (admin)
create policy "Enable update for authenticated users" on public.products
  for update using (auth.role() = 'authenticated');

-- Política para permitir deleções apenas para usuários autenticados (admin)
create policy "Enable delete for authenticated users" on public.products
  for delete using (auth.role() = 'authenticated');

-- Tabela para rastrear cliques de afiliados
create table if not exists public.clicks (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Habilitar RLS para clicks
alter table public.clicks enable row level security;

-- Política para permitir inserções anônimas (tracking de cliques)
create policy "Allow anonymous insert for clicks" on public.clicks
  for insert with check (true);

-- Política para permitir leituras autenticadas
create policy "Allow authenticated read for clicks" on public.clicks
  for select using (auth.role() = 'authenticated');

-- Habilitar contagem rápida para o dashboard
create or replace view public.product_stats as
select 
  p.name,
  count(c.id) as total_clicks
from public.products p
left join public.clicks c on p.id = c.product_id
group by p.name;

-- Inserir alguns dados de exemplo (opcional)
insert into public.products (name, description, price, original_price, image_url, affiliate_link, store, category, rating, rating_count, featured, active) values
('Fone Bluetooth JBL Tune 510', 'Fone de ouvido com cancelamento de ruído e alta qualidade de som', 299.90, 399.90, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 'https://shopee.com.br/fone-jbl', 'shopee', 'Eletrônicos', 4.5, 1250, true, true),
('Smartphone Samsung Galaxy S23', 'Smartphone com câmera de 50MP e 5G', 3299.00, 4299.00, 'https://images.unsplash.com/photo-1511707171634-09f042f6c3d6?w=800', 'https://amazon.com.br/galaxy-s23', 'amazon', 'Eletrônicos', 4.8, 890, true, true),
('Tênis Nike Air Max', 'Tênis esportivo confortável para corrida', 249.90, 349.90, 'https://images.unsplash.com/photo-1542291026-7ee264cda1d5?w=800', 'https://mercadolivre.com.br/tenis-nike', 'mercadolivre', 'Moda', 4.2, 567, false, true);
