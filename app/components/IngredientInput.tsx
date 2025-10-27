'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Upload, Plus, Search, Loader2, X } from 'lucide-react';
import { usePantryStore } from '../store/pantryStore';

interface Props {
  onRecipesFound: (recipes: any[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
}

export default function IngredientInput({ onRecipesFound, setLoading, setError }: Props) {
  const [manualInput, setManualInput] = useState('');
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [preferences, setPreferences] = useState({
    dietary: '',
    cuisine: '',
  });

  const { addIngredient, getIngredientNames } = usePantryStore();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setAnalyzing(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const data = await response.json();
      setDetectedIngredients(data.ingredients || []);
    } catch (err) {
      setError('Failed to analyze image. Please try again or enter ingredients manually.');
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  }, [setError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxFiles: 1,
  });

  const handleAddManualIngredient = () => {
    if (manualInput.trim()) {
      const ingredients = manualInput.split(',').map(i => i.trim()).filter(Boolean);
      ingredients.forEach(ing => {
        if (!detectedIngredients.includes(ing)) {
          setDetectedIngredients(prev => [...prev, ing]);
        }
      });
      setManualInput('');
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setDetectedIngredients(prev => prev.filter(i => i !== ingredient));
  };

  const handleFindRecipes = async () => {
    const allIngredients = [...detectedIngredients, ...getIngredientNames()];

    if (allIngredients.length === 0) {
      setError('Please add at least one ingredient');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/find-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: allIngredients,
          dietary: preferences.dietary,
          cuisine: preferences.cuisine,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to find recipes');
      }

      const data = await response.json();
      onRecipesFound(data.recipes || []);

      // Add to pantry
      detectedIngredients.forEach(ing => addIngredient(ing));
      setDetectedIngredients([]);
    } catch (err) {
      setError('Failed to find recipes. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <Camera className="w-5 h-5" />
        Add Ingredients
      </h2>

      {/* Image Upload */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        {analyzing ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-sm text-gray-600">Analyzing image...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-10 h-10 text-gray-400" />
            <p className="text-sm text-gray-600">
              {isDragActive ? 'Drop image here' : 'Drag & drop or click to upload'}
            </p>
            <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 10MB</p>
          </div>
        )}
      </div>

      {/* Manual Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Or type ingredients:</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddManualIngredient()}
            placeholder="e.g., tomatoes, onions, garlic"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <button
            onClick={handleAddManualIngredient}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Detected Ingredients */}
      {detectedIngredients.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Current ingredients:</label>
          <div className="flex flex-wrap gap-2">
            {detectedIngredients.map((ingredient, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {ingredient}
                <button
                  onClick={() => handleRemoveIngredient(ingredient)}
                  className="hover:text-green-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Preferences */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Dietary Preference
          </label>
          <select
            value={preferences.dietary}
            onChange={(e) => setPreferences({ ...preferences, dietary: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="">Any</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="gluten-free">Gluten-Free</option>
            <option value="keto">Keto</option>
            <option value="paleo">Paleo</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Cuisine Type
          </label>
          <select
            value={preferences.cuisine}
            onChange={(e) => setPreferences({ ...preferences, cuisine: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="">Any</option>
            <option value="italian">Italian</option>
            <option value="mexican">Mexican</option>
            <option value="asian">Asian</option>
            <option value="indian">Indian</option>
            <option value="mediterranean">Mediterranean</option>
            <option value="american">American</option>
          </select>
        </div>
      </div>

      {/* Find Recipes Button */}
      <button
        onClick={handleFindRecipes}
        disabled={detectedIngredients.length === 0 && getIngredientNames().length === 0}
        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Search className="w-5 h-5" />
        Find Recipes
      </button>
    </div>
  );
}
