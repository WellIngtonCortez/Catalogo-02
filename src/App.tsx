import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { ProductService } from './services/productService'
import { ProductCard } from './components/ProductCard'
import { ProductDetail } from './pages/ProductDetail'
import { AdminPanel } from './pages/AdminPanel'
import { AdminLogin } from './pages/AdminLogin'
import { PackageSearch, ArrowLeft, ArrowRight } from 'lucide-react'
import { useDebounce } from './hooks/useDebounce'
import { Product, Category } from './services/supabase'
import logoUniShopBr from './assets/logo_unishopbr.png'
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
    { id: 'shopee', name: 'Shopee', logo: shopeeLogo },
    { id: 'amazon', name: 'Amazon', logo: amazonLogo },
    { id: 'mercado_livre', name: 'Mercado Livre', logo: mercadolivreLogo },
    { id: 'aliexpress', name: 'AliExpress', logo: aliexpressLogo },
  ]

  return (
    <Routes>
      <Route path="/" element={
        <div className="min-h-screen bg-gradient-to-tr from-orange-50 via-white to-blue-50">
          <Header
            logo={logoUniShopBr}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          <main className="animate-fade-in">
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
                products={[...featuredProducts, ...flashSaleProducts]}
                title=""
                subtitle=""
                onProductClick={handleProductClick}
              />
            )}

            {/* Main Catalog Section */}
            <section className="py-16 md:py-24" id="catalog">
              <div className="container mx-auto px-6">
                {loading ? (
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm animate-pulse-slow">
                        <div className="aspect-square bg-gray-50"></div>
                        <div className="p-8 space-y-6">
                          <div className="h-6 bg-gray-50 rounded-lg w-3/4"></div>
                          <div className="space-y-3">
                            <div className="h-4 bg-gray-50 rounded-md w-full"></div>
                            <div className="h-4 bg-gray-50 rounded-md w-1/2"></div>
                          </div>
                          <div className="h-10 bg-gray-50 rounded-xl w-1/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-32 bg-brand-soft rounded-[3rem] border border-gray-100">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-soft">
                      <PackageSearch className="w-10 h-10 text-brand-secondary/20" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900 mb-4 tracking-wide">Ops! Nenhum produto encontrado.</h3>
                    <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
                      Não encontramos o que você procura com os filtros atuais.
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm('')
                        setSelectedCategory('all')
                        setSelectedStore('all')
                      }}
                      className="mt-10 btn-secondary"
                    >
                      Limpar filtros
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
                      {products.map(product => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onClick={handleProductClick}
                        />
                      ))}
                    </div>

                    {/* Pagination - Estilo Premium */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-6 mt-24">
                        <button
                          onClick={() => {
                            setCurrentPage(Math.max(1, currentPage - 1))
                            window.scrollTo({ top: 300, behavior: 'smooth' })
                          }}
                          disabled={currentPage === 1}
                          className="btn-secondary px-8 py-4 disabled:opacity-20"
                        >
                          <ArrowLeft className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2 p-2 bg-brand-soft rounded-[2rem] border border-gray-100">
                          {[...Array(totalPages)].map((_, i) => (
                            <button
                              key={i + 1}
                              onClick={() => {
                                setCurrentPage(i + 1)
                                window.scrollTo({ top: 300, behavior: 'smooth' })
                              }}
                              className={`w-12 h-12 rounded-2xl font-bold transition-all duration-300 ${currentPage === i + 1
                                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                                : 'text-brand-secondary/40 hover:text-brand-secondary hover:bg-white'
                                }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => {
                            setCurrentPage(Math.min(totalPages, currentPage + 1))
                            window.scrollTo({ top: 300, behavior: 'smooth' })
                          }}
                          disabled={currentPage === totalPages}
                          className="btn-secondary px-8 py-4 disabled:opacity-20"
                        >
                          <ArrowRight className="w-5 h-5" />
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
