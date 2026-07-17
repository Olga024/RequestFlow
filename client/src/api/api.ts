import type { TEmployee, TReport, TIssuesFilters, TIssue, TNewIssue } from '../types';

const API_BASE = 'http://localhost:5000/api';

export const fetchEmployees = (): Promise<TEmployee[]> => new Promise((resolve, reject) => {
    fetch(`${API_BASE}/employees`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка загрузки сотрудников');
            }
            response.json()
                .then(resolve)
                .catch(reject);
        })
        .catch(reject);
});

export const fetchIssuesList = (filters?: TIssuesFilters): Promise<TIssue[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.executorId) params.append('executorId', String(filters.executorId));
    if (filters?.department) params.append('department', filters.department);
    if (filters?.overdue) params.append('overdue', filters.overdue);

    const url = `${API_BASE}/requests${params.toString() ? '?' + params.toString() : ''}`;
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                if (!response.ok && response.status! == 200) {
                    throw new Error('Ошибка загрузки заявок');
                }
                response.json()
                    .then(resolve)
                    .catch(reject);
            })
            .catch(reject);
    });
};

export const fetchCreateIssue = (data: TNewIssue): Promise<TIssue> => new Promise((resolve, reject) => {
    fetch(`${API_BASE}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error on create issue')
            }

            response.json()
                .then(resolve)
                .catch(reject);

        });
});

export const updateIssueStatus = (id: number, status: string): Promise<TIssue> => {
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

export const updateIssueExecutor = (id: number, executorId: number): Promise<TIssue> => {
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