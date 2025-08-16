// Tests for LocalStorageService
// Comprehensive test coverage for localStorage CRUD operations with validation

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { LocalStorageService } from './LocalStorageService'
import { StorageError, ValidationError } from './StorageService'
import { RecipeSchema } from '../types/schemas'
import type { Recipe } from '../types/schemas'

// Mock localStorage
const mockLocalStorage = {
  data: new Map<string, string>(),
  getItem: vi.fn((key: string) => mockLocalStorage.data.get(key) || null),
  setItem: vi.fn((key: string, value: string) => mockLocalStorage.data.set(key, value)),
  removeItem: vi.fn((key: string) => mockLocalStorage.data.delete(key)),
  clear: vi.fn(() => mockLocalStorage.data.clear())
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
})

describe('LocalStorageService', () => {
  let service: LocalStorageService<Recipe>
  const storageKey = 'test_recipes'

  beforeEach(() => {
    // Clear mocks and data
    mockLocalStorage.data.clear()
    vi.clearAllMocks()
    
    // Create fresh service instance
    service = new LocalStorageService<Recipe>(storageKey, RecipeSchema)
  })

  describe('getAll', () => {
    it('returns empty array when no data exists', async () => {
      const result = await service.getAll()
      expect(result).toEqual([])
    })

    it('returns parsed recipes from localStorage', async () => {
      const testRecipes: Recipe[] = [{
        id: '1',
        name: 'Test Recipe',
        ingredients: 'test ingredients',
        steps: 'test steps',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }]
      
      mockLocalStorage.data.set(storageKey, JSON.stringify(testRecipes, (key, value) => 
        value instanceof Date ? value.toISOString() : value
      ))

      const result = await service.getAll()
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Test Recipe')
      expect(result[0].createdAt).toBeInstanceOf(Date)
    })

    it('throws StorageError on invalid JSON', async () => {
      mockLocalStorage.data.set(storageKey, 'invalid json')
      
      await expect(service.getAll()).rejects.toThrow(StorageError)
    })

    it('throws StorageError on validation failure', async () => {
      mockLocalStorage.data.set(storageKey, JSON.stringify([{ invalid: 'data' }]))
      
      await expect(service.getAll()).rejects.toThrow(StorageError)
    })
  })

  describe('getById', () => {
    it('returns recipe when found', async () => {
      const testRecipe: Recipe = {
        id: 'test-id',
        name: 'Test Recipe',
        ingredients: 'test ingredients',
        steps: 'test steps',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      mockLocalStorage.data.set(storageKey, JSON.stringify([testRecipe], (key, value) => 
        value instanceof Date ? value.toISOString() : value
      ))

      const result = await service.getById('test-id')
      expect(result?.name).toBe('Test Recipe')
    })

    it('returns null when recipe not found', async () => {
      const result = await service.getById('nonexistent')
      expect(result).toBeNull()
    })
  })

  describe('create', () => {
    it('creates new recipe with generated ID and timestamps', async () => {
      const newRecipe = {
        name: 'New Recipe',
        ingredients: 'new ingredients',
        steps: 'new steps'
      }

      const result = await service.create(newRecipe)
      
      expect(result.id).toBeTruthy()
      expect(result.name).toBe('New Recipe')
      expect(result.createdAt).toBeInstanceOf(Date)
      expect(result.updatedAt).toBeInstanceOf(Date)
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        storageKey,
        expect.any(String)
      )
    })

    it('throws ValidationError on invalid data', async () => {
      const invalidRecipe = {
        name: '', // Empty name should fail validation
        ingredients: 'ingredients',
        steps: 'steps'
      }

      await expect(service.create(invalidRecipe)).rejects.toThrow(ValidationError)
    })

    it('adds recipe to existing collection', async () => {
      const existingRecipe: Recipe = {
        id: 'existing',
        name: 'Existing Recipe',
        ingredients: 'existing ingredients', 
        steps: 'existing steps',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      mockLocalStorage.data.set(storageKey, JSON.stringify([existingRecipe], (key, value) => 
        value instanceof Date ? value.toISOString() : value
      ))

      const newRecipe = {
        name: 'New Recipe',
        ingredients: 'new ingredients',
        steps: 'new steps'
      }

      await service.create(newRecipe)
      
      const allRecipes = await service.getAll()
      expect(allRecipes).toHaveLength(2)
    })
  })

  describe('update', () => {
    it('updates existing recipe', async () => {
      const originalRecipe: Recipe = {
        id: 'update-test',
        name: 'Original Name',
        ingredients: 'original ingredients',
        steps: 'original steps',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      }
      
      mockLocalStorage.data.set(storageKey, JSON.stringify([originalRecipe], (key, value) => 
        value instanceof Date ? value.toISOString() : value
      ))

      const updates = { name: 'Updated Name' }
      const result = await service.update('update-test', updates)
      
      expect(result.name).toBe('Updated Name')
      expect(result.ingredients).toBe('original ingredients') // Unchanged
      expect(result.updatedAt.getTime()).toBeGreaterThan(result.createdAt.getTime())
    })

    it('throws ValidationError when recipe not found', async () => {
      await expect(service.update('nonexistent', { name: 'New Name' }))
        .rejects.toThrow(ValidationError)
    })

    it('throws ValidationError on invalid updates', async () => {
      const originalRecipe: Recipe = {
        id: 'update-test',
        name: 'Original Name',
        ingredients: 'original ingredients',
        steps: 'original steps',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      mockLocalStorage.data.set(storageKey, JSON.stringify([originalRecipe], (key, value) => 
        value instanceof Date ? value.toISOString() : value
      ))

      await expect(service.update('update-test', { name: '' })) // Empty name
        .rejects.toThrow(ValidationError)
    })
  })

  describe('delete', () => {
    it('removes recipe from storage', async () => {
      const testRecipes: Recipe[] = [
        {
          id: 'keep',
          name: 'Keep Recipe',
          ingredients: 'keep ingredients',
          steps: 'keep steps',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'delete',
          name: 'Delete Recipe',
          ingredients: 'delete ingredients',
          steps: 'delete steps',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      
      mockLocalStorage.data.set(storageKey, JSON.stringify(testRecipes, (key, value) => 
        value instanceof Date ? value.toISOString() : value
      ))

      await service.delete('delete')
      
      const remaining = await service.getAll()
      expect(remaining).toHaveLength(1)
      expect(remaining[0].id).toBe('keep')
    })

    it('throws ValidationError when recipe not found', async () => {
      await expect(service.delete('nonexistent'))
        .rejects.toThrow(ValidationError)
    })
  })

  describe('clear', () => {
    it('removes all data from storage', async () => {
      mockLocalStorage.data.set(storageKey, 'some data')
      
      await service.clear()
      
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(storageKey)
    })
  })

  describe('search', () => {
    beforeEach(async () => {
      const testRecipes: Recipe[] = [
        {
          id: '1',
          name: 'Pasta Carbonara',
          ingredients: 'pasta, eggs, bacon',
          steps: 'cook pasta, mix ingredients',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2', 
          name: 'Tomato Salad',
          ingredients: 'tomatoes, basil, mozzarella',
          steps: 'slice and arrange',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      
      mockLocalStorage.data.set(storageKey, JSON.stringify(testRecipes, (key, value) => 
        value instanceof Date ? value.toISOString() : value
      ))
    })

    it('finds recipes by name', async () => {
      const results = await service.search('pasta', ['name'])
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('Pasta Carbonara')
    })

    it('finds recipes by ingredients', async () => {
      const results = await service.search('tomato', ['ingredients'])
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('Tomato Salad')
    })

    it('searches multiple fields', async () => {
      const results = await service.search('mix', ['name', 'steps'])
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('Pasta Carbonara')
    })

    it('returns empty array when no matches found', async () => {
      const results = await service.search('nonexistent', ['name'])
      expect(results).toEqual([])
    })

    it('is case insensitive', async () => {
      const results = await service.search('PASTA', ['name'])
      expect(results).toHaveLength(1)
    })
  })
})