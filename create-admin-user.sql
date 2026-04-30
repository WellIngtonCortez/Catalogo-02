-- Criar usuário administrador
-- Execute este comando no SQL Editor do Supabase para criar um usuário admin

-- Substitua 'admin@wellshop.com' e 'senha_segura_123' com suas credenciais reais
insert into auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  last_sign_in_at,
  raw_user_meta_data,
  raw_app_meta_data
) values (
  gen_random_uuid(),
  'w.m.negociodigitall@gmail.com',
  crypt('070873190682100', 'md5'),
  now(),
  now(),
  now(),
  '{"role": "admin"}',
  '{}'
);

-- Ou use a função de signup do Supabase Auth
-- A maneira recomendada é usar o painel Authentication > Users no dashboard do Supabase
