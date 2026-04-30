import { Product } from '../services/supabase'
import { formatPrice } from '../utils/format'
import { ExternalLink, Star } from 'lucide-react'
import shopeeLogo from '../assets/shopee.png'
import amazonLogo from '../assets/amazon.png'
import mercadolivreLogo from '../assets/mercadolivre.png'
import aliexpressLogo from '../assets/aliexpress.png'

interface ProductCardProps {
  product: Product
  onClick?: (product: Product) => void
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const discount = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0

  const getStoreLogo = () => {
    const store = product.store?.toLowerCase()
    switch (store) {
      case 'shopee': return shopeeLogo
      case 'amazon': return amazonLogo
      case 'mercado_livre':
      case 'mercadolivre': return mercadolivreLogo
      case 'aliexpress': return aliexpressLogo
      default: return shopeeLogo
    }
  }

  return (
    <div 
      className="premium-card group h-full flex flex-col"
      onClick={() => onClick?.(product)}
    >
      <div className="relative aspect-square overflow-hidden bg-white">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-100/20 via-transparent to-blue-100/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-brand-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        <img
          src={product.image_url}
          alt={product.name}
          className="relative z-10 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        
        {/* Floating Store Badge - Discreto e Elegante */}
        <div className="absolute top-4 left-4 z-20">
           <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-soft border border-white/50 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
             <img src={getStoreLogo() || ''} alt={product.store} className="w-full h-full object-contain" />
            </div>
        </div>

        {/* Discount Tag - Estilo Apple */}
        {discount > 0 && (
          <div className="absolute top-4 right-4 z-20 bg-brand-primary text-white px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold shadow-lg shadow-brand-primary/20">
            -{discount}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 md:p-6 flex flex-col flex-1 gap-3">
        {/* Category & Stats */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">
            {product.category}
          </span>
          <div className="flex items-center gap-1 text-gray-400">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] md:text-xs font-medium">{product.rating}</span>
          </div>
        </div>

        {/* Title - Navy #1A2B4C */}
        <h3 className="text-brand-secondary text-sm md:text-base font-semibold line-clamp-2 leading-snug min-h-[3rem]">
          {product.name}
        </h3>

        <div className="mt-auto space-y-4">
          {/* Price Container */}
          <div className="flex items-baseline gap-2">
            <span className="text-xl md:text-2xl font-extrabold text-brand-primary">
              {formatPrice(product.price)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-xs md:text-sm text-gray-300 line-through font-medium">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>

          {/* Action Button - Orange #F27121 */}
          <button 
            className="btn-primary w-full text-xs md:text-sm py-3.5"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.(product);
            }}
          >
            <span>Ver Oferta</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
