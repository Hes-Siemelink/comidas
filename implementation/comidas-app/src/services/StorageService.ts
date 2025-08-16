// Generic storage service interface for CRUD operations
// Designed to support easy migration from localStorage to backend API

export interface StorageService<T> {
  getAll(): Promise<T[]>
  getById(id: string): Promise<T | null>
  create(item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>
  update(id: string, updates: Partial<T>): Promise<T>
  delete(id: string): Promise<void>
  clear(): Promise<void>
}

export interface StorageServiceWithSearch<T> extends StorageService<T> {
  search(query: string, fields: (keyof T)[]): Promise<T[]>
}

// Error types for storage operations
export class StorageError extends Error {
  constructor(
    message: string,
    public readonly operation: string,
    public readonly storageKey: string,
    public readonly cause?: Error
  ) {
    super(message)
    this.name = 'StorageError'
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly field?: string,
    public readonly value?: unknown
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}