export type TStatus = 'new' | 'in_progress' | 'done';

export type TEmployee = {
    id: number;
    fullName: string;
    department: string;
    position: string;
};

export type TRequest = {
    id: number;
    number: string;
    createdAt: string;
    authorId: number;
    executorId: number;
    description: string;
    deadline: string;
    status: TStatus;
};

export type TRequestFilters = {
    status?: TStatus;
    executorId?: number;
    department?: string;
    overdue?: string;
};

export type TReport = {
    total: number;
    statusCounts: Record<TStatus, number>;
    overdue: number;
    doneByExecutor: Record<string, number>;
};