import { supabase } from './supabase'

export class UploadService {
  static async uploadProductImage(file: File): Promise<string> {
    try {
      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `products/${fileName}`

      // Upload do arquivo
      const { data, error } = await supabase.storage
        .from('products')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Error uploading image:', error)
        throw error
      }

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  }

  static async deleteProductImage(imageUrl: string): Promise<void> {
    try {
      // Extrair o path da URL
      const url = new URL(imageUrl)
      const filePath = url.pathname.split('/').pop()?.split('?')[0]
      
      if (!filePath) return

      const { error } = await supabase.storage
        .from('products')
        .remove([`products/${filePath}`])

      if (error) {
        console.error('Error deleting image:', error)
        throw error
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      throw error
    }
  }
}
