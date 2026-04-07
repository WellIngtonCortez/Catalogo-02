import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ProductService } from '../services/productService'
import { AnalyticsService } from '../services/analyticsService'
import { Product } from '../services/supabase'
import { Star, ShoppingBag, Flame, Tag, ArrowLeft, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

import logoWellshop from '../assets/logo_wellshop.png'

export function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadProduct(id)
    }
  }, [id])

  const loadProduct = async (productId: string) => {
    try {
      setLoading(true)
      const data = await ProductService.getProductById(productId)
      setProduct(data)
    } catch (error) {
      console.error('Error loading product:', error)
      toast.error('Produto não encontrado')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleAffiliateClick = async () => {
    if (!product || !product.affiliate_link) return

    // Prevenção de XSS: Garantir que a URL comece com http ou https
    if (!product.affiliate_link.startsWith('http://') && !product.affiliate_link.startsWith('https://')) {
      console.error('URL de afiliado inválida detectada:', product.affiliate_link)
      toast.error('Link de produto inválido')
      return
    }

    try {
      // Registrar clique antes de redirecionar
      await AnalyticsService.trackClick(product.id)
      
      // Redirecionar para link de afiliado seguro
      window.open(product.affiliate_link, '_blank', 'noopener,noreferrer')
      
      toast.success('Redirecionando para a loja...')
    } catch (error) {
      console.error('Error tracking click:', error)
      // Ainda redireciona mesmo se falhar o tracking
      window.open(product.affiliate_link, '_blank', 'noopener,noreferrer')
    }
  }

  const getStoreIcon = () => {
    switch (product?.store) {
      case 'shopee':
        return <Flame className="w-5 h-5 text-orange-500" />
      case 'amazon':
        return <ShoppingBag className="w-5 h-5 text-yellow-500" />
      case 'mercado_livre':
        return <Tag className="w-5 h-5 text-blue-500" />
      default:
        return null
    }
  }

  const getStoreName = () => {
    switch (product?.store) {
      case 'shopee': return 'Shopee'
      case 'amazon': return 'Amazon'
      case 'mercado_livre': return 'Mercado Livre'
      default: return product?.store || ''
    }
  }

  const getStoreColor = () => {
    switch (product?.store) {
      case 'shopee':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'amazon':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'mercado_livre':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563eb]"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#374151] mb-4">Produto não encontrado</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-[#2563eb] text-white px-6 py-3 rounded-2xl font-medium hover:bg-blue-700 transition-colors"
          >
            Voltar para o catálogo
          </button>
        </div>
      </div>
    )
  }

  const discount = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0

  return (
    <>
      <Helmet>
        <title>{product.name} - WellShop</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.image_url} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="product" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.name} />
        <meta name="twitter:description" content={product.description} />
        <meta name="twitter:image" content={product.image_url} />
      </Helmet>

      <div className="min-h-screen bg-[#FAFAFA]">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 text-[#374151] hover:text-[#2563eb] transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Voltar</span>
                </button>
                
                <div className="flex items-center gap-2">
                  {getStoreIcon()}
                  <span className={`px-3 py-1 rounded-lg border text-sm font-medium ${getStoreColor()}`}>
                    {getStoreName()}
                  </span>
                </div>
              </div>

                <div className="flex items-center gap-2">
                  <img src={logoWellshop} alt="WellShop" className="h-8 w-auto object-contain" />
                </div>
            </div>
          </div>
        </header>

        {/* Product Detail */}
        <main className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {discount > 0 && (
                <div className="bg-red-500 text-white px-4 py-2 rounded-xl text-center font-semibold">
                  {discount}% OFF - Aproveite!
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-light text-[#374151] mb-2">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium text-[#374151]">{product.rating}</span>
                  </div>
                  <span className="text-gray-500">({product.rating_count} avaliações)</span>
                  
                  <span className={`px-3 py-1 rounded-lg border text-sm font-medium ${getStoreColor()}`}>
                    {product.category}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold text-[#374151]">
                    R$ {product.price.toFixed(2)}
                  </span>
                  {product.original_price && product.original_price > product.price && (
                    <span className="text-xl text-gray-500 line-through">
                      R$ {product.original_price.toFixed(2)}
                    </span>
                  )}
                </div>
                
                {discount > 0 && (
                  <div className="text-green-600 font-medium">
                    Economia de R$ {(product.original_price! - product.price).toFixed(2)}
                  </div>
                )}
              </div>

              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleAffiliateClick}
                  className="w-full bg-[#2563eb] text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-5 h-5" />
                   Comprar na {getStoreName()}
                </button>

                <div className="text-center text-sm text-gray-500">
                  Ao clicar, você será redirecionado para a loja oficial. Este é um link de afiliado.
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-semibold text-[#374151] text-lg">Informações do Produto</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loja:</span>
                    <span className="font-medium text-[#374151]">{getStoreName()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Categoria:</span>
                    <span className="font-medium text-[#374151]">{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avaliação:</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium text-[#374151]">{product.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
