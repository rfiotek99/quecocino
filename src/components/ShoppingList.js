'use client';

import { useState, useEffect } from 'react';

export default function ShoppingList({ isOpen, onClose }) {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('quecocino-shopping');
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('quecocino-shopping', JSON.stringify(items));
  }, [items]);

  const addItem = (name, checked = false) => {
    if (name.trim() && !items.some(item => item.name.toLowerCase() === name.toLowerCase())) {
      setItems([...items, { id: Date.now(), name: name.trim(), checked }]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addItem(newItem);
    setNewItem('');
  };

  const toggleItem = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const clearCompleted = () => {
    setItems(items.filter(item => !item.checked));
  };

  const clearAll = () => {
    setItems([]);
  };

  const shareWhatsApp = () => {
    const uncheckedItems = items.filter(item => !item.checked);
    if (uncheckedItems.length === 0) return;
    
    const text = `🛒 *Mi lista de compras*\n\n${uncheckedItems.map(item => `• ${item.name}`).join('\n')}\n\n_Generado con QuéCocino_`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  if (!isOpen) return null;

  const uncheckedCount = items.filter(item => !item.checked).length;
  const checkedCount = items.filter(item => item.checked).length;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[85vh] overflow-hidden shadow-2xl animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🛒</span>
              <div>
                <h2 className="text-xl font-bold">Lista de Compras</h2>
                <p className="text-emerald-100 text-sm">
                  {uncheckedCount} pendiente{uncheckedCount !== 1 ? 's' : ''}
                  {checkedCount > 0 && ` • ${checkedCount} completado${checkedCount !== 1 ? 's' : ''}`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Agregar item */}
        <form onSubmit={handleSubmit} className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Agregar ingrediente..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium"
            >
              +
            </button>
          </div>
        </form>

        {/* Lista */}
        <div className="overflow-y-auto max-h-[40vh] p-4">
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <span className="text-4xl block mb-2">📝</span>
              <p>Tu lista está vacía</p>
              <p className="text-sm">Agregá ingredientes o tocá "Agregar faltantes" en una receta</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {items.filter(item => !item.checked).map(item => (
                <li 
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg group"
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-6 h-6 rounded-full border-2 border-emerald-500 flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
                  >
                  </button>
                  <span className="flex-1 text-gray-700 dark:text-gray-200">{item.name}</span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                  >
                    🗑️
                  </button>
                </li>
              ))}
              
              {checkedCount > 0 && (
                <>
                  <li className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide pt-4 pb-2">
                    Completados
                  </li>
                  {items.filter(item => item.checked).map(item => (
                    <li 
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-gray-50/50 dark:bg-gray-700/30 rounded-lg group opacity-60"
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="w-6 h-6 rounded-full border-2 border-emerald-500 bg-emerald-500 flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <span className="flex-1 text-gray-500 dark:text-gray-400 line-through">{item.name}</span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                      >
                        🗑️
                      </button>
                    </li>
                  ))}
                </>
              )}
            </ul>
          )}
        </div>

        {/* Footer actions */}
        {items.length > 0 && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-2">
            <button
              onClick={shareWhatsApp}
              disabled={uncheckedCount === 0}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Compartir
            </button>
            {checkedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Limpiar completados
              </button>
            )}
            <button
              onClick={clearAll}
              className="px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            >
              Borrar todo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Función para agregar items desde otros componentes
export function addToShoppingList(ingredients) {
  const saved = localStorage.getItem('quecocino-shopping');
  const items = saved ? JSON.parse(saved) : [];
  
  const newItems = [...items];
  ingredients.forEach(name => {
    if (!newItems.some(item => item.name.toLowerCase() === name.toLowerCase())) {
      newItems.push({ id: Date.now() + Math.random(), name, checked: false });
    }
  });
  
  localStorage.setItem('quecocino-shopping', JSON.stringify(newItems));
  
  // Disparar evento para actualizar el componente
  window.dispatchEvent(new Event('shopping-list-updated'));
}
