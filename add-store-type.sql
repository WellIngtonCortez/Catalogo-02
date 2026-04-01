-- 1. Adiciona a coluna 'store_type' (se ainda não existir)
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS store_type TEXT CHECK (store_type IN ('shopee', 'amazon', 'mercado_livre'));

-- 2. Preenche os produtos antigos com 'shopee' (valor padrão)
UPDATE public.products 
SET store_type = 'shopee' 
WHERE store_type IS NULL;

-- 3. Agora sim, define como obrigatório sem dar erro
ALTER TABLE public.products 
ALTER COLUMN store_type SET NOT NULL;
