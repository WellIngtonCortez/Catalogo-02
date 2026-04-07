interface LojaSelectorProps {
  selectedStore: string | null
  onStoreSelect: (store: string) => void
  error?: boolean
}

import shopeeLogo from '../../assets/shopee.png'
import amazonLogo from '../../assets/amazon.png'
import mercadolivreLogo from '../../assets/mercadolivre.png'
import aliexpressLogo from '../../assets/aliexpress.png'

const stores = [
  { id: 'shopee', name: 'Shopee', logo: shopeeLogo, scale: 1.1 },
  { id: 'amazon', name: 'Amazon', logo: amazonLogo, scale: 1.1 },
  { id: 'mercado_livre', name: 'Mercado Livre', logo: mercadolivreLogo, scale: 2.0 },
  { id: 'aliexpress', name: 'AliExpress', logo: aliexpressLogo, scale: 0.95 },
]

export function LojaSelector({ selectedStore, onStoreSelect, error = false }: LojaSelectorProps) {
  return (
    <div className="w-full">
      <div className={`flex bg-gray-50/80 p-1.5 rounded-xl border w-full overflow-x-auto no-scrollbar snap-x gap-1 transition-colors ${error && !selectedStore ? 'border-red-300 ring-2 ring-red-500/20' : 'border-gray-100'}`}>
        {stores.map(store => {
          const isActive = selectedStore === store.id
          return (
            <button
              key={store.id}
              type="button"
              onClick={() => onStoreSelect(store.id)}
              className={`flex-none flex items-center justify-center p-3 rounded-lg transition-all duration-500 group/btn snap-start min-w-[60px] flex-1 ${
                isActive
                  ? 'bg-white shadow-md ring-1 ring-black/5 transform scale-100'
                  : 'hover:bg-white/80 hover:shadow-sm'
              }`}
            >
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
            </button>
          )
        })}
      </div>
      
      {/* Error message */}
      {error && !selectedStore && (
        <p className="text-xs font-bold uppercase tracking-wider text-red-500 mt-2 ml-1">
          Por favor, selecione uma loja.
        </p>
      )}
    </div>
  )
}
