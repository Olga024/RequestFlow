const { requests, nextRequestId } = require('../data/mock');
const { getEmployeeById } = require('./employeeService');

const allowedStatusTransitions = {
    new: ['in_progress'],
    in_progress: ['done'],
    done: [],
};

const getRequests = (filters = {}) => {
    let result = [...requests];

    if (filters.status) {
        result = result.filter(r => r.status === filters.status);
    }

    if (filters.executorId) {
        const id = Number(filters.executorId);
        result = result.filter(r => r.executorId === id);
    }

    if (filters.department) {
        result = result.filter(r => {
            const executor = getEmployeeById(r.executorId);
            return executor && executor.department === filters.department;
        });
    }

    if (filters.overdue === 'true') {
        const now = new Date();
        result = result.filter(r => r.status !== 'done' && new Date(r.deadline) < now);
    }

    return result;
};

const createRequest = (data) => {

    if (!getEmployeeById(data.authorId)) {
        throw new Error('Автор не найден');
    }
    if (!getEmployeeById(data.executorId)) {
        throw new Error('Исполнитель не найден');
    }

    const newRequest = {
        id: nextRequestId++,
        number: data.number || `REQ-${String(nextRequestId).padStart(3, '0')}`,
        createdAt: new Date(),
        authorId: data.authorId,
        executorId: data.executorId,
        description: data.description,
        deadline: new Date(data.deadline),
        status: 'new',
    };

    requests.push(newRequest);
    return newRequest;
};

const updateStatus = (requestId, newStatus) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) {
        throw new Error('Заявка не найдена');
    }

    const currentStatus = request.status;
    const allowed = allowedStatusTransitions[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
        throw new Error(`Недопустимый переход статуса: из "${currentStatus}" в "${newStatus}"`);
    }

    request.status = newStatus;
    return request;
};

const updateExecutor = (requestId, newExecutorId) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) {
        throw new Error('Заявка не найдена');
    }

    if (!getEmployeeById(newExecutorId)) {
        throw new Error('Исполнитель не найден');
    }

    if (request.status === 'done') {
        throw new Error('Нельзя изменить исполнителя выполненной заявки');
    }

    request.executorId = newExecutorId;
    return request;
};

const getReports = () => {
    const total = requests.length;
    const statusCounts = {
        new: requests.filter(r => r.status === 'new').length,
        in_progress: requests.filter(r => r.status === 'in_progress').length,
        done: requests.filter(r => r.status === 'done').length,
    };

    const now = new Date();
    const overdue = requests.filter(r => r.status !== 'done' && new Date(r.deadline) < now).length;

    const doneByExecutor = {};
    requests
        .filter(r => r.status === 'done')
        .forEach(r => {
            const executor = getEmployeeById(r.executorId);
            const name = executor ? executor.fullName : 'Неизвестный';
            doneByExecutor[name] = (doneByExecutor[name] || 0) + 1;
        });

    return {
        total,
        statusCounts,
        overdue,
        doneByExecutor,
    };
};

module.exports = {
    getRequests,
    createRequest,
    updateStatus,
    updateExecutor,
    getReports,
};