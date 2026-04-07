export function Hero() {
  return (
    <section className="bg-white/50 py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-50/20 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-10 animate-fade-in">
          <div className="space-y-6">
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 tracking-tight leading-[1.1]">
              Suas lojas favoritas <br />
              <span className="text-blue-600">em um só lugar.</span>
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Exploramos os melhores produtos da <span className="text-gray-900 font-semibold">Shopee</span>, <span className="text-gray-900 font-semibold">Amazon</span> e <span className="text-gray-900 font-semibold">Mercado Livre</span> com os preços mais competitivos do mercado.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
