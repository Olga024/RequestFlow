import type { TEmployee, TReport, TRequestFilters } from '../types';

const API_BASE = 'http://localhost:5000/api';

export const fetchEmployees = (): Promise<TEmployee[]> => {
    return fetch(`${API_BASE}/employees`)
        .then(response => {
            if (!response.ok) throw new Error('Ошибка загрузки сотрудников');
            return response.json();
        });
};

export const fetchRequests = (filters?: TRequestFilters): Promise<Request[]> => {
    // Строим query-строку из фильтров
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.executorId) params.append('executorId', String(filters.executorId));
    if (filters?.department) params.append('department', filters.department);
    if (filters?.overdue) params.append('overdue', filters.overdue);

    const url = `${API_BASE}/requests${params.toString() ? '?' + params.toString() : ''}`;
    return fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Ошибка загрузки заявок');
            return response.json();
        });
};

export const createRequest = (data: {
    number?: string;
    authorId: number;
    executorId: number;
    description: string;
    deadline: string;
}): Promise<Request> => {
    return fetch(`${API_BASE}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) return response.json().then(err => { throw new Error(err.error || 'Ошибка создания'); });
            return response.json();
        });
};

export const updateRequestStatus = (id: number, status: string): Promise<Request> => {
    return fetch(`${API_BASE}/requests/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    })
        .then(response => {
            if (!response.ok) return response.json().then(err => { throw new Error(err.error || 'Ошибка изменения статуса'); });
            return response.json();
        });
};

export const updateRequestExecutor = (id: number, executorId: number): Promise<Request> => {
    return fetch(`${API_BASE}/requests/${id}/executor`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ executorId }),
    })
        .then(response => {
            if (!response.ok) return response.json().then(err => { throw new Error(err.error || 'Ошибка изменения исполнителя'); });
            return response.json();
        });
};

export const fetchReport = (): Promise<TReport> => {
    return fetch(`${API_BASE}/reports`)
        .then(response => {
            if (!response.ok) throw new Error('Ошибка загрузки отчёта');
            return response.json();
        });
};