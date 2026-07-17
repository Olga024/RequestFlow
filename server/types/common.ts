export type TPagination = {
    pageSize: number;
    startFrom: number;
}

export type TEmployee = {
    id: number;
    fullName: string;
    department: string;
    position: string;
};

export type TIssueStatus = 'new' | 'in_progress' | 'done';

export type TIssue = {
    id: number;
    number: string;
    createdAt: Date;
    authorId: number;
    executorId: number;
    description: string;
    deadline: Date;
    status: TIssueStatus;
};

export type TIssuesFilters = {
    status?: TIssueStatus;
    executorId?: number;
    department?: string;
    overdue?: string;
}

export type TNewIssueData = {
    authorId: number;
    executorId: number;
    description: string;
    deadline: string;
}


export type TReport = {
    total: number;
    statusCounts: Record<TIssueStatus, number>;
    overdue: number;
    doneByExecutor: Record<string, number>;
}