'use client';

import { useState } from 'react';
import IngredientInput from './components/IngredientInput';
import RecipeDisplay from './components/RecipeDisplay';
import SmartPantry from './components/SmartPantry';
import { ChefHat, Sparkles } from 'lucide-react';

export default function Home() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ChefHat className="w-8 h-8 text-purple-600" />
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI Recipe Finder
              </h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Powered by AI</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Input & Pantry */}
          <div className="lg:col-span-1 space-y-6">
            <IngredientInput
              onRecipesFound={setRecipes}
              setLoading={setLoading}
              setError={setError}
            />
            <SmartPantry />
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2">
            <RecipeDisplay
              recipes={recipes}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p className="text-sm">
            © 2025 AI Recipe Finder. Transform your ingredients into delicious meals.
          </p>
        </div>
      </footer>
    </main>
  );
}
