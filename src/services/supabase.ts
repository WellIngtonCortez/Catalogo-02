import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface Product {
  id: string
  name: string
  description: string
  price: number
  original_price?: number
  image_url: string
  affiliate_link: string
  store: 'shopee' | 'amazon' | 'mercadolivre'
  category: string
  rating: number
  rating_count: number
  featured: boolean
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
