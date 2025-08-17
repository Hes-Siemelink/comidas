import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ComidasWeek, Comida, WeekStatus } from '../types/schemas';
import { comidasWeekService } from '../services';

// Constants
const ID_RANDOM_LENGTH = 9;
const MAX_TITLE_LENGTH = 50;
const INITIAL_MEAL_COUNT = 0;

// Define the shape of the planner state
export interface PlannerState {
  currentWeek: ComidasWeek | null;
  weekHistory: ComidasWeek[];
  loading: boolean;
  showCompletionCeremony: boolean;
  completedWeekData: ComidasWeek | null;
  
  // Week Management
  createWeek: (status?: WeekStatus, title?: string) => Promise<ComidasWeek>;
  completeWeek: () => Promise<void>;
  archiveWeek: (weekId: string) => Promise<void>;
  updateWeekTitle: (weekId: string, title: string) => Promise<ComidasWeek>;
  
  // Meal Operations (all require explicit weekId)
  addMeal: (weekId: string, title: string) => Promise<ComidasWeek>;
  updateMeal: (weekId: string, mealId: string, updates: Partial<Comida>) => Promise<ComidasWeek>;
  deleteMeal: (weekId: string, mealId: string) => Promise<ComidasWeek>;
  toggleMealComplete: (weekId: string, mealId: string) => Promise<ComidasWeek>;
  reorderMeals: (weekId: string, startIndex: number, endIndex: number) => Promise<ComidasWeek>;
  
  // State Selectors
  getCurrentWeek: () => ComidasWeek | null;
  getPlannedWeek: () => ComidasWeek | null;
  getArchivedWeeks: () => ComidasWeek[];
  getLatestArchivedWeek: () => ComidasWeek | null;
  
  // Ceremony Control
  dismissCeremony: () => void;
  proceedToNextWeek: () => Promise<void>;
  
  // Internal (may be removed in future)
  setCurrentWeek: (week: ComidasWeek | null) => void;
}

const PlannerContext = createContext<PlannerState | undefined>(undefined);

export const PlannerProvider = ({ children }: { children: ReactNode }) => {
  const [currentWeek, setCurrentWeek] = useState<ComidasWeek | null>(null);
  const [weekHistory, setWeekHistory] = useState<ComidasWeek[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompletionCeremony, setShowCompletionCeremony] = useState(false);
  const [completedWeekData, setCompletedWeekData] = useState<ComidasWeek | null>(null);

  const generateId = useCallback(() => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, ID_RANDOM_LENGTH)}`;
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

  // Helper to generate default week title
  const generateWeekTitle = useCallback((status: WeekStatus, title?: string): string => {
    return title || `${status.charAt(0).toUpperCase() + status.slice(1)} Week ${new Date().toLocaleDateString()}`;
  }, []);

  // Helper to archive current week when creating new current week
  const archiveCurrentWeek = useCallback(async (): Promise<void> => {
    if (!currentWeek) return;
    
    const archivedWeek = { ...currentWeek, status: 'archived' as const };
    await comidasWeekService.update(currentWeek.id, archivedWeek);
    setWeekHistory(prev => [...prev, archivedWeek]);
  }, [currentWeek]);

  const createWeek = useCallback(async (status: WeekStatus = 'current', title?: string): Promise<ComidasWeek> => {
    try {
      // Archive existing current week if creating new current week
      if (status === 'current' && currentWeek) {
        await archiveCurrentWeek();
      }

      // Create week data
      const newWeekData = {
        title: generateWeekTitle(status, title),
        status: status,
        meals: [],
        mealCount: INITIAL_MEAL_COUNT,
      };
      
      const createdWeek = await comidasWeekService.create(newWeekData);
      
      // Update state based on week status
      if (status === 'current') {
        setCurrentWeek(createdWeek);
      } else {
        setWeekHistory(prev => [...prev, createdWeek]);
      }
      
      return createdWeek;
    } catch (error) {
      console.error('Failed to create week:', error);
      throw error;
    }
  }, [currentWeek, generateWeekTitle, archiveCurrentWeek]);

  const dismissCeremony = useCallback(() => {
    setShowCompletionCeremony(false);
    setCompletedWeekData(null);
  }, []);

  const proceedToNextWeek = useCallback(async () => {
    if (!completedWeekData) return;

    try {
      // Archive the completed week (update from 'completed' to 'archived')
      const archivedWeek = { 
        ...completedWeekData, 
        status: 'archived' as const, 
        updatedAt: new Date() 
      };
      
      await comidasWeekService.update(completedWeekData.id, archivedWeek);
      
      // Update weekHistory to replace completed week with archived week
      setWeekHistory(prev =>
        prev.map(week =>
          week.id === completedWeekData.id ? archivedWeek : week
        )
      );

      // Note: We don't create a new week here anymore since completeWeek 
      // already handles promoting planned week to current. If there's no 
      // current week after completion, the user can create one manually.
      
      // Dismiss ceremony
      dismissCeremony();
    } catch (error) {
      console.error('Failed to proceed to next week:', error);
      throw error;
    }
  }, [completedWeekData, dismissCeremony]);

  // Helper function to create a completed week
  const createCompletedWeek = useCallback((week: ComidasWeek): ComidasWeek => ({
    ...week,
    status: 'archived' as const,
    completedAt: new Date(),
    updatedAt: new Date()
  }), []);

  // Helper function to promote planned week to current
  const promoteWeekToCurrent = useCallback(async (plannedWeek: ComidasWeek): Promise<ComidasWeek> => {
    const promotedWeek: ComidasWeek = {
      ...plannedWeek,
      status: 'current',
      updatedAt: new Date()
    };
    await comidasWeekService.update(plannedWeek.id, promotedWeek);
    return promotedWeek;
  }, []);

  // Helper function to update state after week completion
  const updateStateAfterCompletion = useCallback((
    completedWeek: ComidasWeek, 
    plannedWeek: ComidasWeek | null,
    promotedWeek?: ComidasWeek
  ) => {
    if (plannedWeek && promotedWeek) {
      setCurrentWeek(promotedWeek);
      setWeekHistory(prev => [
        ...prev.filter(week => week.id !== plannedWeek.id),
        completedWeek
      ]);
    } else {
      setCurrentWeek(null);
      setWeekHistory(prev => [...prev, completedWeek]);
    }
    
    setCompletedWeekData(completedWeek);
    setShowCompletionCeremony(true);
  }, []);

  const completeWeek = useCallback(async (): Promise<void> => {
    if (!currentWeek) return;

    try {
      const completedWeek = createCompletedWeek(currentWeek);
      const plannedWeek = weekHistory.find(week => week.status === 'planned') || null;

      // Save the completed week
      await comidasWeekService.update(currentWeek.id, completedWeek);

      // Promote planned week if exists
      const promotedWeek = plannedWeek ? await promoteWeekToCurrent(plannedWeek) : undefined;
      
      // Update all state
      updateStateAfterCompletion(completedWeek, plannedWeek, promotedWeek);
    } catch (error) {
      console.error('Failed to complete week:', error);
      throw error;
    }
  }, [currentWeek, weekHistory, createCompletedWeek, promoteWeekToCurrent, updateStateAfterCompletion]);

  const archiveWeek = useCallback(async (weekId: string): Promise<void> => {
    try {
      // Get the specific week to archive
      const weekToArchive = currentWeek?.id === weekId ? 
        currentWeek : 
        weekHistory.find(week => week.id === weekId);
      
      if (!weekToArchive) {
        throw new Error(`Week with ID ${weekId} not found`);
      }

      const archivedWeek: ComidasWeek = {
        ...weekToArchive,
        status: 'archived',
        updatedAt: new Date()
      };

      // Save the archived week
      await comidasWeekService.update(weekId, archivedWeek);
      
      // Update state based on which week was archived
      if (currentWeek?.id === weekId) {
        // If archiving current week, set current to null
        setCurrentWeek(null);
        setWeekHistory(prev => [...prev, archivedWeek]);
      } else {
        // If archiving a week in history, update history
        setWeekHistory(prev => 
          prev.map(week => week.id === weekId ? archivedWeek : week)
        );
      }
    } catch (error) {
      console.error('Failed to archive week:', error);
      throw error;
    }
  }, [currentWeek, weekHistory]);

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
          
          // Find if there's a planned week to promote
          const plannedWeek = weekHistory.find(week => week.status === 'planned');
          
          if (plannedWeek) {
            // Promote planned week to current immediately
            const promotedWeek: ComidasWeek = {
              ...plannedWeek,
              status: 'current',
              updatedAt: new Date()
            };
            await comidasWeekService.update(plannedWeek.id, promotedWeek);
            setCurrentWeek(promotedWeek);
            
            // Update week history: remove planned week, add completed week
            setWeekHistory(prev => [
              ...prev.filter(week => week.id !== plannedWeek.id), 
              completedWeek
            ]);
          } else {
            // No planned week - set current to null
            setCurrentWeek(null);
            // Update week history: add completed week
            setWeekHistory(prev => [...prev, completedWeek]);
          }
          
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

    const newTitle = title.trim().slice(0, MAX_TITLE_LENGTH);
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
    
    // Week Management 
    createWeek,
    completeWeek,
    archiveWeek,
    updateWeekTitle: updateWeekTitleById,
    
    // Meal Operations (all require explicit weekId)
    addMeal: addMealToWeek,
    updateMeal: updateMealInWeek,
    deleteMeal: deleteMealFromWeek,
    toggleMealComplete: toggleMealCompleteInWeek,
    reorderMeals: reorderMealsInWeek,
    
    // State Selectors
    getCurrentWeek,
    getPlannedWeek,
    getArchivedWeeks,
    getLatestArchivedWeek,
    
    // Ceremony Control
    dismissCeremony,
    proceedToNextWeek,
    
    // Internal (may be removed in future)
    setCurrentWeek,
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
