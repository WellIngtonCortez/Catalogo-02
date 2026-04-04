// No direct imports from lucide-react needed here as icons are passed via props
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
  return (
    <section className="bg-white/80 backdrop-blur-md sticky top-[80px] z-30 border-y border-gray-100 py-4 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between flex-wrap gap-6">
          {/* Store Filter */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Loja</span>
            <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
              {stores.map(store => {
                const Icon = store.icon
                const isActive = selectedStore === store.id
                return (
                  <button
                    key={store.id}
                    onClick={() => setSelectedStore(store.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-white text-[#2563eb] shadow-sm ring-1 ring-black/5'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#2563eb]' : ''}`} />
                    <span className="text-sm font-semibold">{store.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Combined Secondary Filters */}
          <div className="flex items-center gap-4 flex-1 justify-end">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categoria</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-pointer"
              >
                <option value="all">Todas</option>
                {categories.map(category => (
                  <option key={category.name} value={category.name}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ordenar</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-pointer"
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
