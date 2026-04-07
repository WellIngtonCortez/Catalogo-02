import { Product } from '../services/supabase'
import { Flame, MoreHorizontal } from 'lucide-react'
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
    switch (product.store) {
      case 'shopee': return shopeeLogo
      case 'amazon': return amazonLogo
      case 'mercado_livre': return mercadolivreLogo
      case 'aliexpress': return aliexpressLogo
      default: return shopeeLogo
    }
  }

  const getStoreColor = () => {
    switch (product.store) {
      case 'shopee': return 'border-orange-100 hover:border-orange-500 shadow-orange-500/10'
      case 'amazon': return 'border-yellow-100 hover:border-yellow-500 shadow-yellow-500/10'
      case 'mercado_livre': return 'border-blue-100 hover:border-blue-500 shadow-blue-500/10'
      default: return 'border-gray-100 hover:border-gray-500 shadow-gray-500/10'
    }
  }

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer overflow-hidden flex flex-col h-full border border-gray-100"
      onClick={() => onClick?.(product)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Discount Badge - Top Right */}
        {discount > 0 && (
          <div className="absolute top-0 right-0 z-20 bg-[#e11d48]/10 backdrop-blur-md text-[#e11d48] px-2 py-1 rounded-bl-xl text-[10px] md:text-xs font-black border-l border-b border-rose-100 shadow-sm">
            {discount}% OFF
          </div>
        )}

        {/* Store Logo - Top Left for separation */}
        <div className="absolute top-2 left-2 z-20 pointer-events-none select-none transition-all duration-300">
           <div className={`p-1 bg-white rounded-xl shadow-md border ${getStoreColor()} flex items-center justify-center w-10 h-10 md:w-12 md:h-12 overflow-hidden ring-2 ring-white/50`}>
             <img src={getStoreLogo() || ''} alt={product.store} className="w-full h-full object-contain" />
            </div>
        </div>

        {/* Destaque Badge - Bottom Left */}
        {product.featured && (
          <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1.5 bg-blue-600/90 text-white px-2.5 py-1 rounded-full shadow-lg shadow-blue-600/20 border border-blue-400">
             <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
             <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Destaque</span>
          </div>
        )}

        {/* Flash Sale Badge - Bottom Right */}
        {product.flash_sale && (
          <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1.5 bg-orange-500/90 text-white px-2.5 py-1 rounded-full shadow-lg shadow-orange-600/20 border border-orange-400">
             <Flame className="w-3 h-3 fill-white" />
             <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest leading-none">Oferta</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 md:p-4 flex flex-col flex-1 gap-1.5 md:gap-2">
        {/* Featured / Indicado Badge from image */}
        {product.featured && (
          <div className="flex">
            <span className="bg-[#e11d48] text-white text-[9px] md:text-xs px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">
              Indicado
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-[#374151] text-xs md:text-sm font-medium line-clamp-2 leading-snug min-h-[2.5rem] md:min-h-[2.8rem]">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="mt-auto pt-1">
          <div className="flex flex-col">
             <div className="flex items-baseline gap-1">
                <span className="text-sm md:text-lg font-bold text-[#e11d48]">
                   R${product.price.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-[10px] md:text-xs text-gray-500 font-medium">no Pix</span>
             </div>
             
             {product.original_price && product.original_price > product.price && (
               <span className="text-[10px] text-gray-400 line-through -mt-1 hidden md:block">
                 R$ {product.original_price.toFixed(2).replace('.', ',')}
               </span>
             )}
          </div>
        </div>

        {/* Bottom Info: Sold & More like image */}
        <div className="flex items-center justify-between mt-1 pt-2 border-t border-gray-50">
           <span className="text-[10px] md:text-xs text-gray-400 font-medium whitespace-nowrap">
             {product.rating_count} vendidos
           </span>
           <button className="text-gray-300 hover:text-gray-500 transition-colors p-1">
             <MoreHorizontal className="w-4 h-4 md:w-5 h-5" />
           </button>
        </div>
      </div>
    </div>
  )
}
