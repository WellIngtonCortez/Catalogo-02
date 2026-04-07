import { useState, useEffect } from 'react'
import { Category } from '../services/supabase'
import { Search } from 'lucide-react'

interface FilterSectionProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
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
  searchTerm,
  setSearchTerm,
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

  // Fade out the store filter on mobile
  const opacity = Math.max(0, 1 - Math.max(0, scrollY - 100) / 300)
  const translateY = Math.min(20, Math.max(0, scrollY - 100) / 10)
  const isHidden = opacity === 0

  return (
    <section className="bg-white/90 backdrop-blur-md sticky top-[56px] md:top-[64px] z-40 border-b border-gray-200 py-4 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 lg:px-6 space-y-4">
        
        <div className="flex flex-col lg:flex-row items-center gap-4 w-full">
          
          {/* Search Input (Smaller) */}
          <div className="relative w-full lg:w-[260px] group shrink-0">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              id="search"
              name="search"
              type="text"
              placeholder="Buscar ofertas..."
              className="w-full px-4 py-2.5 rounded-xl bg-white lg:bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all duration-300 pl-10 shadow-sm text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <span className="text-[9px] font-bold bg-gray-200 px-1.5 py-0.5 rounded uppercase">Esc</span>
              </button>
            )}
          </div>

          {/* Sort and Category (Next to stores) */}
          <div className="flex flex-row items-center gap-3 w-full lg:w-auto shrink-0 overflow-x-auto no-scrollbar">
            <div className="flex flex-col flex-1 lg:flex-none min-w-[120px]">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Categoria</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-white px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-pointer shadow-sm truncate"
              >
                <option value="all">Todas as Categorias</option>
                {categories.map(category => (
                  <option key={category.name} value={category.name}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col flex-1 lg:flex-none min-w-[120px]">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Ordenar por</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-white px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-pointer shadow-sm truncate"
              >
                <option value="newest">Mais recentes</option>
                <option value="price_asc">Menor preço</option>
                <option value="price_desc">Maior preço</option>
                <option value="rating">Melhor avaliação</option>
              </select>
            </div>
          </div>

          {/* Store Filter - Next to category/sort */}
          <div 
            className="flex items-center gap-2 w-full lg:flex-1 transition-all duration-300 origin-top overflow-hidden"
            style={{ 
              opacity: window.innerWidth < 1024 ? opacity : 1,
              transform: `translateY(${window.innerWidth < 1024 ? -translateY : 0}px)`,
              pointerEvents: (window.innerWidth < 1024 && isHidden) ? 'none' : 'auto',
              maxHeight: (window.innerWidth < 1024 && isHidden) ? '0' : '200px',
            }}
          >
            <div className="flex bg-gray-50/80 p-1.5 rounded-xl border border-gray-100 w-full overflow-x-auto no-scrollbar snap-x gap-1">
              {stores.map(store => {
                const isActive = selectedStore === store.id
                return (
                  <button
                    key={store.id}
                    onClick={() => setSelectedStore(isActive ? 'all' : store.id)}
                    className={`flex-none flex items-center justify-center p-2 rounded-lg transition-all duration-500 group/btn snap-start min-w-[60px] lg:flex-1 ${
                      isActive
                        ? 'bg-white shadow-md ring-1 ring-black/5 transform scale-100'
                        : 'hover:bg-white/80 hover:shadow-sm'
                    }`}
                  >
                    {store.logo && (
                      <div 
                        className={`relative flex items-center justify-center transition-all duration-500 ${isActive ? 'scale-110 drop-shadow-sm' : 'grayscale group-hover/btn:grayscale-0 opacity-70 group-hover/btn:opacity-100'}`}
                        style={{ 
                          transform: isActive ? `scale(${(store.scale || 1) * 1.15})` : `scale(${store.scale || 1})`,
                          minWidth: store.id === 'mercado_livre' ? '80px' : store.id === 'aliexpress' ? '70px' : 'auto',
                        }}
                      >
                        <img 
                          src={store.logo} 
                          alt={store.name} 
                          className="h-6 w-auto object-contain max-w-[100px] block mx-auto"
                        />
                      </div>
                    )}
                    {!store.logo && (
                       <div className="flex items-center gap-1.5 px-2">
                        <store.icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                        <span className={`text-[10px] font-bold whitespace-nowrap ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>{store.name}</span>
                       </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
