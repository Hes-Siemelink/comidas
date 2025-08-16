// Integration tests for service layer initialization and sample data
// Tests the complete service setup and sample data bootstrapping

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { recipeService, initializeSampleData } from './index'

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

// Mock console methods
const consoleSpy = {
  log: vi.spyOn(console, 'log').mockImplementation(() => {}),
  error: vi.spyOn(console, 'error').mockImplementation(() => {})
}

describe('Service Layer', () => {
  beforeEach(() => {
    // Clear mocks and data
    mockLocalStorage.data.clear()
    vi.clearAllMocks()
    consoleSpy.log.mockClear()
    consoleSpy.error.mockClear()
  })

  describe('Service Instances', () => {
    it('provides access to recipe service', () => {
      expect(recipeService).toBeDefined()
      expect(typeof recipeService.getAll).toBe('function')
      expect(typeof recipeService.create).toBe('function')
    })

    it('recipe service uses correct storage key', async () => {
      await recipeService.getAll()
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('comidas_recipes')
    })
  })

  describe('Sample Data Initialization', () => {
    it('initializes sample recipes when storage is empty', async () => {
      await initializeSampleData()
      
      const recipes = await recipeService.getAll()
      expect(recipes).toHaveLength(3)
      
      const recipeNames = recipes.map(r => r.name)
      expect(recipeNames).toContain('Albondigas de Marta')
      expect(recipeNames).toContain('Appelmoes') 
      expect(recipeNames).toContain('Broccoli Salad de Leon')
      
      expect(consoleSpy.log).toHaveBeenCalledWith('Sample recipes initialized successfully')
    })

    it('does not initialize when recipes already exist', async () => {
      // Create a recipe first
      await recipeService.create({
        name: 'Existing Recipe',
        ingredients: 'existing ingredients',
        steps: 'existing steps'
      })

      await initializeSampleData()
      
      const recipes = await recipeService.getAll()
      expect(recipes).toHaveLength(1) // Only the existing recipe
      expect(recipes[0].name).toBe('Existing Recipe')
      
      expect(consoleSpy.log).not.toHaveBeenCalledWith('Sample recipes initialized successfully')
    })

    it('handles initialization errors gracefully', async () => {
      // Mock recipeService.getAll to throw an error
      const originalGetAll = recipeService.getAll
      vi.spyOn(recipeService, 'getAll').mockRejectedValueOnce(new Error('Storage error'))

      await expect(initializeSampleData()).rejects.toThrow('Storage error')
      expect(consoleSpy.error).toHaveBeenCalledWith('Failed to initialize sample data:', expect.any(Error))

      // Restore original method
      recipeService.getAll = originalGetAll
    })

    it('initializes recipes with proper structure', async () => {
      await initializeSampleData()
      
      const recipes = await recipeService.getAll()
      const albondigas = recipes.find(r => r.name === 'Albondigas de Marta')
      
      expect(albondigas).toBeDefined()
      expect(albondigas!.id).toBeTruthy()
      expect(albondigas!.ingredients).toContain('1 kg carne molida de res')
      expect(albondigas!.steps).toContain('Hervir el jitomate')
      expect(albondigas!.createdAt).toBeInstanceOf(Date)
      expect(albondigas!.updatedAt).toBeInstanceOf(Date)
    })

    it('handles multilingual recipe content correctly', async () => {
      await initializeSampleData()
      
      const recipes = await recipeService.getAll()
      
      // Spanish recipe
      const albondigas = recipes.find(r => r.name === 'Albondigas de Marta')
      expect(albondigas!.ingredients).toContain('carne molida de res')
      
      // Dutch recipe  
      const appelmoes = recipes.find(r => r.name === 'Appelmoes')
      expect(appelmoes!.ingredients).toContain('appels')
      expect(appelmoes!.steps).toContain('Schil de appels')
      
      // English recipe
      const broccoli = recipes.find(r => r.name === 'Broccoli Salad de Leon')
      expect(broccoli!.ingredients).toContain('broccoli')
    })
  })

  describe('Error Exports', () => {
    it('exports StorageError and ValidationError', async () => {
      const { StorageError, ValidationError } = await import('./index')
      
      expect(StorageError).toBeDefined()
      expect(ValidationError).toBeDefined()
      
      const storageError = new StorageError('test message', 'test operation', 'test key')
      expect(storageError.message).toBe('test message')
      expect(storageError.operation).toBe('test operation')
      expect(storageError.storageKey).toBe('test key')
      
      const validationError = new ValidationError('validation failed', 'testField', 'testValue')
      expect(validationError.message).toBe('validation failed')
      expect(validationError.field).toBe('testField')
      expect(validationError.value).toBe('testValue')
    })
  })
})