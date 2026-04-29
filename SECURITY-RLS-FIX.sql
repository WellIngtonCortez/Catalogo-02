-- ============================================================
-- UniShopBr — Correção de RLS (Segurança Hardened)
-- Execute no Supabase SQL Editor
-- ============================================================

-- PROBLEMA 1: auth.role() = 'authenticated' é fraco.
-- Qualquer token JWT autenticado pode editar produtos.
-- FIX: Usar auth.uid() verificado contra uma tabela de admins.

-- Criar tabela de admins (execute se ainda não existir)
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now()
);
alter table public.admin_users enable row level security;

-- Somente o próprio admin pode ver seu registro
create policy "Admin can read own record" on public.admin_users
  for select using (auth.uid() = id);

-- REMOVER políticas antigas fracas
drop policy if exists "Enable insert for authenticated users" on public.products;
drop policy if exists "Enable update for authenticated users" on public.products;
drop policy if exists "Enable delete for authenticated users" on public.products;

-- POLÍTICAS NOVAS: Exige que o uid esteja na tabela admin_users
create policy "Only admins can insert products" on public.products
  for insert with check (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

create policy "Only admins can update products" on public.products
  for update using (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

create policy "Only admins can delete products" on public.products
  for delete using (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- Adicionar o usuário admin existente à tabela (substitua pelo UID real)
-- Para obter o UID: Dashboard Supabase -> Authentication -> Users
-- insert into public.admin_users (id) values ('SEU-UID-AQUI');

-- PROBLEMA 2: A view product_stats não tem RLS
-- FIX: Restringir acesso à view
revoke select on public.product_stats from anon;
grant select on public.product_stats to authenticated;

-- PROBLEMA 3: A store check constraint está desatualizada (falta aliexpress)
alter table public.products
  drop constraint if exists products_store_check;

alter table public.products
  add constraint products_store_check
  check (store in ('shopee', 'amazon', 'mercadolivre', 'aliexpress'));

-- PROBLEMA 4: Rate limiting na função increment_click
-- Adicionar verificação simples de cooldown (evita spam de cliques)
create or replace function public.increment_click(p_product_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Previne cliques duplicados do mesmo momento (debounce de 1 segundo)
  if not exists (
    select 1 from public.clicks
    where product_id = p_product_id
      and created_at > now() - interval '1 second'
  ) then
    insert into public.clicks (product_id) values (p_product_id);
  end if;
end;
$$;
