import { Plus } from 'lucide-react'

interface LojaSelectorProps {
  selectedStore: string | null
  onStoreSelect: (store: string) => void
  error?: boolean
}

const stores = [
  {
    id: 'shopee',
    name: 'Shopee',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#FF6B35"/>
        <path d="M8 12C8 10.8954 8.89543 10 10 10H22C23.1046 10 24 10.8954 24 12V20C24 21.1046 23.1046 22 22 22H10C8.89543 22 8 21.1046 8 20V12Z" fill="white"/>
        <path d="M11 14H21V18H11V14Z" fill="#FF6B35"/>
        <path d="M6 8C6 7.44772 6.44772 7 7 7H25C25.5523 7 26 7.44772 26 8V9C26 9.55228 25.5523 10 25 10H7C6.44772 10 6 9.55228 6 9V8Z" fill="#FF6B35"/>
        <path d="M6 22C6 21.4477 6.44772 21 7 21H25C25.5523 21 26 21.4477 26 22V23C26 23.5523 25.5523 24 25 24H7C6.44772 24 6 23.5523 6 23V22Z" fill="#FF6B35"/>
      </svg>
    )
  },
  {
    id: 'amazon',
    name: 'Amazon',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#FF9900"/>
        <path d="M8 16C8 11.5817 11.5817 8 16 8C20.4183 8 24 11.5817 24 16C24 20.4183 20.4183 24 16 24C11.5817 24 8 20.4183 8 16Z" fill="white"/>
        <path d="M12 14C12 13.4477 12.4477 13 13 13H19C19.5523 13 20 13.4477 20 14V18C20 18.5523 19.5523 19 19 19H13C12.4477 19 12 18.5523 12 18V14Z" fill="#FF9900"/>
        <path d="M10 21C10 21 14 19 16 19C18 19 22 21 22 21" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 'mercado_livre',
    name: 'Mercado Livre',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#FFF159"/>
        <path d="M12 11C12 10.4477 12.4477 10 13 10H19C19.5523 10 20 10.4477 20 11V13C20 13.5523 19.5523 14 19 14H13C12.4477 14 12 13.5523 12 13V11Z" fill="#2968C8"/>
        <path d="M12 18C12 17.4477 12.4477 17 13 17H19C19.5523 17 20 17.4477 20 18V20C20 20.5523 19.5523 21 19 21H13C12.4477 21 12 20.5523 12 20V18Z" fill="#2968C8"/>
        <rect x="14" y="12" width="4" height="6" fill="#FFF159"/>
      </svg>
    )
  }
]

export function LojaSelector({ selectedStore, onStoreSelect, error = false }: LojaSelectorProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
          <Plus className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Adicionar Produto</h2>
      </div>

      {/* Label */}
      <label className={`text-sm font-medium ${error ? 'text-red-600' : 'text-gray-500'}`}>
        LOJA <span className="text-red-500">*</span>
      </label>

      {/* Store Cards Grid */}
      <div className="grid grid-cols-3 gap-4">
        {stores.map((store) => (
          <button
            key={store.id}
            type="button"
            onClick={() => onStoreSelect(store.id)}
            className={`
              relative p-6 rounded-xl border-2 transition-all duration-200 ease-in-out
              ${selectedStore === store.id
                ? 'border-gray-900 shadow-md bg-gray-50'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }
              ${error && !selectedStore ? 'border-red-300 hover:border-red-400' : ''}
            `}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center">
                {store.icon}
              </div>
              <span className="text-sm font-medium text-gray-900">
                {store.name}
              </span>
            </div>
            
            {/* Selected indicator */}
            {selectedStore === store.id && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L4.5 8.5L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Error message */}
      {error && !selectedStore && (
        <p className="text-sm text-red-600 mt-2">
          Por favor, selecione uma loja para continuar.
        </p>
      )}
    </div>
  )
}
