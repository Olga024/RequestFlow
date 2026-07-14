CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS requests (
    id SERIAL PRIMARY KEY,
    number VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    author_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
    executor_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
    description TEXT NOT NULL,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('new', 'in_progress', 'done'))
);

CREATE INDEX IF NOT EXISTS idx_requests_executor_status ON requests(executor_id, status);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);