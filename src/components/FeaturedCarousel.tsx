import { useRef } from 'react'
import { Product } from '../services/supabase'
import { ProductCard } from './ProductCard'
import { ChevronLeft, ChevronRight, Star, Flame } from 'lucide-react'

interface FeaturedCarouselProps {
  products: Product[]
  title: string
  subtitle?: string
  onProductClick: (product: Product) => void
}

export function FeaturedCarousel({ products, title, subtitle, onProductClick }: FeaturedCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollTo = direction === 'left'
        ? scrollLeft - clientWidth * 0.8
        : scrollLeft + clientWidth * 0.8

      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      })
    }
  }

  if (products.length === 0) return null

  return (
    <section className="py-12 lg:py-16 bg-[#FAFAFA]/50 overflow-hidden relative group">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="flex flex-col gap-3 relative">
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1 h-10 bg-blue-600 rounded-full"></div>
            <div className="flex items-center gap-2">
              <div className="flex bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-100 text-blue-600">
                <Star className="w-3.5 h-3.5 fill-blue-600 mr-1.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Destaques</span>
              </div>
              <div className="flex bg-orange-50 px-2.5 py-0.5 rounded-lg border border-orange-100 text-orange-600">
                <Flame className="w-3.5 h-3.5 fill-orange-600 mr-1.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Ofertas</span>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">{title}</h2>
            {subtitle && (
              <p className="text-gray-500 max-w-lg leading-relaxed text-sm md:text-base">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm hover:shadow-lg hover:border-blue-200 transition-all text-gray-500 hover:text-blue-600"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm hover:shadow-lg hover:border-blue-200 transition-all text-gray-500 hover:text-blue-600"
              aria-label="Próximo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 pt-2 snap-x no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div key={product.id} className="min-w-[260px] md:min-w-[300px] snap-center">
              <ProductCard
                product={product}
                onClick={onProductClick}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/20 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-50/10 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>
    </section>
  )
}
