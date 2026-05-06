import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { ProductService } from '../services/productService'
import { AnalyticsService } from '../services/analyticsService'
import { UploadService } from '../services/uploadService'
import { Product, ProductStats } from '../services/supabase'
import { formatPrice, parsePrice } from '../utils/format'
import { ShoppingBag, Edit, Trash2, BarChart3, LogOut, Plus, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { LojaSelector } from '../components/admin/LojaSelector'
import logoUniShopBr from '../assets/logo_unishopbr.png'

import logoSplash from '../assets/logo-splash.png'

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
  const [isFetchingData, setIsFetchingData] = useState(false)

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

  const fetchProductData = async (url: string) => {
    try {
      setIsFetchingData(true)

      // ─── LAYER 0: Fetch via Microlink (OG + Meta + structured data) ────────────
      const mlResponse = await fetch(
        `https://api.microlink.io?url=${encodeURIComponent(url)}&palette=true&audio=true&video=true&iframe=true`
      )
      const mlResult = await mlResponse.json()
      if (mlResult.status !== 'success' || !mlResult.data) {
        throw new Error('Microlink não retornou dados válidos')
      }
      const ml = mlResult.data
      const rawHtml = ml.html || ''

      // ─── HELPERS ─────────────────────────────────────────────────────────────────

      /** Normaliza preço para float string: "R$ 1.250,99" → "1250.99" */
      const normalizePrice = (raw: any): string => {
        if (!raw) return ''
        const s = String(raw).replace(/[^\d,.]/g, '')
        const lastComma = s.lastIndexOf(',')
        const lastDot   = s.lastIndexOf('.')
        if (lastComma > lastDot) return s.replace(/\./g, '').replace(',', '.')   // BR: 1.250,99
        if (lastDot > lastComma) return s.replace(/,/g, '')                      // US: 1,250.99
        return s.replace(',', '.')
      }

      /** Extrai primeiro número limpo de uma string de texto */
      const extractNumber = (s: string): string => {
        const m = s.replace(/[^\d]/g, '')
        return m.length > 0 && m.length <= 6 ? m : ''
      }

      /** Mapeamento inteligente de categoria por palavras-chave */
      const mapCategory = (text: string): string => {
        const t = text.toLowerCase()
        if (/iphone|samsung|xiaomi|celular|smartphone/.test(t)) return 'Celulares'
        if (/fone|airpods|headset|beatS|jbl|speaker/.test(t)) return 'Áudio'
        if (/teclado|mouse|monitor|gamer|notebook|pc|headset gamer/.test(t)) return 'Informática'
        if (/tv|televisão|televisor|smart tv/.test(t)) return 'TVs'
        if (/geladeira|fogão|microondas|máquina de lavar|eletrodoméstico/.test(t)) return 'Eletrodomésticos'
        if (/cachorro|gato|ração|pet|coleira|aquário/.test(t)) return 'Pets'
        if (/vestido|camisa|camiseta|calça|sapato|tênis|moda|roupa/.test(t)) return 'Moda'
        if (/bolsa|mochila|mala|carteira/.test(t)) return 'Bolsas e Malas'
        if (/relógio|joias|anel|brinco/.test(t)) return 'Joias e Relógios'
        if (/cozinha|panela|frigideira|utensílio/.test(t)) return 'Cozinha'
        if (/sofá|cama|travesseiro|edredom|colchão|móvel/.test(t)) return 'Casa e Decoração'
        if (/maquiagem|batom|skincare|perfume|protetor solar/.test(t)) return 'Beleza e Saúde'
        if (/brinquedo|boneca|lego|quebra-cabeça|infantil/.test(t)) return 'Brinquedos'
        if (/livro|literatura|romance|mangá/.test(t)) return 'Livros'
        if (/suplemento|whey|creatina|vitamina|academia/.test(t)) return 'Esporte e Saúde'
        return 'Geral'
      }

      // ─── LAYER 1: JSON-LD Parser ─────────────────────────────────────────────────
      // Mercado Livre, Amazon e Shopee encapsulam preço e rating em scripts ld+json
      let ldPrice = '', ldOriginalPrice = '', ldRating = '', ldReviewCount = ''
      const ldMatches = rawHtml.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)
      for (const match of ldMatches) {
        try {
          const json = JSON.parse(match[1])
          const entries = Array.isArray(json) ? json : [json]
          for (const entry of entries) {
            // Preço via Offers
            const offers = entry.offers || entry.Offers
            if (offers) {
              const offer = Array.isArray(offers) ? offers[0] : offers
              if (offer.price && !ldPrice) ldPrice = String(offer.price)
              if (offer.highPrice && !ldOriginalPrice) ldOriginalPrice = String(offer.highPrice)
            }
            // Rating via AggregateRating
            const aggRating = entry.aggregateRating || entry.AggregateRating
            if (aggRating) {
              if (aggRating.ratingValue && !ldRating) ldRating = String(aggRating.ratingValue)
              if (aggRating.reviewCount && !ldReviewCount) ldReviewCount = String(aggRating.reviewCount)
              if (aggRating.ratingCount && !ldReviewCount) ldReviewCount = String(aggRating.ratingCount)
            }
          }
        } catch { /* JSON inválido — ignora */ }
      }

      // ─── LAYER 2: Seletores Específicos por Domínio (Regex no HTML) ─────────────
      const lowerUrl = url.toLowerCase()
      let domainPrice = '', domainOriginalPrice = '', domainRating = '', domainReviewCount = ''

      if (lowerUrl.includes('amazon')) {
        // Amazon: .a-price-whole | .a-price-fraction
        const amzPriceM = rawHtml.match(/class="a-price-whole">([^<]+)<\/span>\s*<span[^>]*class="a-price-fraction">([^<]+)/)
        if (amzPriceM) domainPrice = `${amzPriceM[1].replace(/[^\d]/g, '')}.${amzPriceM[2].replace(/[^\d]/g, '')}`

        // Amazon: #acrCustomerReviewText "1.250 avaliações"
        const amzReviewM = rawHtml.match(/id="acrCustomerReviewText"[^>]*>([\d.,]+)\s/)
        if (amzReviewM) domainReviewCount = amzReviewM[1].replace(/[.,]/g, '')

        // Amazon: i.a-star-small-X-5 → nota
        const amzRatingM = rawHtml.match(/a-star-(?:small-)?(\d)-(\d)/)
        if (amzRatingM) domainRating = `${amzRatingM[1]}.${amzRatingM[2]}`

      } else if (lowerUrl.includes('mercadolivre') || lowerUrl.includes('meli.la')) {
        // ML: .andes-money-amount__fraction
        const mlPriceM = rawHtml.match(/andes-money-amount__fraction[^>]*>([^<]+)<\/span>/)
        if (mlPriceM) {
          const mlFractionM = rawHtml.match(/andes-money-amount__cents[^>]*>([^<]+)<\/span>/)
          domainPrice = `${mlPriceM[1].replace(/[^\d]/g, '')}.${mlFractionM ? mlFractionM[1] : '00'}`
        }
        // ML: .ui-pdp-review__rating
        const mlRatingM = rawHtml.match(/ui-pdp-review__rating[^>]*>([\d,]+)</)
        if (mlRatingM) domainRating = mlRatingM[1].replace(',', '.')

        // ML: .ui-pdp-review__amount "(1.250)"
        const mlCountM = rawHtml.match(/ui-pdp-review__amount[^>]*>\(?([\d.,]+)\)?</)
        if (mlCountM) domainReviewCount = mlCountM[1].replace(/[.,]/g, '')

      } else if (lowerUrl.includes('shopee') || lowerUrl.includes('shope.ee')) {
        // Shopee: data-e2e atributos ou classes de preço
        const spPriceM = rawHtml.match(/product-price[^>]*>([\d.,]+)</)
        if (spPriceM) domainPrice = normalizePrice(spPriceM[1])

        const spRatingM = rawHtml.match(/shopee-rating[^>]*>([\d.]+)</)
        if (spRatingM) domainRating = spRatingM[1]

      } else if (lowerUrl.includes('aliexpress')) {
        // AliExpress mantém preços em JSON dentro da página
        const aliPriceM = rawHtml.match(/"price":\s?"USD\s?([\d.]+)"/)
        if (aliPriceM) domainPrice = aliPriceM[1]

        const aliRatingM = rawHtml.match(/"averageStar":\s?"([\d.]+)"/)
        if (aliRatingM) domainRating = aliRatingM[1]

        const aliCountM = rawHtml.match(/"totalValidNum":\s?(\d+)/)
        if (aliCountM) domainReviewCount = aliCountM[1]
      }

      // ─── LAYER 3: Regex Geral no searchString (Fallback Final) ──────────────────
      const searchString = `${ml.title || ''} ${ml.description || ''} ${rawHtml}`

      const priceFromRegex = (): string => {
        const m = searchString.match(/(?:R\$|US\$|\$)\s?(\d{1,3}(?:[.,]\d{3})*[.,]\d{2})/)
        return m ? normalizePrice(m[1]) : ''
      }

      const ratingFromRegex = (): string => {
        const m = searchString.match(/(\d[.,]\d+)\s?(?:estrelas?|de 5|stars?|out of 5|★)/i)
        return m ? m[1].replace(',', '.') : ''
      }

      const reviewCountFromRegex = (): string => {
        const m = searchString.match(/(?:\(|\b)(\d{1,3}(?:[.,]\d{3})?)\s?(?:avaliaç|opini|ratings?|reviews?|comentários?)/i)
        return m ? extractNumber(m[1]) : ''
      }

      // ─── PRIORIDADE FINAL: JSON-LD > DOM Seletores > Regex > Defaults ────────────
      const finalPrice        = normalizePrice(ldPrice       || domainPrice        || ml.price || priceFromRegex())
      const finalOrigPrice    = normalizePrice(ldOriginalPrice || domainOriginalPrice)
      const finalRatingRaw    = ldRating      || domainRating      || ratingFromRegex()
      const finalReviewRaw    = ldReviewCount || domainReviewCount || reviewCountFromRegex()

      // Normaliza rating 0-5 (fallback inteligente: 5.0)
      let finalRating = finalRatingRaw ? String(Math.min(parseFloat(finalRatingRaw), 5)) : '5.0'

      // Nº de avaliações mínimo de 100 como fallback
      let finalReviewCount = finalReviewRaw || '100'

      // Título com validação anti-placeholder
      let title = ml.title || ''
      if (/^[a-zA-Z0-9-]+\.[a-z]{2,}$/.test(title) || title.length < 5 || title.toLowerCase().includes('perfil social')) {
        const fallbackTitle = ml.description?.match(/^([^.|!?]*)/)
        if (fallbackTitle && fallbackTitle[1].length > 10) title = fallbackTitle[1].trim()
      }

      // Categoria inteligente
      const category = mapCategory(`${title} ${ml.description || ''}`)

      // ─── Atualiza o formulário ─────────────────────────────────────────────────
      setFormData(prev => ({
        ...prev,
        name:           title              || prev.name,
        description:    ml.description     || prev.description,
        price:          finalPrice         || prev.price,
        original_price: finalOrigPrice     || prev.original_price,
        category:       category           || prev.category,
        rating:         finalRating        || prev.rating,
        rating_count:   finalReviewCount   || prev.rating_count,
        image_url:      ml.image?.url      || prev.image_url,
        affiliate_link:  url
      }))

      toast.success(`✅ ${title ? title.slice(0, 30) + '…' : 'Produto'} extraído com sucesso!`)
    } catch (error) {
      console.error('[UniShopBr] Erro na extração de produto:', error)
      toast.error('Não foi possível extrair os dados. Preencha manualmente.')
    } finally {
      setIsFetchingData(false)
    }
  }

  const handleUrlChange = (url: string) => {
    const lowerUrl = url.toLowerCase()
    let detectedStore = ''
    
    // Detecta a loja automaticamente
    if (lowerUrl.includes('amazon') || lowerUrl.includes('amzn.to')) detectedStore = 'amazon'
    else if (lowerUrl.includes('shopee') || lowerUrl.includes('shope.ee')) detectedStore = 'shopee'
    else if (lowerUrl.includes('aliexpress') || lowerUrl.includes('ali.express')) detectedStore = 'aliexpress'
    else if (lowerUrl.includes('mercadolivre') || lowerUrl.includes('meli.la') || lowerUrl.includes('mercado_livre')) detectedStore = 'mercado_livre'

    setFormData(prev => {
      const newData = { ...prev, affiliate_link: url }
      if (detectedStore) {
        newData.store_type = detectedStore
        newData.store = (detectedStore === 'mercado_livre' ? 'mercadolivre' : detectedStore) as any
      }
      return newData
    })
    
    // Dispara busca para qualquer uma das lojas suportadas
    const supportedStores = ['amazon', 'shopee', 'aliexpress', 'mercadolivre', 'mercado_livre', 'meli.la', 'amzn.to', 'shope.ee']
    const isSupported = supportedStores.some(store => lowerUrl.includes(store))
    
    if (isSupported && url.startsWith('http')) {
      fetchProductData(url)
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
      const productData: any = {
        name: formData.name,
        description: formData.description,
        price: parsePrice(formData.price),
        original_price: formData.original_price ? parsePrice(formData.original_price) : null,
        image_url: formData.image_url,
        affiliate_link: formData.affiliate_link,
        store: formData.store === 'mercado_livre' ? 'mercadolivre' : formData.store,
        store_type: formData.store_type,
        category: formData.category,
        rating: parseFloat(formData.rating) || 0,
        rating_count: parseInt(formData.rating_count) || 0,
        featured: formData.featured,
        active: formData.active
      }

      let error;

      if (editingId) {
        // Atualizar produto
        const { error: updateError } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingId)
        error = updateError;
      } else {
        // Criar produto
        const { error: insertError } = await supabase
          .from('products')
          .insert(productData)
        error = insertError;
      }

      if (error) {
        console.error('Supabase error:', error);
        toast.error(`Erro ao salvar: ${error.message || 'Erro desconhecido'}`);
        return;
      }

      toast.success(editingId ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!');

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
    } catch (error: any) {
      console.error('Error saving product:', error)
      toast.error('Erro ao salvar produto: ' + (error.message || 'Verifique os dados'))
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
      // Deletar imagem do storage (opcional, não bloqueia se falhar)
      if (imageUrl && !imageUrl.startsWith('http')) {
        try {
          await UploadService.deleteProductImage(imageUrl)
        } catch (err) {
          console.warn('Could not delete image from storage:', err)
        }
      }

      // Deletar produto do banco
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      toast.success('Produto excluído com sucesso!')
      loadProducts()
    } catch (error: any) {
      console.error('Error deleting product:', error)
      toast.error('Erro ao excluir produto: ' + (error.message || 'Tente novamente'))
    }
  }

  const getStoreName = (store: string) => {
    const s = store?.toLowerCase()
    switch (s) {
      case 'shopee': return 'Shopee'
      case 'amazon': return 'Amazon'
      case 'mercado_livre':
      case 'mercadolivre': return 'Mercado Livre'
      case 'aliexpress': return 'AliExpress'
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
                src={logoSplash} 
                alt="UniShopBr Admin" 
                className="h-10 w-auto object-contain"
              />
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
                    onChange={(e) => handleUrlChange(e.target.value)}
                    onPaste={(e) => {
                      const pastedUrl = e.clipboardData.getData('text')
                      handleUrlChange(pastedUrl)
                    }}
                    placeholder="https://..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 placeholder-gray-400 bg-gray-50/50 hover:bg-white transition-all font-medium"
                  />
                  {isFetchingData && (
                    <p className="mt-1 text-[10px] font-bold text-purple-600 animate-pulse">
                      ✨ Buscando dados do produto...
                    </p>
                  )}
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
                      <p className="text-sm text-gray-600">{formatPrice(product.price)}</p>
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
