import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { TEmployee, TIssue, TIssuesFilters, TNewIssue, TIssueStatus } from "../types";
import { fetchCreateIssue, fetchEmployees, fetchIssuesList, updateIssueStatus, updateIssueExecutor } from "../api/api";

type TDataContextType = {
    employeesList: TEmployee[];
    loadEmployeesList: () => void;
    employeesListloading: boolean;
    employeesError: string | null;
    loadIssuesList: (filters?: TIssuesFilters) => void;
    issuesList: TIssue[];
    loadingIssuesList: boolean;
    issueError: string | null;
    addIssue: (newIssueData: Omit<TNewIssue, 'createdAt'>) => Promise<void>;
    changeIssueStatus: (id: number, status: TIssueStatus) => Promise<void>;
    changeIssueExecutor: (id: number, executorId: number) => Promise<void>;
};

const DataContext = createContext<TDataContextType | undefined>(undefined);

export const DataContextProvider = ({ children }: { children: ReactNode }) => {
    const [employeesList, setEmployeesList] = useState<TDataContextType['employeesList']>([]);
    const [employeesListloading, setEmployeesListloading] = useState(true);
    const [employeesError, setEmployeesError] = useState<TDataContextType['employeesError']>(null);
    const [issuesList, setIssuesList] = useState<TDataContextType['issuesList']>([]);
    const [loadingIssuesList, setLoadingIssuesList] = useState(false);
    const [issueError, setIssueError] = useState<TDataContextType['issueError']>(null);

    const loadEmployeesList = () => {
        if (employeesListloading) {
            return;
        }
        setEmployeesError(null);
        setEmployeesListloading(true);
        fetchEmployees()
            .then((data) => {
                setEmployeesList(data);
                setEmployeesListloading(false);
            })
            .catch((err) => {
                setEmployeesError(err.message);
                setEmployeesListloading(false);
            });
    }

    const loadIssuesList: TDataContextType['loadIssuesList'] = (filters) => {
        setLoadingIssuesList(true);
        setIssueError(null);
        fetchIssuesList(filters)
            .then((data) => {
                setIssuesList(data);
                setLoadingIssuesList(false);
            })
            .catch((err) => {
                setIssueError(err.message);
                setLoadingIssuesList(false);
            });
    };

    const addIssue: TDataContextType['addIssue'] = (newIssueData) => new Promise((resolve, reject) => {
        fetchCreateIssue({ ...newIssueData, createdAt: Date.now().toString() })
            .then((createdIssue) => {
                setIssuesList((prev) => [...prev, createdIssue]);
                resolve();
            })
            .catch((err) => {
                setIssueError(err.message);
                reject(err.message)
            });
    });

    const changeIssueStatus: TDataContextType['changeIssueStatus'] = (id, status) => new Promise((resolve, reject) => {
        updateIssueStatus(id, status)
            .then((updated) => {
                setIssuesList((prev) => prev.map((r) => (r.id === id ? updated : r)));
                resolve();
            })
            .catch((err) => {
                setIssueError(err.message);
                reject();
            });
    });

    const changeIssueExecutor: TDataContextType['changeIssueExecutor'] = (id, executorId) => new Promise((resolve, reject) => {
        updateIssueExecutor(id, executorId)
            .then((updated) => {
                setIssuesList((prev) => prev.map((r) => (r.id === id ? updated : r)));
                resolve();
            })
            .catch((err) => {
                setIssueError(err.message);
                reject();
            });
    });

    useEffect(() => {
        loadEmployeesList();
    }, [loadEmployeesList]);

    return (
        <DataContext.Provider value={{
            employeesList,
            loadEmployeesList,
            employeesListloading,
            employeesError,
            loadIssuesList,
            issuesList,
            loadingIssuesList,
            issueError,
            addIssue,
            changeIssueStatus,
            changeIssueExecutor,
        }}>
            {children}
        </DataContext.Provider >
    );
};

export const useDataContext = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useDataContext must be used within an DataContextProvider');
    }
    return context;
}