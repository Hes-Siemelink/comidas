import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'
import { recipeService } from '../services'
import type { Recipe } from '../types/schemas'

// Define the shape of the recipe context state
export interface RecipeContextState {
  recipes: Recipe[]
  loading: boolean
  error: string | null
  
  // CRUD operations
  loadRecipes: () => Promise<void>
  createRecipe: (recipeData: { name: string; ingredients: string; steps: string }) => Promise<Recipe>
  updateRecipe: (id: string, updates: { name: string; ingredients: string; steps: string }) => Promise<Recipe>
  deleteRecipe: (id: string) => Promise<void>
  
  // Search functionality
  searchRecipes: (query: string) => Recipe[]
  
  // Get single recipe
  getRecipe: (id: string) => Recipe | undefined
}

const RecipeContext = createContext<RecipeContextState | undefined>(undefined)

export const RecipeProvider = ({ children }: { children: ReactNode }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadRecipes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const loadedRecipes = await recipeService.getAll()
      setRecipes(loadedRecipes)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recipes')
      console.error('Failed to load recipes:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createRecipe = useCallback(async (recipeData: { name: string; ingredients: string; steps: string }) => {
    try {
      setLoading(true)
      setError(null)
      const newRecipe = await recipeService.create(recipeData)
      setRecipes(prev => [...prev, newRecipe])
      return newRecipe
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create recipe')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateRecipe = useCallback(async (id: string, updates: { name: string; ingredients: string; steps: string }) => {
    try {
      setLoading(true)
      setError(null)
      const updatedRecipe = await recipeService.update(id, updates)
      setRecipes(prev => prev.map(recipe => recipe.id === id ? updatedRecipe : recipe))
      return updatedRecipe
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update recipe')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteRecipe = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await recipeService.delete(id)
      setRecipes(prev => prev.filter(recipe => recipe.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete recipe')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const searchRecipes = useCallback((query: string): Recipe[] => {
    if (!query.trim()) {
      return recipes
    }
    
    const lowercaseQuery = query.toLowerCase()
    return recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(lowercaseQuery) ||
      recipe.ingredients.toLowerCase().includes(lowercaseQuery)
    )
  }, [recipes])

  const getRecipe = useCallback((id: string): Recipe | undefined => {
    return recipes.find(recipe => recipe.id === id)
  }, [recipes])

  // Load recipes on mount (skip in test environment)
  useEffect(() => {
    // Skip auto-loading in test environment to avoid act() warnings
    if (import.meta.env.MODE !== 'test' && typeof window !== 'undefined') {
      loadRecipes()
    }
  }, [loadRecipes])

  const contextValue: RecipeContextState = {
    recipes,
    loading,
    error,
    loadRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    searchRecipes,
    getRecipe
  }

  return (
    <RecipeContext.Provider value={contextValue}>
      {children}
    </RecipeContext.Provider>
  )
}

export const useRecipes = () => {
  const context = useContext(RecipeContext)
  if (!context) {
    throw new Error('useRecipes must be used within a RecipeProvider')
  }
  return context
}