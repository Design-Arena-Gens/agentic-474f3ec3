import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Ingredient {
  id: string;
  name: string;
  addedAt: number;
}

interface PantryStore {
  ingredients: Ingredient[];
  addIngredient: (name: string) => void;
  removeIngredient: (id: string) => void;
  clearPantry: () => void;
  getIngredientNames: () => string[];
}

export const usePantryStore = create<PantryStore>()(
  persist(
    (set, get) => ({
      ingredients: [],
      addIngredient: (name: string) => {
        const normalized = name.toLowerCase().trim();
        const exists = get().ingredients.some(
          (i) => i.name.toLowerCase() === normalized
        );
        if (!exists && normalized) {
          set((state) => ({
            ingredients: [
              ...state.ingredients,
              { id: Date.now().toString(), name, addedAt: Date.now() },
            ],
          }));
        }
      },
      removeIngredient: (id: string) =>
        set((state) => ({
          ingredients: state.ingredients.filter((i) => i.id !== id),
        })),
      clearPantry: () => set({ ingredients: [] }),
      getIngredientNames: () => get().ingredients.map((i) => i.name),
    }),
    {
      name: 'pantry-storage',
    }
  )
);
