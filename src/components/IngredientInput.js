'use client';

import { useState } from 'react';

export default function IngredientInput({ ingredients, onAdd, onRemove }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onAdd(input.trim().toLowerCase());
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const suggestions = [
    'pollo', 'carne', 'arroz', 'pasta', 'tomate', 
    'cebolla', 'ajo', 'huevo', 'queso', 'papa',
    'leche', 'harina', 'manteca', 'zanahoria'
  ].filter(s => !ingredients.includes(s));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        ¿Qué tenés en la heladera?
      </h2>
      
      {/* Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribí un ingrediente..."
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
        <button
          onClick={handleSubmit}
          className="btn-primary !py-2 !px-4"
        >
          Agregar
        </button>
      </div>

      {/* Ingredientes agregados */}
      {ingredients.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Tus ingredientes:</p>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ingredient) => (
              <span key={ingredient} className="ingredient-tag">
                {ingredient}
                <button
                  onClick={() => onRemove(ingredient)}
                  className="ml-1 hover:text-emerald-600 dark:hover:text-emerald-300"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Sugerencias rápidas */}
      {suggestions.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Sugerencias rápidas:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.slice(0, 6).map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => onAdd(suggestion)}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-sm transition-colors"
              >
                + {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
