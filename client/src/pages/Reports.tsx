import { useEffect, useState, useCallback } from 'react';
import { fetchReport } from '../api/api';
import type { TReport } from '../types';

export const Reports = () => {
    const [report, setReport] = useState<TReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadReport = useCallback(() => {
        setLoading(true);
        setError(null);
        fetchReport()
            .then((data) => {
                setReport(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        loadReport();
    }, [loadReport]);

    if (loading) return <div>Загрузка отчёта...</div>;
    if (error) return <div>Ошибка: {error}</div>;
    if (!report) return <div>Нет данных</div>;

    const statusLabels: Record<string, string> = {
        new: 'Новая',
        in_progress: 'В работе',
        done: 'Выполнена',
    };

    return (
        <div>
            <h2>Отчёт</h2>
            <div className="report-section">
                <h3>Количество заявок по статусам</h3>
                <ul>
                    {Object.entries(report.statusCounts).map(([status, count]) => (
                        <li key={status}>
                            {statusLabels[status] || status}: {count}
                        </li>
                    ))}
                    <li><strong>Всего:</strong> {report.total}</li>
                </ul>
            </div>

            <div className="report-section">
                <h3>Просроченные заявки</h3>
                <p>{report.overdue}</p>
            </div>

            <div className="report-section">
                <h3>Выполненные заявки по исполнителям</h3>
                <ul>
                    {Object.entries(report.doneByExecutor).map(([name, count]) => (
                        <li key={name}>{name}: {count}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};