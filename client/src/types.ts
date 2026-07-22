export type TIssueStatus = 'new' | 'in_progress' | 'done';

export type TEmployee = {
    id: number;
    fullName: string;
    department: string;
    position: string;
};

export type TNewIssue = {
    createdAt: string;
    authorId: number;
    executorId: number;
    description: string;
    deadline: string;

};

export type TIssue = TNewIssue & {
    id: number;
    number:string;
    status: TIssueStatus;
};

export type TIssuesFilters = {
    status?: TIssueStatus;
    executorId?: number;
    department?: string;
    overdue?: string;
};

export type TReport = {
    total: number;
    statusCounts: Record<TIssueStatus, number>;
    overdue: number;
    doneByExecutor: Record<TIssueStatus, number>;
};

export type TPagination = {
    pageSize: number;
    currentPage: number;
}