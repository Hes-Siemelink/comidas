import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ComidasWeek, Comida, WeekStatus } from '../types/schemas';
import { comidasWeekService } from '../services';

// Define the shape of the planner state
export interface PlannerState {
  currentWeek: ComidasWeek | null;
  weekHistory: ComidasWeek[];
  loading: boolean;
  showCompletionCeremony: boolean;
  completedWeekData: ComidasWeek | null;
  createWeek: (status?: WeekStatus, title?: string) => Promise<ComidasWeek>;
  addMeal: (title: string) => Promise<void>;
  toggleMealComplete: (mealId: string) => Promise<void>;
  updateMeal: (mealId: string, updates: Partial<Comida>) => Promise<void>;
  deleteMeal: (mealId: string) => Promise<void>;
  reorderMeals: (startIndex: number, endIndex: number) => Promise<void>;
  completeWeek: () => Promise<void>;
  archiveWeek: (weekId: string) => Promise<void>;
  setCurrentWeek: (week: ComidasWeek | null) => void;
  updateWeekTitle: (title: string) => Promise<void>;
  dismissCeremony: () => void;
  proceedToNextWeek: () => Promise<void>;
  // New functions for working with any week
  addMealToWeek: (weekId: string, title: string) => Promise<ComidasWeek>;
  toggleMealCompleteInWeek: (weekId: string, mealId: string) => Promise<ComidasWeek>;
  updateMealInWeek: (weekId: string, mealId: string, updates: Partial<Comida>) => Promise<ComidasWeek>;
  deleteMealFromWeek: (weekId: string, mealId: string) => Promise<ComidasWeek>;
  reorderMealsInWeek: (weekId: string, startIndex: number, endIndex: number) => Promise<ComidasWeek>;
  updateWeekTitleById: (weekId: string, title: string) => Promise<ComidasWeek>;
  // Pure selectors for UI consumption
  getCurrentWeek: () => ComidasWeek | null;
  getPlannedWeek: () => ComidasWeek | null;
  getArchivedWeeks: () => ComidasWeek[];
  getLatestArchivedWeek: () => ComidasWeek | null;
}

const PlannerContext = createContext<PlannerState | undefined>(undefined);

export const PlannerProvider = ({ children }: { children: ReactNode }) => {
  const [currentWeek, setCurrentWeek] = useState<ComidasWeek | null>(null);
  const [weekHistory, setWeekHistory] = useState<ComidasWeek[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompletionCeremony, setShowCompletionCeremony] = useState(false);
  const [completedWeekData, setCompletedWeekData] = useState<ComidasWeek | null>(null);

  const updateWeekTitle = useCallback(async (title: string) => {
    if (!currentWeek) return;
    const newTitle = title.trim().slice(0, 50);
    const updatedWeek = { ...currentWeek, title: newTitle || undefined, updatedAt: new Date() };
    setCurrentWeek(updatedWeek);
    await comidasWeekService.update(updatedWeek.id, updatedWeek);
  }, [currentWeek]);

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

  const createWeek = useCallback(async (status: WeekStatus = 'current', title?: string): Promise<ComidasWeek> => {
    try {
      // Only archive existing current week if we're creating a new current week
      if (status === 'current' && currentWeek) {
        const archivedWeek = { ...currentWeek, status: 'archived' as const };
        await comidasWeekService.update(currentWeek.id, archivedWeek);
        setWeekHistory(prev => [...prev, archivedWeek]);
      }

      // Create week data without ID (service will generate it)
      const newWeekData = {
        title: title || `${status.charAt(0).toUpperCase() + status.slice(1)} Week ${new Date().toLocaleDateString()}`,
        status: status,
        meals: [],
        mealCount: 0, // Dynamic count, will grow with meals
      };
      
      // Persist the new week and get the complete object with generated ID
      const createdWeek = await comidasWeekService.create(newWeekData);
      
      if (status === 'current') {
        setCurrentWeek(createdWeek);
      } else {
        // Add to week history for planned/archived weeks
        setWeekHistory(prev => [...prev, createdWeek]);
      }
      
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

      // Check if this completes the week (all meals completed)
      const allMealsCompleted = updatedWeek.meals.length > 0 && 
        updatedWeek.meals.every(meal => meal.completed);
      
      if (allMealsCompleted && updatedWeek.status === 'current') {
        // Mark the week as completed and show ceremony
        const completedWeek = { 
          ...updatedWeek, 
          status: 'completed' as const,
          completedAt: new Date()
        };
        
        await comidasWeekService.update(currentWeek.id, completedWeek);
        setCurrentWeek(completedWeek);
        setCompletedWeekData(completedWeek);
        setShowCompletionCeremony(true);
      }
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

  const reorderMeals = useCallback(async (startIndex: number, endIndex: number): Promise<void> => {
    if (!currentWeek) return;

    try {
      const meals = [...currentWeek.meals].sort((a, b) => a.order - b.order);
      
      // Move the item from startIndex to endIndex
      const [removed] = meals.splice(startIndex, 1);
      meals.splice(endIndex, 0, removed);
      
      // Update order values
      const reorderedMeals = meals.map((meal, index) => ({
        ...meal,
        order: index
      }));

      const updatedWeek: ComidasWeek = {
        ...currentWeek,
        meals: reorderedMeals,
        updatedAt: new Date()
      };

      // Persist the update
      await comidasWeekService.update(currentWeek.id, updatedWeek);
      setCurrentWeek(updatedWeek);
    } catch (error) {
      console.error('Failed to reorder meals:', error);
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

      // Find a planned week to promote to current
      const plannedWeek = weekHistory.find(week => week.status === 'planned');

      // Persist the archived week
      await comidasWeekService.update(currentWeek.id, completedWeek);

      if (plannedWeek) {
        // Promote planned week to current
        const promotedWeek: ComidasWeek = {
          ...plannedWeek,
          status: 'current',
          updatedAt: new Date()
        };
        await comidasWeekService.update(plannedWeek.id, promotedWeek);
        setCurrentWeek(promotedWeek);
        
        // Update week history: remove planned week, add completed week
        setWeekHistory(prev => [...prev.filter(week => week.id !== plannedWeek.id), completedWeek]);
      } else {
        // No planned week to promote
        setCurrentWeek(null);
        
        // Update week history: add completed week
        setWeekHistory(prev => [...prev, completedWeek]);
      }
    } catch (error) {
      console.error('Failed to complete week:', error);
      throw error;
    }
  }, [currentWeek, weekHistory]);

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

  const dismissCeremony = useCallback(() => {
    setShowCompletionCeremony(false);
    setCompletedWeekData(null);
  }, []);

  const proceedToNextWeek = useCallback(async () => {
    if (!completedWeekData) return;

    try {
      // Archive the completed week
      const archivedWeek = { 
        ...completedWeekData, 
        status: 'archived' as const, 
        updatedAt: new Date() 
      };
      
      await comidasWeekService.update(completedWeekData.id, archivedWeek);
      
      // Update weekHistory
      setWeekHistory(prev =>
        prev.map(week =>
          week.id === completedWeekData.id ? archivedWeek : week
        )
      );

      // Create a new current week
      const newWeek = await createWeek('current', 'New Week');
      setCurrentWeek(newWeek);
      
      // Dismiss ceremony
      dismissCeremony();
    } catch (error) {
      console.error('Failed to proceed to next week:', error);
      throw error;
    }
  }, [completedWeekData, createWeek, dismissCeremony]);

  // Helper function to find and update a week
  const findAndUpdateWeek = useCallback((weekId: string, updater: (week: ComidasWeek) => ComidasWeek): ComidasWeek | null => {
    if (currentWeek?.id === weekId) {
      const updatedWeek = updater(currentWeek);
      setCurrentWeek(updatedWeek);
      return updatedWeek;
    }
    
    const weekIndex = weekHistory.findIndex(week => week.id === weekId);
    if (weekIndex !== -1) {
      const updatedWeek = updater(weekHistory[weekIndex]);
      setWeekHistory(prev => prev.map((week, index) => 
        index === weekIndex ? updatedWeek : week
      ));
      return updatedWeek;
    }
    
    return null;
  }, [currentWeek, weekHistory]);

  // New functions for working with any week
  const addMealToWeek = useCallback(async (weekId: string, title: string): Promise<ComidasWeek> => {
    const targetWeek = currentWeek?.id === weekId ? currentWeek : weekHistory.find(week => week.id === weekId);
    if (!targetWeek) throw new Error('Week not found');

    try {
      const newMeal: Comida = {
        id: generateId(),
        title,
        completed: false,
        order: targetWeek.meals.length,
      };

      const updatedMeals = [...targetWeek.meals, newMeal];
      const updatedWeek: ComidasWeek = {
        ...targetWeek,
        meals: updatedMeals,
        mealCount: updatedMeals.length,
        updatedAt: new Date()
      };

      await comidasWeekService.update(weekId, updatedWeek);
      const result = findAndUpdateWeek(weekId, () => updatedWeek);
      if (!result) throw new Error('Failed to update week');
      return result;
    } catch (error) {
      console.error('Failed to add meal to week:', error);
      throw error;
    }
  }, [currentWeek, weekHistory, generateId, findAndUpdateWeek]);

  const toggleMealCompleteInWeek = useCallback(async (weekId: string, mealId: string): Promise<ComidasWeek> => {
    const targetWeek = currentWeek?.id === weekId ? currentWeek : weekHistory.find(week => week.id === weekId);
    if (!targetWeek) throw new Error('Week not found');

    try {
      const updatedWeek: ComidasWeek = {
        ...targetWeek,
        meals: targetWeek.meals.map(meal =>
          meal.id === mealId ? { ...meal, completed: !meal.completed } : meal
        ),
        updatedAt: new Date()
      };

      await comidasWeekService.update(weekId, updatedWeek);
      const result = findAndUpdateWeek(weekId, () => updatedWeek);
      if (!result) throw new Error('Failed to update week');

      // Check if this completes the week (only for current weeks)
      if (targetWeek.status === 'current') {
        const allMealsCompleted = updatedWeek.meals.length > 0 && 
          updatedWeek.meals.every(meal => meal.completed);
        
        if (allMealsCompleted) {
          const completedWeek = { 
            ...updatedWeek, 
            status: 'completed' as const,
            completedAt: new Date()
          };
          
          await comidasWeekService.update(weekId, completedWeek);
          setCurrentWeek(completedWeek);
          setCompletedWeekData(completedWeek);
          setShowCompletionCeremony(true);
          return completedWeek;
        }
      }

      return result;
    } catch (error) {
      console.error('Failed to toggle meal completion in week:', error);
      throw error;
    }
  }, [currentWeek, weekHistory, findAndUpdateWeek]);

  const updateMealInWeek = useCallback(async (weekId: string, mealId: string, updates: Partial<Comida>): Promise<ComidasWeek> => {
    const targetWeek = currentWeek?.id === weekId ? currentWeek : weekHistory.find(week => week.id === weekId);
    if (!targetWeek) throw new Error('Week not found');

    try {
      const updatedWeek: ComidasWeek = {
        ...targetWeek,
        meals: targetWeek.meals.map(meal =>
          meal.id === mealId ? { ...meal, ...updates } : meal
        ),
        updatedAt: new Date()
      };

      await comidasWeekService.update(weekId, updatedWeek);
      const result = findAndUpdateWeek(weekId, () => updatedWeek);
      if (!result) throw new Error('Failed to update week');
      return result;
    } catch (error) {
      console.error('Failed to update meal in week:', error);
      throw error;
    }
  }, [currentWeek, weekHistory, findAndUpdateWeek]);

  const deleteMealFromWeek = useCallback(async (weekId: string, mealId: string): Promise<ComidasWeek> => {
    const targetWeek = currentWeek?.id === weekId ? currentWeek : weekHistory.find(week => week.id === weekId);
    if (!targetWeek) throw new Error('Week not found');

    try {
      const updatedMeals = targetWeek.meals
        .filter(meal => meal.id !== mealId)
        .map((meal, index) => ({ ...meal, order: index }));

      const updatedWeek: ComidasWeek = {
        ...targetWeek,
        meals: updatedMeals,
        mealCount: updatedMeals.length,
        updatedAt: new Date()
      };

      await comidasWeekService.update(weekId, updatedWeek);
      const result = findAndUpdateWeek(weekId, () => updatedWeek);
      if (!result) throw new Error('Failed to update week');
      return result;
    } catch (error) {
      console.error('Failed to delete meal from week:', error);
      throw error;
    }
  }, [currentWeek, weekHistory, findAndUpdateWeek]);

  const reorderMealsInWeek = useCallback(async (weekId: string, startIndex: number, endIndex: number): Promise<ComidasWeek> => {
    const targetWeek = currentWeek?.id === weekId ? currentWeek : weekHistory.find(week => week.id === weekId);
    if (!targetWeek) throw new Error('Week not found');

    try {
      const meals = [...targetWeek.meals].sort((a, b) => a.order - b.order);
      
      const [removed] = meals.splice(startIndex, 1);
      meals.splice(endIndex, 0, removed);
      
      const reorderedMeals = meals.map((meal, index) => ({
        ...meal,
        order: index
      }));

      const updatedWeek: ComidasWeek = {
        ...targetWeek,
        meals: reorderedMeals,
        updatedAt: new Date()
      };

      await comidasWeekService.update(weekId, updatedWeek);
      const result = findAndUpdateWeek(weekId, () => updatedWeek);
      if (!result) throw new Error('Failed to update week');
      return result;
    } catch (error) {
      console.error('Failed to reorder meals in week:', error);
      throw error;
    }
  }, [currentWeek, weekHistory, findAndUpdateWeek]);

  const updateWeekTitleById = useCallback(async (weekId: string, title: string): Promise<ComidasWeek> => {
    const targetWeek = currentWeek?.id === weekId ? currentWeek : weekHistory.find(week => week.id === weekId);
    if (!targetWeek) throw new Error('Week not found');

    const newTitle = title.trim().slice(0, 50);
    const updatedWeek = { ...targetWeek, title: newTitle || undefined, updatedAt: new Date() };
    
    try {
      await comidasWeekService.update(weekId, updatedWeek);
      const result = findAndUpdateWeek(weekId, () => updatedWeek);
      if (!result) throw new Error('Failed to update week');
      return result;
    } catch (error) {
      console.error('Failed to update week title:', error);
      throw error;
    }
  }, [currentWeek, weekHistory, findAndUpdateWeek]);

  // Pure selectors for UI consumption
  const getCurrentWeek = useCallback((): ComidasWeek | null => {
    return currentWeek;
  }, [currentWeek]);

  const getPlannedWeek = useCallback((): ComidasWeek | null => {
    return weekHistory.find(week => week.status === 'planned') || null;
  }, [weekHistory]);

  const getArchivedWeeks = useCallback((): ComidasWeek[] => {
    return weekHistory
      .filter(week => week.status === 'completed' || week.status === 'archived')
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [weekHistory]);

  const getLatestArchivedWeek = useCallback((): ComidasWeek | null => {
    const archivedWeeks = getArchivedWeeks();
    return archivedWeeks[0] || null;
  }, [getArchivedWeeks]);

  const value: PlannerState = {
    currentWeek,
    weekHistory,
    loading,
    showCompletionCeremony,
    completedWeekData,
    createWeek,
    addMeal,
    toggleMealComplete,
    updateMeal,
    deleteMeal,
    reorderMeals,
    completeWeek,
    archiveWeek,
    setCurrentWeek,
    updateWeekTitle,
    dismissCeremony,
    proceedToNextWeek,
    addMealToWeek,
    toggleMealCompleteInWeek,
    updateMealInWeek,
    deleteMealFromWeek,
    reorderMealsInWeek,
    updateWeekTitleById,
    getCurrentWeek,
    getPlannedWeek,
    getArchivedWeeks,
    getLatestArchivedWeek
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
