import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ProductService } from './services/productService'
import { AnalyticsService } from './services/analyticsService'
import { ProductCard } from './components/ProductCard'
import { ProductDetail } from './pages/ProductDetail'
import { AdminPanel } from './pages/AdminPanel'
import { AdminLogin } from './pages/AdminLogin'
import { Filter, Star, ShoppingBag, Flame, Tag, PackageSearch } from 'lucide-react'
import { useDebounce } from './hooks/useDebounce'
import { Product, Category } from './services/supabase'
import logoWellshop from './assets/logo_wellshop.png'

// New Components
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { FilterSection } from './components/FilterSection'
import { Footer } from './components/Footer'

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
      await AnalyticsService.trackClick(product.id)
      window.open(product.affiliate_link, '_blank', 'noopener,noreferrer')
    } catch (error) {
      console.error('Error tracking click:', error)
      window.open(product.affiliate_link, '_blank', 'noopener,noreferrer')
    }
  }

  const stores = [
    { id: 'all', name: 'Geral', icon: Filter },
    { id: 'shopee', name: 'Shopee', icon: Flame },
    { id: 'amazon', name: 'Amazon', icon: ShoppingBag },
    { id: 'mercado_livre', name: 'M. Livre', icon: Tag },
  ]

  return (
    <Routes>
      <Route path="/" element={
        <div className="min-h-screen bg-white">
          <Header 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            logo={logoWellshop} 
          />

          <main className="animate-fade-in">
            <Hero stores={stores} />

            <FilterSection 
              selectedStore={selectedStore}
              setSelectedStore={setSelectedStore}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              sortBy={sortBy}
              setSortBy={setSortBy}
              categories={categories}
              stores={stores}
            />

            {/* Featured Section */}
            {featuredProducts.length > 0 && !debouncedSearch && selectedStore === 'all' && selectedCategory === 'all' && (
              <section className="py-20 lg:py-28 bg-[#FAFAFA]/50 overflow-hidden">
                <div className="container mx-auto px-6">
                  <div className="flex flex-col gap-4 mb-16 relative">
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-blue-600 rounded-full"></div>
                    <div className="flex bg-blue-50 w-fit px-3 py-1 rounded-lg border border-blue-100 text-blue-600">
                      <Star className="w-4 h-4 fill-blue-600 mr-2" />
                      <span className="text-xs font-bold uppercase tracking-wider">Destaques</span>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Produtos em Destaque</h2>
                    <p className="text-gray-500 max-w-xl leading-relaxed text-lg">
                      Nossa curadoria especial com os itens mais desejados da semana. Qualidade garantida com as melhores avaliações.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

            {/* Main Catalog Section */}
            <section className="py-20 lg:py-28 bg-white" id="catalog">
              <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-gray-100 pb-10">
                  <div className="space-y-4">
                    <div className="flex bg-gray-50 w-fit px-3 py-1 rounded-lg border border-gray-100 text-gray-500">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      <span className="text-xs font-bold uppercase tracking-wider">Catálogo {new Date().getFullYear()}</span>
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Todas as Ofertas</h2>
                    <p className="text-gray-500 max-w-xl text-lg">
                      Explore nossa lista completa com {totalProducts} produtos selecionados especialmente para você.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-lg">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Total Encontrado</span>
                    <span className="text-xl font-black">{totalProducts}</span>
                  </div>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm animate-pulse-slow">
                        <div className="aspect-square bg-gray-100"></div>
                        <div className="p-8 space-y-6">
                          <div className="h-6 bg-gray-100 rounded-lg w-3/4"></div>
                          <div className="space-y-3">
                            <div className="h-4 bg-gray-100 rounded-md w-full"></div>
                            <div className="h-4 bg-gray-100 rounded-md w-1/2"></div>
                          </div>
                          <div className="h-10 bg-gray-100 rounded-xl w-1/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-32 bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-200">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                      <PackageSearch className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Hmm, nada por aqui.</h3>
                    <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
                      Não encontramos produtos para sua busca ou filtros atuais. Tente mudar os termos ou resetar a pesquisa.
                    </p>
                    <button 
                      onClick={() => {
                        setSearchTerm('')
                        setSelectedCategory('all')
                        setSelectedStore('all')
                      }}
                      className="mt-10 px-8 py-3.5 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-black/10"
                    >
                      Limpar Filtros
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
                      <div className="flex justify-center items-center gap-3 mt-24">
                        <button
                          onClick={() => {
                            setCurrentPage(Math.max(1, currentPage - 1))
                            document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
                          }}
                          disabled={currentPage === 1}
                          className="px-8 py-4 bg-white border border-gray-100 rounded-2xl font-bold text-gray-900 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed group active:scale-95"
                        >
                          <span className="flex items-center gap-2">
                            Anterior
                          </span>
                        </button>
                        
                        <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
                          {[...Array(totalPages)].map((_, i) => (
                            <button
                              key={i + 1}
                              onClick={() => {
                                setCurrentPage(i + 1)
                                document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
                              }}
                              className={`w-12 h-12 rounded-xl font-bold transition-all duration-300 ${
                                currentPage === i + 1
                                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-4 ring-blue-600/10'
                                  : 'text-gray-400 hover:text-gray-900 hover:bg-white'
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>
                        
                        <button
                          onClick={() => {
                            setCurrentPage(Math.min(totalPages, currentPage + 1))
                            document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
                          }}
                          disabled={currentPage === totalPages}
                          className="px-8 py-4 bg-white border border-gray-100 rounded-2xl font-bold text-gray-900 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                        >
                          Próxima
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </section>
          </main>

          <Footer />
        </div>
      } />

      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  )
}

export default App
