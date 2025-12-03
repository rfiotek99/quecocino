'use client';

export default function Filters({ filters, onChange }) {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
        <span>⚙️</span>
        Filtros
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tiempo de preparación */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tiempo máximo
          </label>
          <select
            value={filters.maxReadyTime || ''}
            onChange={(e) => handleChange('maxReadyTime', e.target.value ? Number(e.target.value) : null)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Sin límite</option>
            <option value="15">15 minutos</option>
            <option value="30">30 minutos</option>
            <option value="45">45 minutos</option>
            <option value="60">1 hora</option>
            <option value="90">1.5 horas</option>
          </select>
        </div>

        {/* Tipo de comida */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tipo de comida
          </label>
          <select
            value={filters.type || ''}
            onChange={(e) => handleChange('type', e.target.value || null)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Todos</option>
            <option value="breakfast">Desayuno</option>
            <option value="main course">Plato principal</option>
            <option value="side dish">Guarnición</option>
            <option value="salad">Ensalada</option>
            <option value="soup">Sopa</option>
            <option value="appetizer">Entrada</option>
            <option value="dessert">Postre</option>
            <option value="snack">Snack</option>
          </select>
        </div>

        {/* Dieta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Dieta
          </label>
          <select
            value={filters.diet || ''}
            onChange={(e) => handleChange('diet', e.target.value || null)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Sin restricción</option>
            <option value="vegetarian">Vegetariano</option>
            <option value="vegan">Vegano</option>
            <option value="gluten free">Sin gluten</option>
            <option value="dairy free">Sin lácteos</option>
            <option value="ketogenic">Keto</option>
            <option value="paleo">Paleo</option>
          </select>
        </div>
      </div>

      {/* Mostrar filtros activos */}
      {(filters.maxReadyTime || filters.type || filters.diet) && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-500 dark:text-gray-400">Filtros activos:</span>
            {filters.maxReadyTime && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full text-xs">
                ⏱️ {filters.maxReadyTime} min
                <button 
                  onClick={() => handleChange('maxReadyTime', null)}
                  className="hover:text-emerald-900 dark:hover:text-emerald-100"
                >
                  ×
                </button>
              </span>
            )}
            {filters.type && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                🍽️ {filters.type === 'main course' ? 'Plato principal' : 
                    filters.type === 'side dish' ? 'Guarnición' :
                    filters.type === 'breakfast' ? 'Desayuno' :
                    filters.type === 'salad' ? 'Ensalada' :
                    filters.type === 'soup' ? 'Sopa' :
                    filters.type === 'appetizer' ? 'Entrada' :
                    filters.type === 'dessert' ? 'Postre' :
                    filters.type === 'snack' ? 'Snack' : filters.type}
                <button 
                  onClick={() => handleChange('type', null)}
                  className="hover:text-blue-900 dark:hover:text-blue-100"
                >
                  ×
                </button>
              </span>
            )}
            {filters.diet && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-xs">
                🥗 {filters.diet === 'vegetarian' ? 'Vegetariano' :
                    filters.diet === 'vegan' ? 'Vegano' :
                    filters.diet === 'gluten free' ? 'Sin gluten' :
                    filters.diet === 'dairy free' ? 'Sin lácteos' :
                    filters.diet === 'ketogenic' ? 'Keto' :
                    filters.diet === 'paleo' ? 'Paleo' : filters.diet}
                <button 
                  onClick={() => handleChange('diet', null)}
                  className="hover:text-purple-900 dark:hover:text-purple-100"
                >
                  ×
                </button>
              </span>
            )}
            <button
              onClick={() => onChange({ maxReadyTime: null, type: null, diet: null })}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline ml-2"
            >
              Limpiar todos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
