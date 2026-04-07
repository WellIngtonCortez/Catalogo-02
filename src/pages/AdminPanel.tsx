import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { ProductService } from '../services/productService'
import { AnalyticsService } from '../services/analyticsService'
import { UploadService } from '../services/uploadService'
import { Product, ProductStats } from '../services/supabase'
import { ShoppingBag, Upload, Edit, Trash2, BarChart3, LogOut, Plus, X, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { LojaSelector } from '../components/admin/LojaSelector'
import logoWellshop from '../assets/logo_wellshop.png'

export function AdminPanel() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [stats, setStats] = useState<ProductStats[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    image_url: '',
    affiliate_link: '',
    store: 'shopee',
    store_type: 'shopee',
    category: '',
    rating: '',
    rating_count: '',
    featured: false,
    active: true
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [storeError, setStoreError] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      loadProducts()
      loadStats()
    }
  }, [user])

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        navigate('/admin/login')
        return
      }
      
      setUser(session.user)
      setLoading(false)
    } catch (error) {
      console.error('Error checking auth:', error)
      navigate('/admin/login')
    }
  }

  const loadProducts = async () => {
    try {
      const { products } = await ProductService.getProducts('', '', '', 'newest', 100)
      setProducts(products)
    } catch (error) {
      console.error('Error loading products:', error)
      toast.error('Erro ao carregar produtos')
    }
  }

  const loadStats = async () => {
    try {
      const data = await AnalyticsService.getProductStats()
      setStats(data.slice(0, 10)) // Top 10
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
    toast.success('Logout realizado com sucesso')
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const imageUrl = await UploadService.uploadProductImage(file)
      setFormData(prev => ({ ...prev, image_url: imageUrl }))
      toast.success('Imagem enviada com sucesso!')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Erro ao enviar imagem')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar seleção da loja
    if (!formData.store_type) {
      setStoreError(true)
      toast.error('Por favor, selecione uma loja')
      return
    }
    
    setStoreError(false)
    
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : undefined,
        image_url: formData.image_url,
        affiliate_link: formData.affiliate_link,
        store: formData.store as any,
        store_type: formData.store_type,
        category: formData.category,
        rating: parseFloat(formData.rating) || 0,
        rating_count: parseInt(formData.rating_count) || 0,
        featured: formData.featured,
        active: formData.active
      }

      if (editingId) {
        // Atualizar produto
        await supabase
          .from('products')
          .update(productData)
          .eq('id', editingId)
        
        toast.success('Produto atualizado com sucesso!')
      } else {
        // Criar produto
        await supabase
          .from('products')
          .insert(productData)
        
        toast.success('Produto criado com sucesso!')
      }

      // Resetar formulário
      setFormData({
        name: '',
        description: '',
        price: '',
        original_price: '',
        image_url: '',
        affiliate_link: '',
        store: 'shopee',
        store_type: 'shopee',
        category: '',
        rating: '',
        rating_count: '',
        featured: false,
        active: true
      })
      setStoreError(false)
      setEditingId(null)
      
      // Recarregar produtos
      loadProducts()
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error('Erro ao salvar produto')
    }
  }

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      original_price: product.original_price?.toString() || '',
      image_url: product.image_url,
      affiliate_link: product.affiliate_link,
      store: product.store,
      store_type: (product as any).store_type || '',
      category: product.category,
      rating: product.rating.toString(),
      rating_count: product.rating_count.toString(),
      featured: product.featured,
      active: product.active
    })
    setStoreError(false)
    setEditingId(product.id)
  }

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return

    try {
      // Deletar imagem do storage
      if (imageUrl) {
        await UploadService.deleteProductImage(imageUrl)
      }

      // Deletar produto do banco
      await supabase
        .from('products')
        .delete()
        .eq('id', id)

      toast.success('Produto excluído com sucesso!')
      loadProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Erro ao excluir produto')
    }
  }

  const getStoreName = (store: string) => {
    switch (store) {
      case 'shopee': return 'Shopee'
      case 'amazon': return 'Amazon'
      case 'mercado_livre': return 'Mercado Livre'
      default: return store
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563eb]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src={logoWellshop} 
                alt="WellShop" 
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-xl font-bold text-[#374151]">Painel Admin</h1>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-[#374151] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de Produtos</p>
                <p className="text-2xl font-bold text-[#374151]">{products.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Cliques Rastreados</p>
                <p className="text-2xl font-bold text-[#374151]">
                  {stats.reduce((sum, stat) => sum + stat.total_clicks, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Produtos Ativos</p>
                <p className="text-2xl font-bold text-[#374151]">
                  {products.filter(p => p.active).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  <Plus className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">Adicionar Produto</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">
                    Loja *
                  </label>
                  <LojaSelector
                    selectedStore={formData.store_type}
                    onStoreSelect={(store) => setFormData(prev => ({ ...prev, store_type: store, store: store as any }))}
                    error={storeError}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Nome Do Produto *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Fone Bluetooth JBL Tune 510"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 placeholder-gray-400 bg-gray-50/50 hover:bg-white transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Preço Atual *
                    </label>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      required
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="0,00"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 placeholder-gray-400 bg-gray-50/50 hover:bg-white transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Preço Original
                    </label>
                    <input
                      id="original_price"
                      name="original_price"
                      type="number"
                      step="0.01"
                      value={formData.original_price}
                      onChange={(e) => setFormData(prev => ({ ...prev, original_price: e.target.value }))}
                      placeholder="0,00 (opcional)"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 placeholder-gray-400 bg-gray-50/50 hover:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Categoria
                    </label>
                    <input
                      id="category"
                      name="category"
                      type="text"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="Ex: Eletrônicos, Moda..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 placeholder-gray-400 bg-gray-50/50 hover:bg-white transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Avaliação (0-5)
                    </label>
                    <input
                      id="rating"
                      name="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                      placeholder="Ex: 4.5"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 placeholder-gray-400 bg-gray-50/50 hover:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Nº De Avaliações
                    </label>
                    <input
                      id="rating_count"
                      name="rating_count"
                      type="number"
                      min="0"
                      value={formData.rating_count}
                      onChange={(e) => setFormData(prev => ({ ...prev, rating_count: e.target.value }))}
                      placeholder="Ex: 1250"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 placeholder-gray-400 bg-gray-50/50 hover:bg-white transition-all font-medium"
                    />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    URL Da Imagem *
                  </label>
                  <input
                    id="image_url"
                    name="image_url"
                    type="url"
                    required
                    value={formData.image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 placeholder-gray-400 bg-gray-50/50 hover:bg-white transition-all font-medium mb-3"
                  />
                  
                  <div className="w-full h-48 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center bg-gray-50/50 text-gray-400 overflow-hidden relative group">
                    {uploading && (
                       <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
                          <span className="text-purple-600 font-bold text-sm">Enviando...</span>
                       </div>
                    )}
                    {formData.image_url ? (
                      <img src={formData.image_url} alt="Preview" className="w-full h-full object-contain" />
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 mb-2 opacity-40 group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-xs font-semibold text-gray-400">Prévia da imagem</span>
                      </>
                    )}
                  </div>
                  
                  {/* Escondendo o antigo botão de upload atrás da customização */}
                  <div className="mt-2 text-right">
                    <label className="text-[10px] font-bold text-purple-600 hover:text-purple-800 uppercase tracking-wider cursor-pointer transition-colors">
                      Ou enviar arquivo do computador
                      <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploading}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Link De Afiliado *
                  </label>
                  <input
                    id="affiliate_link"
                    name="affiliate_link"
                    type="url"
                    required
                    value={formData.affiliate_link}
                    onChange={(e) => setFormData(prev => ({ ...prev, affiliate_link: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 placeholder-gray-400 bg-gray-50/50 hover:bg-white transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Descrição Curta
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descreva brevemente o produto, principais características..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 placeholder-gray-400 bg-gray-50/50 hover:bg-white transition-all font-medium resize-y"
                    rows={3}
                  />
                </div>

                <div className="flex items-center gap-6 py-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 accent-purple-600"
                    />
                    <span className="text-xs font-semibold text-gray-700">⭐ Produto em Destaque</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                      className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 accent-green-600"
                    />
                    <span className="text-xs font-semibold text-gray-700">✅ Produto Ativo</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 text-white px-6 py-4 rounded-xl font-bold text-sm tracking-wide hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    {editingId ? 'Atualizar Produto' : 'Adicionar Produto'}
                  </button>
                  
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null)
                        setStoreError(false)
                        setFormData({
                          name: '',
                          description: '',
                          price: '',
                          original_price: '',
                          image_url: '',
                          affiliate_link: '',
                          store: 'shopee',
                          store_type: 'shopee',
                          category: '',
                          rating: '',
                          rating_count: '',
                          featured: false,
                          active: true
                        })
                      }}
                      className="px-5 py-4 bg-gray-100 text-gray-500 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Products List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[#374151] mb-6">Produtos Cadastrados</h2>
              
              <div className="space-y-4">
                {products.map(product => (
                  <div key={product.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-[#374151]">{product.name}</h3>
                      <p className="text-sm text-gray-600">R$ {product.price.toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-lg">
                          {getStoreName(product.store)}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-lg">
                          {product.category}
                        </span>
                        {product.featured && (
                          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg">
                            Destaque
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.image_url)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
