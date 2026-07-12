export type Status = 'new' | 'in_progress' | 'done';

export type Employee = {
    id: number;
    fullName: string;
    department: string;
    position: string;
};

export type Request = {
    id: number;
    number: string;
    createdAt: Date;
    authorId: number;
    executorId: number;
    description: string;
    deadline: Date;
    status: Status;
};

export const employees: Employee[] = [
    { id: 1, fullName: 'Иванов Иван Иванович', department: 'IT', position: 'Разработчик' },
    { id: 2, fullName: 'Петрова Ольга Сергеевна', department: 'Бухгалтерия', position: 'Главный бухгалтер' },
    { id: 3, fullName: 'Сидоров Петр Алексеевич', department: 'Отдел продаж', position: 'Менеджер' },
    { id: 4, fullName: 'Кузнецова Анна Владимировна', department: 'HR', position: 'Специалист по кадрам' },
    { id: 5, fullName: 'Михайлов Дмитрий Николаевич', department: 'IT', position: 'Тестировщик' },
];

export const requests: Request[] = [
    {
        id: 1,
        number: 'REQ-001',
        createdAt: new Date('2026-07-01T10:00:00'),
        authorId: 1,
        executorId: 5,
        description: 'Настроить почтовый сервер',
        deadline: new Date('2026-07-15T18:00:00'),
        status: 'new',
    },
    {
        id: 2,
        number: 'REQ-002',
        createdAt: new Date('2026-07-02T14:30:00'),
        authorId: 2,
        executorId: 3,
        description: 'Подготовить отчёт по налогам',
        deadline: new Date('2026-07-10T12:00:00'),
        status: 'in_progress',
    },
    {
        id: 3,
        number: 'REQ-003',
        createdAt: new Date('2026-07-03T09:15:00'),
        authorId: 4,
        executorId: 1,
        description: 'Обновить штатное расписание',
        deadline: new Date('2026-07-20T17:00:00'),
        status: 'done',
    },
];

let nextRequestId = 4;

export function getNextRequestId(): number {
    return nextRequestId++;
}