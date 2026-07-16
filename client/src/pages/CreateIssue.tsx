import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataContext } from '../context/DataContext';


export const CreateIssue = () => {
    const navigate = useNavigate();
    const {employeesList, addIssue} = useDataContext();

    const [form, setForm] = useState({
        description: '',
        deadline: '',
        executorId: employeesList.length > 0 ? employeesList[0].id : 0,
        authorId: employeesList.length > 1 ? employeesList[1].id : (employeesList.length > 0 ? employeesList[0].id : 0),
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = useCallback(
        (e: React.SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();
            setLoading(true);
            setError(null);

            if (!form.description.trim()) {
                setError('Описание обязательно');
                setLoading(false);
                return;
            }
            if (!form.deadline) {
                setError('Срок выполнения обязателен');
                setLoading(false);
                return;
            }

            addIssue({
                authorId: form.authorId,
                executorId: form.executorId,
                description: form.description,
                deadline: form.deadline,
            })
                .then(() => {
                    setLoading(false);
                    navigate('/');
                })
                .catch((err) => {
                    setError(err.message);
                    setLoading(false);
                });
        },
        [form, addIssue, navigate]
    );

    return (
        <div>
            <h2>Создание заявки</h2>
            <form onSubmit={handleSubmit} className="create-form">
                <div className="form-group">
                    <label>Автор</label>
                    <select
                        value={form.authorId}
                        onChange={(e) => setForm({ ...form, authorId: Number(e.target.value) })}
                        required
                    >
                        {employeesList.map((emp) => (
                            <option key={emp.id} value={emp.id}>
                                {emp.fullName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Исполнитель</label>
                    <select
                        value={form.executorId}
                        onChange={(e) => setForm({ ...form, executorId: Number(e.target.value) })}
                        required
                    >
                        {employeesList.map((emp) => (
                            <option key={emp.id} value={emp.id}>
                                {emp.fullName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Описание</label>
                    <textarea
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        required
                        rows={4}
                    />
                </div>

                <div className="form-group">
                    <label>Срок выполнения</label>
                    <input
                        type="datetime-local"
                        value={form.deadline}
                        onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                        required
                    />
                </div>

                {error && <div className="error">{error}</div>}

                <button type="submit" disabled={loading}>
                    {loading ? 'Создание...' : 'Создать заявку'}
                </button>
            </form>
        </div>
    );
};