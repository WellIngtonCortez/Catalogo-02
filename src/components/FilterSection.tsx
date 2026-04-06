import { useState, useEffect } from 'react'
import { Category } from '../services/supabase'

interface FilterSectionProps {
  selectedStore: string
  setSelectedStore: (store: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  sortBy: string
  setSortBy: (sort: any) => void
  categories: Category[]
  stores: any[]
}

export function FilterSection({
  selectedStore,
  setSelectedStore,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  categories,
  stores
}: FilterSectionProps) {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate opacity and translation based on scroll
  // Fade out starts at 100px and ends at 400px
  const opacity = Math.max(0, 1 - Math.max(0, scrollY - 100) / 300)
  const translateY = Math.min(20, Math.max(0, scrollY - 100) / 10)
  const isHidden = opacity === 0

  return (
    <section className="bg-white/80 backdrop-blur-md sticky top-[80px] z-30 border-y border-gray-100 py-4 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
          {/* Store Filter - Fades out on scroll */}
          <div 
            className="flex items-center gap-4 w-full lg:w-auto transition-all duration-300 origin-top"
            style={{ 
              opacity: opacity,
              transform: `translateY(${-translateY}px)`,
              pointerEvents: isHidden ? 'none' : 'auto',
              maxHeight: isHidden ? '0' : '200px',
              margin: isHidden ? '0' : '',
              visibility: isHidden ? 'hidden' : 'visible'
            }}
          >
            <div className="flex bg-gray-100/50 p-2 rounded-[24px] border border-gray-100 w-full lg:w-auto overflow-x-auto no-scrollbar snap-x gap-1">
              {stores.map(store => {
                const isActive = selectedStore === store.id
                return (
                  <button
                    key={store.id}
                    onClick={() => setSelectedStore(isActive ? 'all' : store.id)}
                    className={`flex-none flex items-center justify-center p-3 rounded-2xl transition-all duration-500 group/btn snap-center min-w-[70px] ${
                      isActive
                        ? 'bg-white text-blue-600 shadow-2xl shadow-blue-500/20 ring-1 ring-black/5 transform scale-[1.05]'
                        : 'text-gray-400 hover:text-gray-900 hover:bg-white/80 hover:shadow-xl'
                    }`}
                  >
                    {store.logo && (
                      <div 
                        className={`relative flex items-center justify-center transition-all duration-500 ${isActive ? 'scale-[1.12] drop-shadow-md' : 'grayscale group-hover/btn:grayscale-0 group-hover/btn:scale-105 opacity-60 group-hover/btn:opacity-100'}`}
                        style={{ 
                          transform: isActive ? `scale(${(store.scale || 1) * 1.12})` : `scale(${store.scale || 1})`,
                          minWidth: store.id === 'mercado_livre' ? '120px' : store.id === 'aliexpress' ? '100px' : 'auto',
                          padding: store.id === 'aliexpress' ? '0 10px' : '0'
                        }}
                      >
                        <img 
                          src={store.logo} 
                          alt={store.name} 
                          className="h-8 w-auto object-contain max-w-[150px] block mx-auto"
                        />
                      </div>
                    )}
                    {!store.logo && (
                       <div className="flex items-center gap-2 px-2">
                        <store.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                        <span className={`text-sm font-bold ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>{store.name}</span>
                       </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Combined Secondary Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">Categoria</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all cursor-pointer appearance-none hover:bg-white min-w-[160px]"
              >
                <option value="all">Todas</option>
                {categories.map(category => (
                  <option key={category.name} value={category.name}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">Ordenar</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full sm:w-auto bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all cursor-pointer appearance-none hover:bg-white min-w-[160px]"
              >
                <option value="newest">Mais recentes</option>
                <option value="price_asc">Menor preço</option>
                <option value="price_desc">Maior preço</option>
                <option value="rating">Melhor avaliação</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
