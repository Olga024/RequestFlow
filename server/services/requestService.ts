import { requests, getNextRequestId, Request, Employee } from '../data/mock';
import { getEmployeeById } from './employeeService';

type Status = Request['status'];

const allowedStatusTransitions: Record<Status, Status[]> = {
    new: ['in_progress'],
    in_progress: ['done'],
    done: [],
};

interface RequestFilters {
    status?: Status;
    executorId?: number;
    department?: string;
    overdue?: string;
}

export const getRequests = (filters: RequestFilters = {}): Request[] => {
    let result = [...requests];

    if (filters.status) {
        result = result.filter(r => r.status === filters.status);
    }

    if (filters.executorId) {
        result = result.filter(r => r.executorId === filters.executorId);
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

interface CreateRequestData {
    number?: string;
    authorId: number;
    executorId: number;
    description: string;
    deadline: string;
}

export const createRequest = (data: CreateRequestData): Request => {
    const author = getEmployeeById(data.authorId);
    if (!author) throw new Error('Автор не найден');

    const executor = getEmployeeById(data.executorId);
    if (!executor) throw new Error('Исполнитель не найден');

    const newId = getNextRequestId();

    const newRequest: Request = {
        id: newId,
        number: data.number || `REQ-${String(newId).padStart(3, '0')}`,
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

export const updateStatus = (requestId: number, newStatus: Status): Request => {
    const request = requests.find(r => r.id === requestId);
    if (!request) throw new Error('Заявка не найдена');

    const currentStatus = request.status;
    const allowed = allowedStatusTransitions[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
        throw new Error(`Недопустимый переход статуса: из "${currentStatus}" в "${newStatus}"`);
    }

    request.status = newStatus;
    return request;
};

export const updateExecutor = (requestId: number, newExecutorId: number): Request => {
    const request = requests.find(r => r.id === requestId);
    if (!request) throw new Error('Заявка не найдена');

    if (!getEmployeeById(newExecutorId)) {
        throw new Error('Исполнитель не найден');
    }

    if (request.status === 'done') {
        throw new Error('Нельзя изменить исполнителя выполненной заявки');
    }

    request.executorId = newExecutorId;
    return request;
};

interface Report {
    total: number;
    statusCounts: Record<Status, number>;
    overdue: number;
    doneByExecutor: Record<string, number>;
}

export const getReports = (): Report => {
    const total = requests.length;
    const statusCounts: Record<Status, number> = {
        new: 0,
        in_progress: 0,
        done: 0,
    };
    requests.forEach(r => statusCounts[r.status]++);

    const now = new Date();
    const overdue = requests.filter(r => r.status !== 'done' && new Date(r.deadline) < now).length;

    const doneByExecutor: Record<string, number> = {};
    requests
        .filter(r => r.status === 'done')
        .forEach(r => {
            const executor = getEmployeeById(r.executorId);
            const name = executor ? executor.fullName : 'Неизвестный';
            doneByExecutor[name] = (doneByExecutor[name] || 0) + 1;
        });

    return { total, statusCounts, overdue, doneByExecutor };
};