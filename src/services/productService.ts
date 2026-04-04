import { supabase, Product, Category } from './supabase'

export class ProductService {
  static async getProducts(
    category?: string,
    store?: string,
    search?: string,
    sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'rating',
    limit: number = 20,
    offset: number = 0
  ): Promise<{ products: Product[]; total: number }> {
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('active', true)
      .range(offset, offset + limit - 1)

    // Filtros
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (store && store !== 'all') {
      // Use store_type for better consistency with the new schema
      query = query.or(`store.eq.${store},store_type.eq.${store}`)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`)
    }

    // Ordenação
    switch (sortBy) {
      case 'price_asc':
        query = query.order('price', { ascending: true })
        break
      case 'price_desc':
        query = query.order('price', { ascending: false })
        break
      case 'rating':
        query = query.order('rating', { ascending: false })
        break
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false })
        break
    }

    const { data, error, count } = await query

    if (error) throw error

    return {
      products: data || [],
      total: count || 0
    }
  }

  static async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  }

  static async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .eq('active', true)

    if (error) throw error

    // Contar produtos por categoria
    const categories: Category[] = []
    const categoryMap = new Map<string, number>()

    data?.forEach(product => {
      const count = categoryMap.get(product.category) || 0
      categoryMap.set(product.category, count + 1)
    })

    categoryMap.forEach((count, name) => {
      categories.push({ name, count })
    })

    return categories.sort((a, b) => b.count - a.count)
  }

  static async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('active', true)
      .single()

    if (error) throw error
    return data
  }
}
