import { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { ProductService } from './services/productService'
import { AnalyticsService } from './services/analyticsService'
import { ProductCard } from './components/ProductCard'
import { ProductDetail } from './pages/ProductDetail'
import { AdminPanel } from './pages/AdminPanel'
import { AdminLogin } from './pages/AdminLogin'
import { Search, Filter, Star, ShoppingBag, Flame, Tag } from 'lucide-react'
import { useDebounce } from './hooks/useDebounce'
import { Product, Category } from './services/supabase'
import logoWellshop from './assets/logo_wellshop.png'

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStore, setSelectedStore] = useState('all')
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'rating'>('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)

  const debouncedSearch = useDebounce(searchTerm, 300)

  const productsPerPage = 12
  const totalPages = Math.ceil(totalProducts / productsPerPage)

  useEffect(() => {
    loadFeaturedProducts()
    loadCategories()
  }, [])

  useEffect(() => {
    loadProducts()
  }, [debouncedSearch, selectedCategory, selectedStore, sortBy, currentPage])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const offset = (currentPage - 1) * productsPerPage
      const { products: newProducts, total } = await ProductService.getProducts(
        selectedCategory,
        selectedStore,
        debouncedSearch,
        sortBy,
        productsPerPage,
        offset
      )
      setProducts(newProducts)
      setTotalProducts(total)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadFeaturedProducts = async () => {
    try {
      const featured = await ProductService.getFeaturedProducts()
      setFeaturedProducts(featured)
    } catch (error) {
      console.error('Error loading featured products:', error)
    }
  }

  const loadCategories = async () => {
    try {
      const cats = await ProductService.getCategories()
      setCategories(cats)
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const handleProductClick = async (product: Product) => {
    try {
      // Registrar clique antes de redirecionar
      await AnalyticsService.trackClick(product.id)
      
      // Redirecionar para link de afiliado
      window.open(product.affiliate_link, '_blank', 'noopener,noreferrer')
    } catch (error) {
      console.error('Error tracking click:', error)
      // Ainda redireciona mesmo se falhar o tracking
      window.open(product.affiliate_link, '_blank', 'noopener,noreferrer')
    }
  }

  const stores = [
    { id: 'all', name: 'Todas as lojas', icon: Filter },
    { id: 'shopee', name: 'Shopee', icon: Flame },
    { id: 'amazon', name: 'Amazon', icon: ShoppingBag },
    { id: 'mercadolivre', name: 'Mercado Livre', icon: Tag },
  ]

  return (
    <Routes>
      {/* Catálogo Principal */}
      <Route path="/" element={
        <div className="min-h-screen bg-[#FAFAFA]">
          {/* Header */}
          <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link to="/" className="flex items-center gap-2">
                    <img 
                      src={logoWellshop} 
                      alt="WellShop" 
                      className="w-25 h-16 object-contain"
                    />
                    <h1 className="text-2xl font-bold text-[#374151]"></h1>
                  </Link>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar produtos..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-opacity-20 transition-all duration-200 pl-10 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Link 
                    to="/admin/login"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    <span className="text-sm font-medium">Admin</span>
                  </Link>
                </div>
              </div>
            </div>
          </header>

          {/* Hero Section */}
          <section className="bg-white py-16">
            <div className="container mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-4xl font-light text-[#374151] mb-4">
                  As melhores ofertas<br />
                  <span className="text-[#2563eb] font-semibold">em um só lugar</span>
                </h2>
                <p className="text-gray-600 text-lg mb-8">
                  Produtos selecionados da Shopee, Amazon e Mercado Livre com os melhores preços.
                </p>
                <div className="flex justify-center gap-4">
                  {stores.slice(1).map(store => {
                    const Icon = store.icon
                    return (
                      <div key={store.id} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{store.name}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Filters */}
          <section className="bg-white border-y border-gray-200 py-4">
            <div className="container mx-auto px-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Store Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Loja:</span>
                  <div className="flex gap-2">
                    {stores.map(store => {
                      const Icon = store.icon
                      return (
                        <button
                          key={store.id}
                          onClick={() => setSelectedStore(store.id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                            selectedStore === store.id
                              ? 'bg-[#2563eb] text-white'
                              : 'bg-gray-100 text-[#374151] hover:bg-gray-200'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{store.name}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Categoria:</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-opacity-20 transition-all duration-200 w-40"
                  >
                    <option value="all">Todas</option>
                    {categories.map(category => (
                      <option key={category.name} value={category.name}>
                        {category.name} ({category.count})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Ordenar:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-opacity-20 transition-all duration-200 w-40"
                  >
                    <option value="newest">Mais recentes</option>
                    <option value="price_asc">Menor preço</option>
                    <option value="price_desc">Maior preço</option>
                    <option value="rating">Melhor avaliação</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Products */}
          {featuredProducts.length > 0 && (
            <section className="py-16">
              <div className="container mx-auto px-6">
                <div className="flex items-center gap-2 mb-8">
                  <Star className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-2xl font-light text-[#374151]">Destaques</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={handleProductClick}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* All Products */}
          <section className="py-16">
            <div className="container mx-auto px-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-light text-[#374151]">Catálogo Completo</h2>
                <p className="text-gray-600">
                  {totalProducts} produtos encontrados
                </p>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-sm animate-pulse">
                      <div className="aspect-square bg-gray-200 rounded-t-2xl"></div>
                      <div className="p-6 space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-600 text-lg">Nenhum produto encontrado.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onClick={handleProductClick}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="bg-white text-[#374151] px-6 py-3 rounded-2xl font-medium border border-gray-200 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Anterior
                      </button>
                      
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                            currentPage === i + 1
                              ? 'bg-[#2563eb] text-white'
                              : 'bg-gray-100 text-[#374151] hover:bg-gray-200'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="bg-white text-[#374151] px-6 py-3 rounded-2xl font-medium border border-gray-200 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Próxima
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 py-12">
            <div className="container mx-auto px-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-[#2563eb] rounded-xl flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-light text-[#374151]">WellShop</h3>
                </div>
                <p className="text-gray-600 mb-2">© 2025 WellShop · Todos os direitos reservados</p>
                <p className="text-sm text-gray-500">
                  Este site contém links de afiliado. Ao comprar, você nos apoia sem pagar nada a mais.
                </p>
              </div>
            </div>
          </footer>
        </div>
      } />

      {/* Página de Detalhes */}
      <Route path="/product/:id" element={<ProductDetail />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  )
}

export default App
