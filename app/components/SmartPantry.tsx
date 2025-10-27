'use client';

import { Package, X, Trash2 } from 'lucide-react';
import { usePantryStore } from '../store/pantryStore';

export default function SmartPantry() {
  const { ingredients, removeIngredient, clearPantry } = usePantryStore();

  if (ingredients.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Smart Pantry
          </h2>
        </div>
        <p className="text-sm text-gray-500 text-center py-8">
          Your pantry is empty. Add ingredients to build your collection!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Package className="w-5 h-5" />
          Smart Pantry
          <span className="text-sm font-normal text-gray-500">
            ({ingredients.length})
          </span>
        </h2>
        {ingredients.length > 0 && (
          <button
            onClick={clearPantry}
            className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {ingredients.map((ingredient) => (
          <div
            key={ingredient.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-800">{ingredient.name}</span>
            </div>
            <button
              onClick={() => removeIngredient(ingredient.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-4 text-center">
        These ingredients will be included in all recipe searches
      </p>
    </div>
  );
}
