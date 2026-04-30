import { Link } from 'react-router-dom'
import { User, Search, X } from 'lucide-react'
import { useState } from 'react'
import { clsx } from 'clsx'

interface HeaderProps {
  logo: string
  searchTerm: string
  setSearchTerm: (term: string) => void
}

export function Header({ logo, searchTerm, setSearchTerm }: HeaderProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)

  return (
    <header className="glass-header">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-8 h-12">
          
          {/* Logo - Esquerda (Apple Style) */}
          <div className={clsx(
            "flex items-center transition-all duration-500",
            isSearchExpanded ? "opacity-0 invisible w-0" : "opacity-100 visible w-auto"
          )}>
            <Link to="/" className="group">
              <img
                src={logo}
                alt="UniShopBr"
                className="h-10 md:h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Buscador Expansivo */}
          <div className={clsx(
            "relative flex-1 transition-all duration-500 max-w-2xl",
            isSearchExpanded ? "w-full" : "md:w-[300px]"
          )}>
            <div className={clsx(
              "flex items-center bg-brand-soft rounded-2xl border border-transparent transition-all duration-300 px-4 py-2.5 group-focus-within:border-brand-primary group-focus-within:bg-white group-focus-within:shadow-soft",
              isSearchExpanded && "ring-4 ring-brand-primary/5"
            )}>
              <Search className="w-5 h-5 text-brand-secondary/40 shrink-0" />
              <input
                type="text"
                placeholder="O que você está procurando hoje?"
                className="bg-transparent border-none focus:ring-0 w-full px-3 text-sm font-medium text-brand-secondary placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchExpanded(true)}
                onBlur={() => !searchTerm && setIsSearchExpanded(false)}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="text-gray-400 hover:text-brand-secondary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Ações Extra */}
          <div className={clsx(
            "flex items-center gap-4 transition-all duration-500",
            isSearchExpanded && "hidden md:flex"
          )}>
            <Link
              to="/admin/login"
              className="group flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-soft hover:bg-brand-secondary text-brand-secondary hover:text-white transition-all duration-300 shadow-soft"
            >
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
