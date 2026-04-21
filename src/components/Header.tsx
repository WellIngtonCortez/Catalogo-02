import { Link } from 'react-router-dom'
import { User } from 'lucide-react'

interface HeaderProps {
  logo: string
}

export function Header({ logo }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src={logo}
                alt="Logo"
                className="w-24 h-10 md:w-32 md:h-12 rounded-xl object-contain transition-all duration-300 group-hover:scale-110 shadow-sm border border-gray-100"
              />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/admin/login"
              className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-2.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all duration-300 shadow-md active:scale-95"
            >
              <User className="w-4 h-4 fill-white" />
              <span className="text-xs md:text-sm font-bold tracking-tight">Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
