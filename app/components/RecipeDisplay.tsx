'use client';

import { Clock, Users, ChefHat, Flame, AlertCircle, Loader2 } from 'lucide-react';

interface Recipe {
  name: string;
  description: string;
  cookTime: string;
  servings: string;
  difficulty: string;
  ingredients: string[];
  instructions: string[];
  nutrition?: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
}

interface Props {
  recipes: Recipe[];
  loading: boolean;
  error: string;
}

export default function RecipeDisplay({ recipes, loading, error }: Props) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-lg text-gray-600">Finding perfect recipes for you...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-medium">Error</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12">
        <div className="text-center text-gray-500">
          <ChefHat className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-medium mb-2">No recipes yet</h3>
          <p className="text-sm">
            Upload an image or type in your ingredients to get started!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Found {recipes.length} Recipe{recipes.length !== 1 ? 's' : ''}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {recipes.map((recipe, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden card-hover"
          >
            <div className="p-6">
              {/* Header */}
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {recipe.name}
                </h3>
                <p className="text-gray-600">{recipe.description}</p>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="text-sm">{recipe.cookTime}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Users className="w-5 h-5 text-green-500" />
                  <span className="text-sm">{recipe.servings}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <ChefHat className="w-5 h-5 text-purple-500" />
                  <span className="text-sm">{recipe.difficulty}</span>
                </div>
                {recipe.nutrition && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <span className="text-sm">{recipe.nutrition.calories}</span>
                  </div>
                )}
              </div>

              {/* Nutrition Info */}
              {recipe.nutrition && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Nutrition (per serving)
                  </h4>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Calories</p>
                      <p className="font-semibold text-orange-700">
                        {recipe.nutrition.calories}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Protein</p>
                      <p className="font-semibold text-blue-700">
                        {recipe.nutrition.protein}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Carbs</p>
                      <p className="font-semibold text-green-700">
                        {recipe.nutrition.carbs}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Fat</p>
                      <p className="font-semibold text-purple-700">
                        {recipe.nutrition.fat}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Ingredients */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Ingredients
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {recipe.ingredients.map((ingredient, idx) => (
                    <li
                      key={idx}
                      className="text-gray-700 text-sm flex items-start gap-2"
                    >
                      <span className="text-green-500 mt-1">•</span>
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Instructions
                </h4>
                <ol className="space-y-3">
                  {recipe.instructions.map((instruction, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
                        {idx + 1}
                      </span>
                      <span className="text-gray-700 text-sm pt-0.5">
                        {instruction}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
