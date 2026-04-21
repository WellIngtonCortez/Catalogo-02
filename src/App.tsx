import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { ProductService } from './services/productService'
import { AnalyticsService } from './services/analyticsService'
import { ProductCard } from './components/ProductCard'
import { ProductDetail } from './pages/ProductDetail'
import { AdminPanel } from './pages/AdminPanel'
import { AdminLogin } from './pages/AdminLogin'
import { ShoppingBag, Flame, Tag, PackageSearch } from 'lucide-react'
import { useDebounce } from './hooks/useDebounce'
import { Product, Category } from './services/supabase'
import logoWellshop from './assets/logo_wellshop.png'
import shopeeLogo from './assets/shopee.png'
import amazonLogo from './assets/amazon.png'
import mercadolivreLogo from './assets/mercadolivre.png'
import aliexpressLogo from './assets/aliexpress.png'

// New Components
import { Header } from './components/Header'
import { FilterSection } from './components/FilterSection'
import { Footer } from './components/Footer'
import { FeaturedCarousel } from './components/FeaturedCarousel'

function App() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([])
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
    loadFlashSaleProducts()
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

  const loadFlashSaleProducts = async () => {
    try {
      const flashSales = await ProductService.getFlashSaleProducts()
      setFlashSaleProducts(flashSales)
    } catch (error) {
      console.error('Error loading flash sale products:', error)
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

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`)
  }

  const stores = [
    { id: 'shopee', name: 'Shopee', icon: Flame, logo: shopeeLogo, scale: 1.1 },
    { id: 'amazon', name: 'Amazon', icon: ShoppingBag, logo: amazonLogo, scale: 1.1 },
    { id: 'mercado_livre', name: 'Mercado Livre', icon: Tag, logo: mercadolivreLogo, scale: 2.0 },
    { id: 'aliexpress', name: 'AliExpress', icon: Tag, logo: aliexpressLogo, scale: 0.95 },
  ]

  return (
    <Routes>
      <Route path="/" element={
        <div className="min-h-screen bg-gray-50/50">
          <Header
            logo={logoWellshop}
          />

          <main className="animate-fade-in">
            <FilterSection
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedStore={selectedStore}
              setSelectedStore={setSelectedStore}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              sortBy={sortBy}
              setSortBy={setSortBy}
              categories={categories}
              stores={stores}
            />

            {/* Featured and Flash Sale Section */}
            {!debouncedSearch && selectedStore === 'all' && selectedCategory === 'all' && (
              <FeaturedCarousel
                products={[...featuredProducts, ...flashSaleProducts]}
                title="Destaques e Ofertas"
                subtitle="Nossa seleção especial com os itens mais desejados e as ofertas relâmpago mais imperdíveis da semana."
                onProductClick={handleProductClick}
              />
            )}

            {/* Main Catalog Section */}
            <section className="py-20 lg:py-28 bg-white" id="catalog">
              <div className="container mx-auto px-6">


                {loading ? (
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
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
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8">
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
                              className={`w-12 h-12 rounded-xl font-bold transition-all duration-300 ${currentPage === i + 1
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
