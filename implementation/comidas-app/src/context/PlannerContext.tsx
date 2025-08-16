import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Define the shape of the planner state
export interface PlannerState {
  weekPlan: string[];
  setWeekPlan: (plan: string[]) => void;
}

const PlannerContext = createContext<PlannerState | undefined>(undefined);

export const PlannerProvider = ({ children }: { children: ReactNode }) => {
  const [weekPlan, setWeekPlan] = useState<string[]>([]);

  return (
    <PlannerContext.Provider value={{ weekPlan, setWeekPlan }}>
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
