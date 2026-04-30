import { Category } from '../services/supabase'
import { LayoutGrid, ArrowUpDown } from 'lucide-react'

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
  return (
    <section className="bg-white/80 backdrop-blur-md sticky top-[72px] md:top-[80px] z-40 py-4 border-b border-gray-100/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Categorias (Scroll Horizontal Premium) */}
          <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar pb-1">
            {categories.map(category => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex-none px-5 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition-all duration-300 ${
                  selectedCategory === category.name
                    ? 'bg-brand-secondary text-white shadow-lg shadow-brand-secondary/20'
                    : 'bg-brand-soft text-brand-secondary hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto">
            {/* Lojas Select */}
            <div className="relative flex-1 lg:flex-none">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-secondary/40">
                <LayoutGrid className="w-4 h-4" />
              </div>
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="w-full lg:w-48 bg-brand-soft border-none pl-11 pr-4 py-3 rounded-2xl text-xs font-bold text-brand-secondary focus:ring-2 focus:ring-brand-primary/20 appearance-none cursor-pointer"
              >
                <option value="all">Todas as Lojas</option>
                {stores.map(store => (
                  <option key={store.id} value={store.id}>{store.name}</option>
                ))}
              </select>
            </div>

            {/* Ordenação Select */}
            <div className="relative flex-1 lg:flex-none">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-secondary/40">
                <ArrowUpDown className="w-4 h-4" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full lg:w-48 bg-brand-soft border-none pl-11 pr-4 py-3 rounded-2xl text-xs font-bold text-brand-secondary focus:ring-2 focus:ring-brand-primary/20 appearance-none cursor-pointer"
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
