import { useEffect, useState } from 'react';
import { useDataContext } from '../context/DataContext';

export const EmployeesList = () => {
    const [displayState, setDisplayState] = useState<'list' | 'idle' | 'error'>()
    const {
        employeesList,
        employeesListloading,
        employeesError,
    } = useDataContext();

    useEffect(() => {
        if (employeesError) {
            setDisplayState('error');
        } else if (employeesListloading) {
            setDisplayState('idle');
        } else {
            setDisplayState('list');
        }
    }, [
        employeesError,
        employeesListloading,
        employeesList,
        setDisplayState
    ]);

    return (
        <div>
            <h2>Справочник сотрудников</h2>
            {displayState == 'idle' && <div>Загрузка сотрудников...</div>}
            {displayState == 'error' && <div>Ошибка: {employeesError}</div>}
            {displayState == 'list' && <table className="employees-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>ФИО</th>
                        <th>Подразделение</th>
                        <th>Должность</th>
                    </tr>
                </thead>
                <tbody>
                    {employeesList.map(emp => (
                        <tr key={emp.id}>
                            <td>{emp.id}</td>
                            <td>{emp.fullName}</td>
                            <td>{emp.department}</td>
                            <td>{emp.position}</td>
                        </tr>
                    ))}
                </tbody>
            </table>}
        </div>
    );
};