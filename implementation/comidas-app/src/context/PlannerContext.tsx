import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ComidasWeek, Comida } from '../types/schemas';
import { comidasWeekService } from '../services';

// Define the shape of the planner state
export interface PlannerState {
  currentWeek: ComidasWeek | null;
  weekHistory: ComidasWeek[];
  loading: boolean;
  createWeek: (title?: string) => Promise<ComidasWeek>;
  addMeal: (title: string) => Promise<void>;
  toggleMealComplete: (mealId: string) => Promise<void>;
  updateMeal: (mealId: string, updates: Partial<Comida>) => Promise<void>;
  deleteMeal: (mealId: string) => Promise<void>;
  completeWeek: () => Promise<void>;
  archiveWeek: (weekId: string) => Promise<void>;
  setCurrentWeek: (week: ComidasWeek | null) => void;
}

const PlannerContext = createContext<PlannerState | undefined>(undefined);

export const PlannerProvider = ({ children }: { children: ReactNode }) => {
  const [currentWeek, setCurrentWeek] = useState<ComidasWeek | null>(null);
  const [weekHistory, setWeekHistory] = useState<ComidasWeek[]>([]);
  const [loading, setLoading] = useState(true);

  const generateId = useCallback(() => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Load persisted weeks on mount
  useEffect(() => {
    const loadWeeks = async () => {
      try {
        setLoading(true);
        const allWeeks = await comidasWeekService.getAll();
        
        // Find current week (status: 'current')
        const current = allWeeks.find(week => week.status === 'current') || null;
        
        // Set history to non-current weeks
        const history = allWeeks.filter(week => week.status !== 'current');
        
        setCurrentWeek(current);
        setWeekHistory(history);
      } catch (error) {
        console.error('Failed to load weeks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWeeks();
  }, []);

  const createWeek = useCallback(async (title?: string): Promise<ComidasWeek> => {
    try {
      // Archive any existing current week first
      if (currentWeek) {
        const archivedWeek = { ...currentWeek, status: 'archived' as const };
        await comidasWeekService.update(currentWeek.id, archivedWeek);
        setWeekHistory(prev => [...prev, archivedWeek]);
      }

      // Create week data without ID (service will generate it)
      const newWeekData = {
        title: title || `Week ${new Date().toLocaleDateString()}`,
        status: 'current' as const,
        meals: [],
        mealCount: 0, // Dynamic count, will grow with meals
      };
      
      // Persist the new week and get the complete object with generated ID
      const createdWeek = await comidasWeekService.create(newWeekData);
      setCurrentWeek(createdWeek);
      return createdWeek;
    } catch (error) {
      console.error('Failed to create week:', error);
      throw error;
    }
  }, [currentWeek]);

  const addMeal = useCallback(async (title: string): Promise<void> => {
    if (!currentWeek) return;

    try {
      const newMeal: Comida = {
        id: generateId(),
        title,
        completed: false,
        order: currentWeek.meals.length,
      };

      const updatedMeals = [...currentWeek.meals, newMeal];
      const updatedWeek: ComidasWeek = {
        ...currentWeek,
        meals: updatedMeals,
        mealCount: updatedMeals.length, // Dynamic count based on actual meals
        updatedAt: new Date()
      };

      // Persist the update
      await comidasWeekService.update(currentWeek.id, updatedWeek);
      setCurrentWeek(updatedWeek);
    } catch (error) {
      console.error('Failed to add meal:', error);
      throw error;
    }
  }, [currentWeek, generateId]);

  const toggleMealComplete = useCallback(async (mealId: string): Promise<void> => {
    if (!currentWeek) return;

    try {
      const updatedWeek: ComidasWeek = {
        ...currentWeek,
        meals: currentWeek.meals.map(meal =>
          meal.id === mealId ? { ...meal, completed: !meal.completed } : meal
        ),
        updatedAt: new Date()
      };

      // Persist the update
      await comidasWeekService.update(currentWeek.id, updatedWeek);
      setCurrentWeek(updatedWeek);
    } catch (error) {
      console.error('Failed to toggle meal completion:', error);
      throw error;
    }
  }, [currentWeek]);

  const updateMeal = useCallback(async (mealId: string, updates: Partial<Comida>): Promise<void> => {
    if (!currentWeek) return;

    try {
      const updatedWeek: ComidasWeek = {
        ...currentWeek,
        meals: currentWeek.meals.map(meal =>
          meal.id === mealId ? { ...meal, ...updates } : meal
        ),
        updatedAt: new Date()
      };

      // Persist the update
      await comidasWeekService.update(currentWeek.id, updatedWeek);
      setCurrentWeek(updatedWeek);
    } catch (error) {
      console.error('Failed to update meal:', error);
      throw error;
    }
  }, [currentWeek]);

  const deleteMeal = useCallback(async (mealId: string): Promise<void> => {
    if (!currentWeek) return;

    try {
      const updatedMeals = currentWeek.meals
        .filter(meal => meal.id !== mealId)
        .map((meal, index) => ({ ...meal, order: index })); // Reorder after deletion

      const updatedWeek: ComidasWeek = {
        ...currentWeek,
        meals: updatedMeals,
        mealCount: updatedMeals.length, // Update count after deletion
        updatedAt: new Date()
      };

      // Persist the update
      await comidasWeekService.update(currentWeek.id, updatedWeek);
      setCurrentWeek(updatedWeek);
    } catch (error) {
      console.error('Failed to delete meal:', error);
      throw error;
    }
  }, [currentWeek]);

  const completeWeek = useCallback(async (): Promise<void> => {
    if (!currentWeek) return;

    try {
      const completedWeek: ComidasWeek = {
        ...currentWeek,
        status: 'archived',
        completedAt: new Date(),
        updatedAt: new Date()
      };

      // Persist the archived week
      await comidasWeekService.update(currentWeek.id, completedWeek);
      setWeekHistory(prev => [...prev, completedWeek]);
      setCurrentWeek(null);
    } catch (error) {
      console.error('Failed to complete week:', error);
      throw error;
    }
  }, [currentWeek]);

  const archiveWeek = useCallback(async (weekId: string): Promise<void> => {
    try {
      const weekToArchive = weekHistory.find(week => week.id === weekId);
      if (!weekToArchive) return;

      const archivedWeek = { ...weekToArchive, status: 'archived' as const, updatedAt: new Date() };
      
      // Persist the update
      await comidasWeekService.update(weekId, archivedWeek);
      setWeekHistory(prev =>
        prev.map(week =>
          week.id === weekId ? archivedWeek : week
        )
      );
    } catch (error) {
      console.error('Failed to archive week:', error);
      throw error;
    }
  }, [weekHistory]);

  const value: PlannerState = {
    currentWeek,
    weekHistory,
    loading,
    createWeek,
    addMeal,
    toggleMealComplete,
    updateMeal,
    deleteMeal,
    completeWeek,
    archiveWeek,
    setCurrentWeek
  };

  return (
    <PlannerContext.Provider value={value}>
      {children}
    </PlannerContext.Provider>
  );
};

export const usePlanner = () => {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
};
