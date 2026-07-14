import { createContext, useContext, useState, type ReactNode } from 'react';
import type { TRequestFilters } from '../types';

type TFiltersContextType = {
  filters: TRequestFilters;
  setFilters: (newFilters: TRequestFilters) => void;
  resetFilters: () => void;
};

const defaultFilters: TRequestFilters = {};

const FiltersContext = createContext<TFiltersContextType | undefined>(undefined);

export const FiltersProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<TRequestFilters>(defaultFilters);

  const resetFilters = () => setFilters({});

  return (
    <FiltersContext.Provider value={{ filters, setFilters, resetFilters }}>
      {children}
    </FiltersContext.Provider>
  );
};

export const useFilters = (): TFiltersContextType => {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error('useFilters must be used within a FiltersProvider');
  }
  return context;
};