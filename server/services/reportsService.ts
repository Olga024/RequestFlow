import { TIssueStatus, TReport } from "../types/common";

export const getReports = (): TReport => {
    let total = 0,
        overdue = 0,
        doneByExecutor = {},
        statusCounts: Record<TIssueStatus, number> = {
            new: 0,
            in_progress: 0,
            done: 0,
        };

    return { total, statusCounts, overdue, doneByExecutor };
};