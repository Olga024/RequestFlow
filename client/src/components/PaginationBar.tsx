type TPaginationBarProps = {
    pageSize: number;
    totalRecords: number;
    currentPage: number;
    onPageChange: (newPage: number) => void;
    onPageSizeChange: (newPageSize: number) => void;
}

export const PaginationBar = ({
    pageSize,
    totalRecords,
    currentPage,
    onPageChange,
    onPageSizeChange,
}: TPaginationBarProps) => {
    return <>
        Page size <select
            value={pageSize}
            onChange={({ target: { value } }) => { onPageSizeChange(Number(value)) }}>
            {[10, 50, 100, 200, 500].map((pageNumber) => {
                return <option value={pageNumber}>{pageNumber}</option>
            })}
        </select>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        {/*<button onClick={() => { onPageChange(currentPage - 1) }}>&#8592;</button>*/}
        Current page <input
            type='number'
            min={1}
            max={totalRecords / pageSize}
            defaultValue={currentPage}
            onChange={({ target: { value } }) => { onPageChange(Number(value)) }}
        /> of {totalRecords / pageSize}
        {/*<button onClick={() => { onPageChange(currentPage + 1) }}>&#8594;</button>*/}
    </>
}