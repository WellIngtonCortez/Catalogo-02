import { Link } from 'react-router-dom'
import { Search, User } from 'lucide-react'

interface HeaderProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  logo: string
}

export function Header({ searchTerm, setSearchTerm, logo }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40 transition-all duration-300">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src={logo}
                alt=""
                className="w-23 h-10 rounded-xl object-contain transition-all duration-300 group-hover:scale-110 shadow-sm border border-gray-100"
              />
              <span className="text-xl font-black text-[#1a1a1a] tracking-tighter transition-colors group-hover:text-blue-600">

              </span>
            </Link>
          </div>

          <div className="flex items-center gap-6 flex-1 max-w-xl mx-12">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                id="search"
                name="search"
                type="text"
                placeholder="Buscar por nome, categoria ou marca..."
                className="w-full px-5 py-3 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 pl-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <span className="text-xs font-bold bg-gray-200 px-1.5 py-0.5 rounded uppercase">Esc</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/admin/login"
              className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all duration-300 shadow-md active:scale-95"
            >
              <User className="w-4 h-4 fill-white" />
              <span className="text-sm font-bold tracking-tight">Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
