import { Instagram, Facebook, Twitter, Mail } from 'lucide-react'
import logoWellshop from '../assets/logo_wellshop.png'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-100 py-16 scroll-mt-20 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <img src={logoWellshop} alt="UniShopBr" className="h-10 w-auto object-contain" />
            </div>
            <p className="text-gray-500 leading-relaxed text-sm">
              As melhores ofertas da Shopee, Amazon, Mercado Livre e AliExpress reunidas em um só lugar.
              <br />
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Categorias Populares</h4>
            <ul className="space-y-4">
              {['Eletrônicos', 'Casa & Decoração', 'Beleza & Saúde', 'Moda Masculina'].map(cat => (
                <li key={cat}>
                  <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">{cat}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Institucional</h4>
            <ul className="space-y-4">
              {['Quem Somos', 'Privacidade', 'Termos de Uso', ''].map(link => (
                <li key={link}>
                  <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Newsletter</h4>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Receba as melhores promoções diretamente no seu e-mail.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="seu@email.com"
                maxLength={254}
                autoComplete="email"
                className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              />
              <button className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30">
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-400 text-xs mb-3">
            © {currentYear} UniShopBr · Todos os direitos reservados.
          </p>
          <p className="text-[10px] text-gray-400 mt-6 max-w-2xl mx-auto leading-relaxed">
            Este site contém links de afiliado. Ao comprar através de nossos links, você nos apoia sem pagar nada a mais por isso. Todas as marcas registradas pertencem aos seus respectivos proprietários.
          </p>
        </div>
      </div>
    </footer>
  )
}
