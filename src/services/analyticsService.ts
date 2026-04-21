import { supabase, Click } from './supabase'

export class AnalyticsService {
  static async trackClick(productId: string): Promise<void> {
    try {
      // Chama a RPC 'increment_click' para registrar o clique com segurança
      // A função SQL usa SECURITY DEFINER para permitir inserção mesmo para usuários anônimos
      const { error } = await supabase.rpc('increment_click', { 
        p_product_id: productId 
      })

      if (error) {
        console.error('Error tracking click via RPC:', error)
      }
    } catch (error) {
      console.error('Error tracking click:', error)
    }
  }

  static async getProductStats(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('product_stats')
        .select('*')
        .order('total_clicks', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching product stats:', error)
      return []
    }
  }

  static async getClicksByProduct(productId: string): Promise<Click[]> {
    try {
      const { data, error } = await supabase
        .from('clicks')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching clicks:', error)
      return []
    }
  }
}
