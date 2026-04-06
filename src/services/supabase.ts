import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERRO: Variáveis de ambiente do Supabase não encontradas! Verifique o painel da Vercel.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder-key'
)

export interface Product {
  id: string
  name: string
  description: string
  price: number
  original_price?: number
  image_url: string
  affiliate_link: string
  store: 'shopee' | 'amazon' | 'mercado_livre' | 'aliexpress'
  store_type: 'shopee' | 'amazon' | 'mercado_livre' | 'aliexpress'
  category: string
  rating: number
  rating_count: number
  featured: boolean
  flash_sale?: boolean
  active: boolean
  created_at: string
}

export interface Category {
  name: string
  count: number
}

export interface Click {
  id: string
  product_id: string
  created_at: string
}

export interface ProductStats {
  name: string
  total_clicks: number
}
