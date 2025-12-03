'use client';

import { useState, useEffect } from 'react';
import IngredientInput from '@/components/IngredientInput';
import RecipeCard from '@/components/RecipeCard';
import RecipeModal from '@/components/RecipeModal';
import Filters from '@/components/Filters';
import ShoppingList from '@/components/ShoppingList';

export default function Home() {
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    maxReadyTime: null,
    type: null,
    diet: null
  });
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [shoppingCount, setShoppingCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('quecocino-favoritas');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
    
    // Cargar conteo de lista de compras
    const updateShoppingCount = () => {
      const shopping = localStorage.getItem('quecocino-shopping');
      if (shopping) {
        const items = JSON.parse(shopping);
        setShoppingCount(items.filter(i => !i.checked).length);
      }
    };
    
    updateShoppingCount();
    window.addEventListener('shopping-list-updated', updateShoppingCount);
    window.addEventListener('storage', updateShoppingCount);
    
    return () => {
      window.removeEventListener('shopping-list-updated', updateShoppingCount);
      window.removeEventListener('storage', updateShoppingCount);
    };
  }, []);

  const toggleFavorite = (recipe) => {
    const newFavorites = favorites.some(f => f.id === recipe.id)
      ? favorites.filter(f => f.id !== recipe.id)
      : [...favorites, recipe];
    
    setFavorites(newFavorites);
    localStorage.setItem('quecocino-favoritas', JSON.stringify(newFavorites));
  };

  const isFavorite = (recipeId) => favorites.some(f => f.id === recipeId);

  const addIngredient = (ingredient) => {
    if (!ingredients.includes(ingredient)) {
      setIngredients([...ingredients, ingredient]);
    }
  };

  const removeIngredient = (ingredient) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
  };

  const searchRecipes = async () => {
    if (ingredients.length === 0) return;

    setLoading(true);
    setError(null);
    setSearched(true);
    setShowFavorites(false);

    try {
      const params = new URLSearchParams({
        ingredients: ingredients.join(',')
      });
      
      if (filters.maxReadyTime) params.append('maxReadyTime', filters.maxReadyTime);
      if (filters.type) params.append('type', filters.type);
      if (filters.diet) params.append('diet', filters.diet);

      const response = await fetch(`/api/recipes/search?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Error al buscar recetas');
      }

      const data = await response.json();
      setRecipes(data);
    } catch (err) {
      setError('No pudimos buscar recetas. Verificá tu conexión.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setIngredients([]);
    setRecipes([]);
    setSearched(false);
    setError(null);
    setFilters({ maxReadyTime: null, type: null, diet: null });
  };

  const displayedRecipes = showFavorites ? favorites : recipes;
  const hasActiveFilters = filters.maxReadyTime || filters.type || filters.diet;

  return (
    <div className="space-y-5">
      {/* Botón flotante de lista de compras */}
      <button
        onClick={() => setShowShoppingList(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full shadow-lg shadow-emerald-500/30 flex items-center justify-center text-2xl z-30 transition-all hover:scale-110 active:scale-95"
        title="Lista de compras"
      >
        🛒
        {shoppingCount > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {shoppingCount > 9 ? '9+' : shoppingCount}
          </span>
        )}
      </button>

      {/* Hero compacto cuando no hay búsqueda */}
      {!searched && !showFavorites && ingredients.length === 0 && (
        <div className="text-center py-2 animate-fadeIn">
          <p className="text-gray-500 dark:text-gray-400 text-base">
            🍳 Agregá ingredientes y descubrí qué podés cocinar
          </p>
        </div>
      )}

      {/* Input de ingredientes */}
      <IngredientInput
        ingredients={ingredients}
        onAdd={addIngredient}
        onRemove={removeIngredient}
      />

      {/* Botón de filtros */}
      {ingredients.length > 0 && (
        <div className="flex justify-center animate-slideDown">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`text-sm flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
              showFilters || hasActiveFilters
                ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <span>⚙️</span>
            {showFilters ? 'Ocultar filtros' : 'Filtros'}
            {hasActiveFilters && !showFilters && (
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            )}
          </button>
        </div>
      )}

      {/* Filtros */}
      {showFilters && ingredients.length > 0 && (
        <div className="animate-slideDown">
          <Filters filters={filters} onChange={setFilters} />
        </div>
      )}

      {/* Botones de acción */}
      {ingredients.length > 0 && (
        <div className="flex gap-3 justify-center flex-wrap animate-fadeIn">
          <button
            onClick={searchRecipes}
            disabled={loading}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Buscando...
              </>
            ) : (
              <>
                <span>🔍</span>
                Buscar recetas
              </>
            )}
          </button>
          <button onClick={clearAll} className="btn-secondary">
            Limpiar
          </button>
          {favorites.length > 0 && (
            <button
              onClick={() => {
                setShowFavorites(!showFavorites);
                setSearched(false);
              }}
              className={`btn-secondary flex items-center gap-2 ${
                showFavorites ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300' : ''
              }`}
            >
              <span>{showFavorites ? '❤️' : '🤍'}</span>
              Favoritos ({favorites.length})
            </button>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-xl text-center animate-slideDown">
          <span className="text-xl mr-2">😕</span>
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="skeleton h-48 w-full" />
              <div className="p-4 space-y-3">
                <div className="skeleton h-6 w-3/4" />
                <div className="skeleton h-4 w-1/2" />
                <div className="flex gap-2">
                  <div className="skeleton h-6 w-16 rounded-full" />
                  <div className="skeleton h-6 w-16 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resultados */}
      {(searched || showFavorites) && !loading && (
        <div className="animate-fadeIn">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {showFavorites 
                ? `Tus recetas favoritas`
                : displayedRecipes.length > 0 
                  ? `${displayedRecipes.length} recetas encontradas`
                  : 'Sin resultados'
              }
            </h2>
            {displayedRecipes.length > 0 && !showFavorites && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {hasActiveFilters && '(filtros aplicados)'}
              </span>
            )}
          </div>

          {displayedRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedRecipes.map((recipe, index) => (
                <div 
                  key={recipe.id} 
                  className="animate-slideUp"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <RecipeCard
                    recipe={recipe}
                    onClick={setSelectedRecipe}
                    isFavorite={isFavorite(recipe.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="text-5xl mb-4">🍽️</div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                {showFavorites 
                  ? 'No tenés recetas favoritas todavía'
                  : 'No encontramos recetas'
                }
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {showFavorites 
                  ? 'Buscá recetas y guardá las que más te gusten'
                  : 'Probá agregar más ingredientes o cambiar los filtros'
                }
              </p>
              {!showFavorites && (
                <button
                  onClick={() => {
                    setSearched(false);
                    setRecipes([]);
                  }}
                  className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium"
                >
                  Intentar de nuevo
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modal de receta */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          isFavorite={isFavorite(selectedRecipe.id)}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {/* Lista de compras */}
      <ShoppingList 
        isOpen={showShoppingList} 
        onClose={() => {
          setShowShoppingList(false);
          // Actualizar conteo al cerrar
          const shopping = localStorage.getItem('quecocino-shopping');
          if (shopping) {
            const items = JSON.parse(shopping);
            setShoppingCount(items.filter(i => !i.checked).length);
          } else {
            setShoppingCount(0);
          }
        }} 
      />
    </div>
  );
}
