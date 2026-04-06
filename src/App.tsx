import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
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
import { Hero } from './components/Hero'
import { FilterSection } from './components/FilterSection'
import { Footer } from './components/Footer'
import { FeaturedCarousel } from './components/FeaturedCarousel'

function App() {
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
    { id: 'shopee', name: 'Shopee', icon: Flame, logo: shopeeLogo, scale: 1.1 },
    { id: 'amazon', name: 'Amazon', icon: ShoppingBag, logo: amazonLogo, scale: 1.1 },
    { id: 'mercado_livre', name: 'Mercado Livre', icon: Tag, logo: mercadolivreLogo, scale: 2.0 },
    { id: 'aliexpress', name: 'AliExpress', icon: Tag, logo: aliexpressLogo, scale: 0.95 },
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
            <Hero />

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

            {/* Featured and Flash Sale Section */}
            {!debouncedSearch && selectedStore === 'all' && selectedCategory === 'all' && (
              <FeaturedCarousel
                products={[
                  ...featuredProducts, 
                  ...flashSaleProducts,
                  // Mock products to fill the carousel
                  {
                    id: 'mock-1',
                    name: 'Fone Bluetooth JBL Tune 510BT Pure Bass',
                    description: 'Fone de ouvido com som Pure Bass e até 40 horas de bateria.',
                    price: 249.90,
                    original_price: 399.90,
                    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
                    affiliate_link: '#',
                    store: 'shopee',
                    store_type: 'shopee',
                    category: 'Eletrônicos',
                    rating: 4.8,
                    rating_count: 1250,
                    featured: true,
                    flash_sale: true,
                    active: true,
                    created_at: new Date().toISOString()
                  },
                  {
                    id: 'mock-2',
                    name: 'Smartwatch Series 9 - Caixa de Alumínio',
                    description: 'Relógio inteligente com monitoramento de saúde avançado.',
                    price: 1899.00,
                    original_price: 2499.00,
                    image_url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800',
                    affiliate_link: '#',
                    store: 'amazon',
                    store_type: 'amazon',
                    category: 'Acessórios',
                    rating: 4.9,
                    rating_count: 840,
                    featured: true,
                    active: true,
                    created_at: new Date().toISOString()
                  },
                  {
                    id: 'mock-3',
                    name: 'Tênis Nike Air Force 1 07 - White',
                    description: 'O clássico da Nike com amortecimento Air e estilo atemporal.',
                    price: 749.90,
                    original_price: 899.00,
                    image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800',
                    affiliate_link: '#',
                    store: 'mercado_livre',
                    store_type: 'mercado_livre',
                    category: 'Moda',
                    rating: 4.7,
                    rating_count: 2100,
                    featured: true,
                    active: true,
                    created_at: new Date().toISOString()
                  },
                  {
                    id: 'mock-4',
                    name: 'Câmera Canon EOS R50 Mirrorless 4K',
                    description: 'Câmera profissional compacta para criadores de conteúdo.',
                    price: 4999.00,
                    original_price: 5899.00,
                    image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
                    affiliate_link: '#',
                    store: 'aliexpress',
                    store_type: 'aliexpress',
                    category: 'Eletrônicos',
                    rating: 5.0,
                    rating_count: 156,
                    featured: true,
                    flash_sale: true,
                    active: true,
                    created_at: new Date().toISOString()
                  },
                  {
                    id: 'mock-5',
                    name: 'Mouse Gamer Logitech G Pro Wireless',
                    description: 'O mouse preferido dos profissionais de eSports.',
                    price: 549.90,
                    original_price: 799.00,
                    image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800',
                    affiliate_link: '#',
                    store: 'amazon',
                    store_type: 'amazon',
                    category: 'Informática',
                    rating: 4.9,
                    rating_count: 3200,
                    featured: true,
                    active: true,
                    created_at: new Date().toISOString()
                  }
                ]}
                title="Destaques e Ofertas"
                subtitle="Nossa seleção especial com os itens mais desejados e as ofertas relâmpago mais imperdíveis da semana."
                onProductClick={handleProductClick}
              />
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
