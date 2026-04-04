import { Product } from '../services/supabase'
import { Star, ShoppingBag, Flame, Tag } from 'lucide-react'

interface ProductCardProps {
  product: Product
  onClick?: (product: Product) => void
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const discount = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0

  const getStoreIcon = () => {
    switch (product.store) {
      case 'shopee':
        return <Flame className="w-4 h-4 text-orange-500" />
      case 'amazon':
        return <ShoppingBag className="w-4 h-4 text-yellow-500" />
      case 'mercado_livre':
        return <Tag className="w-4 h-4 text-blue-500" />
      default:
        return null
    }
  }

  const getStoreName = () => {
    switch (product.store) {
      case 'shopee': return 'Shopee'
      case 'amazon': return 'Amazon'
      case 'mercado_livre': return 'Mercado Livre'
      default: return product.store
    }
  }
  const getStoreColor = () => {
    switch (product.store) {
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

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer overflow-hidden hover:scale-[1.02] transform"
      onClick={() => onClick?.(product)}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
            -{discount}%
          </div>
        )}

        <div className="absolute top-3 right-3">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-medium ${getStoreColor()}`}>
            {getStoreIcon()}
            <span>{getStoreName()}</span>
          </div>
        </div>

        {product.featured && (
          <div className="absolute bottom-3 left-3 bg-[#2563eb] text-white px-2 py-1 rounded-lg text-xs font-semibold">
            ⭐ Destaque
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="font-semibold text-[#374151] text-lg mb-2 line-clamp-2 group-hover:text-[#2563eb] transition-colors">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium text-[#374151]">{product.rating}</span>
          </div>
          <span className="text-gray-400 text-sm">({product.rating_count})</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[#374151]">
                R$ {product.price.toFixed(2)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  R$ {product.original_price.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>

        <button className="bg-[#2563eb] text-white px-6 py-3 rounded-2xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Ver Detalhes
        </button>
      </div>
    </div>
  )
}
