import { createContext, useContext, useState, type ReactNode } from 'react';
import { fetchRequests, createRequest, updateRequestStatus, updateRequestExecutor } from '../api/api';
import type { TRequest, TRequestFilters, TStatus } from '../types';

type TRequestsContextType = {
  requests: TRequest[];
  loading: boolean;
  error: string | null;
  loadRequests: (filters?: TRequestFilters) => void;
  addRequest: (data: Parameters<typeof createRequest>[0]) => Promise<TRequest>;
  changeStatus: (id: number, status: TStatus) => Promise<TRequest>;
  changeExecutor: (id: number, executorId: number) => Promise<TRequest>;
};

const RequestsContext = createContext<TRequestsContextType | undefined>(undefined);

export const RequestsProvider = ({ children }: { children: ReactNode }) => {
  const [requests, setRequests] = useState<TRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRequests = (filters?: TRequestFilters) => {
    setLoading(true);
    setError(null);
    fetchRequests(filters)
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const addRequest = (data: Parameters<typeof createRequest>[0]): Promise<TRequest> => {
    return createRequest(data)
      .then((newRequest) => {
        setRequests((prev) => [...prev, newRequest]);
        return newRequest;
      })
      .catch((err) => {
        setError(err.message);
        throw err;
      });
  };

  const changeStatus = (id: number, status: TStatus): Promise<TRequest> => {
    return updateRequestStatus(id, status)
      .then((updated) => {
        setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
        return updated;
      })
      .catch((err) => {
        setError(err.message);
        throw err;
      });
  };

  const changeExecutor = (id: number, executorId: number): Promise<TRequest> => {
    return updateRequestExecutor(id, executorId)
      .then((updated) => {
        setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
        return updated;
      })
      .catch((err) => {
        setError(err.message);
        throw err;
      });
  };

  return (
    <RequestsContext.Provider
      value={{
        requests,
        loading,
        error,
        loadRequests,
        addRequest,
        changeStatus,
        changeExecutor,
      }}
    >
      {children}
    </RequestsContext.Provider>
  );
};

export const useRequests = (): TRequestsContextType => {
  const context = useContext(RequestsContext);
  if (!context) {
    throw new Error('useRequests must be used within a RequestsProvider');
  }
  return context;
};