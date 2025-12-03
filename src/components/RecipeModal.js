'use client';

import { useState, useEffect } from 'react';
import ShareButton from './ShareButton';
import { addToShoppingList } from './ShoppingList';

export default function RecipeModal({ recipe, onClose, isFavorite, onToggleFavorite }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addedToList, setAddedToList] = useState(false);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const response = await fetch(`/api/recipes/${recipe.id}`);
        const data = await response.json();
        setDetails(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [recipe.id]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleAddMissing = () => {
    if (recipe.missedIngredients) {
      const ingredients = recipe.missedIngredients.map(ing => ing.name);
      addToShoppingList(ingredients);
      setAddedToList(true);
      setTimeout(() => setAddedToList(false), 2000);
    }
  };

  const handleAddAllIngredients = () => {
    if (details?.extendedIngredients) {
      const ingredients = details.extendedIngredients.map(ing => ing.name);
      addToShoppingList(ingredients);
      setAddedToList(true);
      setTimeout(() => setAddedToList(false), 2000);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con imagen */}
        <div className="relative h-72">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Botones superiores */}
          <div className="absolute top-4 right-4 flex gap-2">
            <ShareButton recipe={recipe} />
            <button
              onClick={() => onToggleFavorite(recipe)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                isFavorite 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 hover:text-red-500'
              }`}
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Título sobre la imagen */}
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-2xl font-bold text-white drop-shadow-lg">
              {recipe.title}
            </h2>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">Cargando receta...</p>
            </div>
          ) : details ? (
            <>
              {/* Info rápida */}
              <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                {details.readyInMinutes && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <span className="text-2xl">⏱️</span>
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Tiempo</p>
                      <p className="font-semibold">{details.readyInMinutes} min</p>
                    </div>
                  </div>
                )}
                {details.servings && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <span className="text-2xl">👥</span>
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Porciones</p>
                      <p className="font-semibold">{details.servings}</p>
                    </div>
                  </div>
                )}
                {details.healthScore !== undefined && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <span className="text-2xl">💚</span>
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500">Puntaje saludable</p>
                      <p className="font-semibold">{details.healthScore}/100</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Badges de dieta */}
              {(details.vegetarian || details.vegan || details.glutenFree || details.dairyFree) && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {details.vegetarian && (
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-sm">
                      🥬 Vegetariano
                    </span>
                  )}
                  {details.vegan && (
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full text-sm">
                      🌱 Vegano
                    </span>
                  )}
                  {details.glutenFree && (
                    <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 rounded-full text-sm">
                      🌾 Sin gluten
                    </span>
                  )}
                  {details.dairyFree && (
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                      🥛 Sin lácteos
                    </span>
                  )}
                </div>
              )}

              {/* Ingredientes */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <span>🛒</span>
                    Ingredientes
                  </h3>
                  <button
                    onClick={handleAddAllIngredients}
                    className={`text-sm px-3 py-1 rounded-full transition-all ${
                      addedToList 
                        ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 hover:text-emerald-700 dark:hover:text-emerald-300'
                    }`}
                  >
                    {addedToList ? '✓ Agregado' : '+ Agregar todos a lista'}
                  </button>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {details.extendedIngredients?.map((ing, index) => (
                    <li 
                      key={index} 
                      className="flex items-start gap-2 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg"
                    >
                      <span className="text-emerald-500 mt-0.5">•</span>
                      <span className="text-sm">{ing.original}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botón agregar faltantes */}
              {recipe.missedIngredients && recipe.missedIngredients.length > 0 && (
                <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-orange-800 dark:text-orange-200">
                        Te faltan {recipe.missedIngredients.length} ingredientes
                      </p>
                      <p className="text-sm text-orange-600 dark:text-orange-300">
                        {recipe.missedIngredients.map(i => i.name).join(', ')}
                      </p>
                    </div>
                    <button
                      onClick={handleAddMissing}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
                    >
                      🛒 Agregar a lista
                    </button>
                  </div>
                </div>
              )}

              {/* Pasos */}
              {details.analyzedInstructions?.[0]?.steps && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <span>👨‍🍳</span>
                    Preparación
                  </h3>
                  <ol className="space-y-4">
                    {details.analyzedInstructions[0].steps.map((step) => (
                      <li key={step.number} className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {step.number}
                        </span>
                        <p className="text-gray-600 dark:text-gray-300 pt-1">{step.step}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Instrucciones HTML como fallback */}
              {!details.analyzedInstructions?.[0]?.steps && details.instructions && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <span>👨‍🍳</span>
                    Instrucciones
                  </h3>
                  <div 
                    className="text-gray-600 dark:text-gray-300 prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: details.instructions }}
                  />
                </div>
              )}

              {/* Link a receta original */}
              {details.sourceUrl && (
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <a
                    href={details.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
                  >
                    Ver receta original (en inglés)
                    <span>→</span>
                  </a>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No se pudieron cargar los detalles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
