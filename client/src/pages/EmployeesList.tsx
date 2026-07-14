import { useEmployees } from '../context/EmployeesContext';

export const EmployeesList = () => {
    const { employees, loading, error } = useEmployees();

    if (loading) return <div>Загрузка сотрудников...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div>
            <h2>Справочник сотрудников</h2>
            <table className="employees-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>ФИО</th>
                        <th>Подразделение</th>
                        <th>Должность</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(emp => (
                        <tr key={emp.id}>
                            <td>{emp.id}</td>
                            <td>{emp.fullName}</td>
                            <td>{emp.department}</td>
                            <td>{emp.position}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};