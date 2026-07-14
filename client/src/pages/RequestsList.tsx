import { useEffect } from 'react';
import { useRequests } from '../context/RequestsContext';
import { useFilters } from '../context/FiltersContext';
import { useEmployees } from '../context/EmployeesContext';
import type { TStatus } from '../types';

export const RequestsList = () => {
    const { requests, loading, error, loadRequests, changeStatus, changeExecutor } = useRequests();
    const { filters, setFilters, resetFilters } = useFilters();
    const { employees } = useEmployees();

    useEffect(() => {
        loadRequests(filters);
    }, [filters]);

    const handleStatusChange = (id: number, newStatus: TStatus) => {
        changeStatus(id, newStatus)
            .then(() => loadRequests(filters))
            .catch(console.error);
    };

    const handleExecutorChange = (id: number, executorId: number) => {
        changeExecutor(id, executorId)
            .then(() => loadRequests(filters))
            .catch(console.error);
    };

    const getEmployeeName = (id: number) => {
        const emp = employees.find(e => e.id === id);
        return emp ? emp.fullName : 'Неизвестно';
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const isOverdue = (deadline: string, status: TStatus) => {
        return status !== 'done' && new Date(deadline) < new Date();
    };

    const statusOptions: TStatus[] = ['new', 'in_progress', 'done'];
    const statusLabels: Record<TStatus, string> = {
        new: 'Новая',
        in_progress: 'В работе',
        done: 'Выполнена',
    };

    return (
        <div>
            <h2>Список заявок</h2>

            {/* Панель фильтров */}
            <div className="filters">
                <select
                    value={filters.status || ''}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value as TStatus || undefined })}
                >
                    <option value="">Все статусы</option>
                    {statusOptions.map(s => (
                        <option key={s} value={s}>{statusLabels[s]}</option>
                    ))}
                </select>

                <select
                    value={filters.executorId || ''}
                    onChange={(e) => setFilters({ ...filters, executorId: Number(e.target.value) || undefined })}
                >
                    <option value="">Все исполнители</option>
                    {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                    ))}
                </select>

                <select
                    value={filters.department || ''}
                    onChange={(e) => setFilters({ ...filters, department: e.target.value || undefined })}
                >
                    <option value="">Все подразделения</option>
                    {Array.from(new Set(employees.map(e => e.department))).map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                    ))}
                </select>

                <label>
                    <input
                        type="checkbox"
                        checked={filters.overdue === 'true'}
                        onChange={(e) => setFilters({ ...filters, overdue: e.target.checked ? 'true' : undefined })}
                    />
                    Только просроченные
                </label>

                <button onClick={resetFilters}>Сбросить</button>
            </div>

            {/* Состояния загрузки/ошибки */}
            {loading && <div className="loading">Загрузка...</div>}
            {error && <div className="error">Ошибка: {error}</div>}

            {/* Таблица заявок */}
            {!loading && !error && (
                <table className="requests-table">
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Дата создания</th>
                            <th>Автор</th>
                            <th>Исполнитель</th>
                            <th>Описание</th>
                            <th>Срок</th>
                            <th>Статус</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length === 0 ? (
                            <tr><td colSpan={8}>Нет заявок</td></tr>
                        ) : (
                            requests.map(req => (
                                <tr key={req.id} className={isOverdue(req.deadline, req.status) ? 'overdue' : ''}>
                                    <td>{req.number}</td>
                                    <td>{formatDate(req.createdAt)}</td>
                                    <td>{getEmployeeName(req.authorId)}</td>
                                    <td>{getEmployeeName(req.executorId)}</td>
                                    <td>{req.description}</td>
                                    <td>{formatDate(req.deadline)}</td>
                                    <td>
                                        <span className={`status status-${req.status}`}>
                                            {statusLabels[req.status]}
                                        </span>
                                    </td>
                                    <td>
                                        {/* Смена статуса */}
                                        <select
                                            value={req.status}
                                            onChange={(e) => handleStatusChange(req.id, e.target.value as TStatus)}
                                        >
                                            {statusOptions.map(s => (
                                                <option key={s} value={s} disabled={s === req.status}>
                                                    {statusLabels[s]}
                                                </option>
                                            ))}
                                        </select>

                                        {/* Смена исполнителя */}
                                        <select
                                            value={req.executorId}
                                            onChange={(e) => handleExecutorChange(req.id, Number(e.target.value))}
                                        >
                                            {employees.map(emp => (
                                                <option key={emp.id} value={emp.id}>
                                                    {emp.fullName}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};