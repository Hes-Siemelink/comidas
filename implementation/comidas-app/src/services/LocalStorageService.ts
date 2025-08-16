// localStorage implementation of StorageService
// Provides type-safe CRUD operations with validation and error handling

import { z } from 'zod'
import type { StorageServiceWithSearch } from './StorageService'
import { StorageError, ValidationError } from './StorageService'

interface HasId {
  id: string
}

interface HasTimestamps {
  createdAt: Date
  updatedAt: Date
}

type CreateInput<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>

export class LocalStorageService<T extends HasId & HasTimestamps> 
  implements StorageServiceWithSearch<T> {
  
  private readonly storageKey: string
  private readonly schema: z.ZodSchema<T>
  
  constructor(
    storageKey: string,
    schema: z.ZodSchema<T>
  ) {
    this.storageKey = storageKey
    this.schema = schema
  }

  async getAll(): Promise<T[]> {
    try {
      const data = localStorage.getItem(this.storageKey)
      if (!data) return []
      
      const parsed = JSON.parse(data, this.dateReviver)
      const validated = z.array(this.schema).parse(parsed)
      return validated
    } catch (error) {
      throw new StorageError(
        `Failed to retrieve all items from ${this.storageKey}`,
        'getAll',
        this.storageKey,
        error instanceof Error ? error : undefined
      )
    }
  }

  async getById(id: string): Promise<T | null> {
    try {
      const items = await this.getAll()
      return items.find(item => item.id === id) || null
    } catch (error) {
      throw new StorageError(
        `Failed to retrieve item ${id} from ${this.storageKey}`,
        'getById',
        this.storageKey,
        error instanceof Error ? error : undefined
      )
    }
  }

  async create(item: CreateInput<T>): Promise<T> {
    try {
      const now = new Date()
      const newItem = {
        ...item,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now
      } as T

      // Validate the new item
      const validated = this.schema.parse(newItem)
      
      const items = await this.getAll()
      items.push(validated)
      
      localStorage.setItem(this.storageKey, JSON.stringify(items, this.dateReplacer))
      return validated
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(
          `Validation failed: ${error.issues?.map?.((e: any) => e.message)?.join?.(', ') || 'Unknown validation error'}`,
          error.issues?.[0]?.path?.[0]?.toString(),
          item
        )
      }
      if (error instanceof ValidationError) {
        throw error
      }
      throw new StorageError(
        `Failed to create item in ${this.storageKey}`,
        'create',
        this.storageKey,
        error instanceof Error ? error : undefined
      )
    }
  }

  async update(id: string, updates: Partial<T>): Promise<T> {
    try {
      const items = await this.getAll()
      const index = items.findIndex(item => item.id === id)
      
      if (index === -1) {
        throw new ValidationError(`Item with id ${id} not found`)
      }

      const updatedItem = {
        ...items[index],
        ...updates,
        id, // Preserve original ID
        updatedAt: new Date()
      }

      // Validate the updated item
      const validated = this.schema.parse(updatedItem)
      
      items[index] = validated
      localStorage.setItem(this.storageKey, JSON.stringify(items, this.dateReplacer))
      
      return validated
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(
          `Validation failed: ${error.issues?.map?.((e: any) => e.message)?.join?.(', ') || 'Unknown validation error'}`,
          error.issues?.[0]?.path?.[0]?.toString(),
          updates
        )
      }
      if (error instanceof ValidationError) {
        throw error
      }
      throw new StorageError(
        `Failed to update item ${id} in ${this.storageKey}`,
        'update',
        this.storageKey,
        error instanceof Error ? error : undefined
      )
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const items = await this.getAll()
      const filtered = items.filter(item => item.id !== id)
      
      if (filtered.length === items.length) {
        throw new ValidationError(`Item with id ${id} not found`)
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(filtered, this.dateReplacer))
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error
      }
      throw new StorageError(
        `Failed to delete item ${id} from ${this.storageKey}`,
        'delete',
        this.storageKey,
        error instanceof Error ? error : undefined
      )
    }
  }

  async clear(): Promise<void> {
    try {
      localStorage.removeItem(this.storageKey)
    } catch (error) {
      throw new StorageError(
        `Failed to clear ${this.storageKey}`,
        'clear',
        this.storageKey,
        error instanceof Error ? error : undefined
      )
    }
  }

  async search(query: string, fields: (keyof T)[]): Promise<T[]> {
    try {
      const items = await this.getAll()
      const lowercaseQuery = query.toLowerCase()
      
      return items.filter(item =>
        fields.some(field => {
          const value = item[field]
          return typeof value === 'string' && 
                 value.toLowerCase().includes(lowercaseQuery)
        })
      )
    } catch (error) {
      throw new StorageError(
        `Failed to search in ${this.storageKey}`,
        'search',
        this.storageKey,
        error instanceof Error ? error : undefined
      )
    }
  }

  // Helper methods for Date serialization
  private dateReplacer(_key: string, value: unknown): unknown {
    return value instanceof Date ? value.toISOString() : value
  }

  private dateReviver(_key: string, value: unknown): unknown {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      return new Date(value)
    }
    return value
  }
}