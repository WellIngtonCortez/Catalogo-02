import { Instagram, Facebook, Twitter, Mail } from 'lucide-react'
import logoUniShopBr from '../assets/logo_unishopbr.png'

export function Footer() {
  return (
    <footer className="bg-brand-soft border-t border-gray-100 py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Logo & Sobre */}
          <div className="col-span-1 md:col-span-2 space-y-8">
            <img 
              src={logoUniShopBr} 
              alt="UniShopBr" 
              className="h-12 w-auto object-contain" 
            />
            <h3 className="text-brand-secondary text-2xl font-extrabold tracking-tight">
              Sua curadoria premium de <br />
              <span className="text-brand-primary">ofertas imperdíveis.</span>
            </h3>
            <div className="flex items-center gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-secondary shadow-soft hover:bg-brand-primary hover:text-white transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="text-brand-secondary font-bold mb-6">Navegação</h4>
            <ul className="space-y-4 text-gray-500 text-sm font-medium">
              <li><a href="#" className="hover:text-brand-primary transition-colors">Início</a></li>
              <li><a href="#catalog" className="hover:text-brand-primary transition-colors">Ofertas</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Destaques</a></li>
              <li><a href="/admin/login" className="hover:text-brand-primary transition-colors">Administração</a></li>
            </ul>
          </div>

          {/* Newsletter / Contato */}
          <div>
            <h4 className="text-brand-secondary font-bold mb-6">Newsletter</h4>
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="email" 
                  placeholder="Seu melhor e-mail"
                  className="w-full bg-white border-none pl-11 pr-4 py-3.5 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-brand-primary/20"
                />
              </div>
              <button className="btn-primary w-full text-xs">
                Inscrever-se
              </button>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-xs font-medium">
            © 2024 UniShopBr. Todos os direitos reservados.
          </p>
          <div className="flex gap-8 text-gray-400 text-xs font-medium">
            <a href="#" className="hover:text-brand-secondary transition-colors">Termos</a>
            <a href="#" className="hover:text-brand-secondary transition-colors">Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
