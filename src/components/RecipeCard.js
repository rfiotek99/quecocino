'use client';

export default function RecipeCard({ recipe, onClick, isFavorite, onToggleFavorite }) {
  const usedCount = recipe.usedIngredientCount || recipe.usedIngredients?.length || 0;
  const missedCount = recipe.missedIngredientCount || recipe.missedIngredients?.length || 0;
  const totalIngredients = usedCount + missedCount;
  const matchPercentage = totalIngredients > 0 
    ? Math.round((usedCount / totalIngredients) * 100) 
    : 0;

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(recipe);
  };

  return (
    <div 
      className="recipe-card cursor-pointer group"
      onClick={() => onClick(recipe)}
    >
      {/* Imagen */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badge de match */}
        {matchPercentage > 0 && (
          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-sm font-bold shadow-lg ${
            matchPercentage >= 80 ? 'bg-emerald-500 text-white' :
            matchPercentage >= 50 ? 'bg-amber-500 text-white' :
            'bg-gray-600 text-white'
          }`}>
            {matchPercentage}% match
          </div>
        )}

        {/* Tiempo de preparación */}
        {recipe.readyInMinutes && (
          <div className="absolute top-3 right-12 px-2 py-1 bg-black/60 text-white rounded-full text-xs flex items-center gap-1">
            <span>⏱️</span>
            {recipe.readyInMinutes} min
          </div>
        )}

        {/* Botón favorito */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            isFavorite 
              ? 'bg-red-500 text-white scale-110' 
              : 'bg-white/90 dark:bg-gray-800/90 text-gray-400 hover:text-red-500 hover:scale-110'
          }`}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>

        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {recipe.title}
        </h3>

        {/* Info adicional para búsqueda compleja */}
        {recipe.summary && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
            {recipe.summary}
          </p>
        )}

        {/* Ingredientes usados */}
        {recipe.usedIngredients && recipe.usedIngredients.length > 0 && (
          <div className="mb-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              ✅ Usás {usedCount} ingrediente{usedCount !== 1 ? 's' : ''}:
            </p>
            <div className="flex flex-wrap gap-1">
              {recipe.usedIngredients.slice(0, 4).map((ing, idx) => (
                <span 
                  key={ing.id || idx} 
                  className="text-xs px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded"
                >
                  {ing.name}
                </span>
              ))}
              {recipe.usedIngredients.length > 4 && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  +{recipe.usedIngredients.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Ingredientes faltantes */}
        {recipe.missedIngredients && recipe.missedIngredients.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              🛒 Te faltan {missedCount}:
            </p>
            <div className="flex flex-wrap gap-1">
              {recipe.missedIngredients.slice(0, 3).map((ing, idx) => (
                <span 
                  key={ing.id || idx} 
                  className="text-xs px-2 py-0.5 bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 rounded"
                >
                  {ing.name}
                </span>
              ))}
              {recipe.missedIngredients.length > 3 && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  +{recipe.missedIngredients.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Badges de dieta */}
        <div className="flex flex-wrap gap-1 mt-3">
          {recipe.vegetarian && (
            <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded">
              🥬 Vegetariano
            </span>
          )}
          {recipe.vegan && (
            <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded">
              🌱 Vegano
            </span>
          )}
          {recipe.glutenFree && (
            <span className="text-xs px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 rounded">
              🌾 Sin gluten
            </span>
          )}
          {recipe.dairyFree && (
            <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded">
              🥛 Sin lácteos
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
