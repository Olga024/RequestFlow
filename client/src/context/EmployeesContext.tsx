import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { fetchEmployees } from '../api/api';
import type { TEmployee } from '../types';

type TEmployeesContextType = {
    employees: TEmployee[];
    loading: boolean;
    error: string | null;
};

const EmployeesContext = createContext<TEmployeesContextType | undefined>(undefined);

export const EmployeesProvider = ({ children }: { children: ReactNode }) => {
    const [employees, setEmployees] = useState<TEmployee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchEmployees()
            .then((data) => {
                setEmployees(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return (
        <EmployeesContext.Provider value={{ employees, loading, error }}>
            {children}
        </EmployeesContext.Provider>
    );
};

export const useEmployees = (): TEmployeesContextType => {
    const context = useContext(EmployeesContext);
    if (!context) {
        throw new Error('useEmployees must be used within an EmployeesProvider');
    }
    return context;
};