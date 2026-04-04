import { Sparkles, ChevronRight } from 'lucide-react'

interface HeroProps {
  stores: any[]
}

export function Hero({ stores }: HeroProps) {
  return (
    <section className="bg-white/50 py-16 lg:py-24 relative overflow-hidden backdrop-blur-sm">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-50/20 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100 text-blue-600 animate-bounce transition-all hover:bg-blue-100">
            <Sparkles className="w-4 h-4 fill-blue-600" />
            <span className="text-xs font-bold uppercase tracking-widest leading-none">Ofertas Selecionadas</span>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 tracking-tight leading-[1.1]">
              Suas lojas favoritas <br />
              <span className="text-blue-600">em um só lugar.</span>
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Exploramos os melhores produtos da <span className="text-gray-900 font-semibold">Shopee</span>, <span className="text-gray-900 font-semibold">Amazon</span> e <span className="text-gray-900 font-semibold">Mercado Livre</span> com os preços mais competitivos do mercado.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <button className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all duration-300 shadow-xl shadow-blue-600/20 hover:scale-105 flex items-center gap-3 active:scale-95 group">
              Explorar Catálogo
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="flex items-center gap-6 bg-white/50 backdrop-blur-sm p-4 rounded-3xl border border-gray-100">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Parceiros</span>
              <div className="flex gap-4">
                {stores.slice(1).map(store => {
                  const Icon = store.icon
                  return (
                    <div 
                      key={store.id} 
                      className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-50 transition-all hover:shadow-md hover:-translate-y-0.5 group"
                    >
                      <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                      <span className="text-sm font-bold text-gray-700">{store.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
