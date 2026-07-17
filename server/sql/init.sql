DROP SCHEMA IF EXISTS requestflow_schema CASCADE;

CREATE SCHEMA requestflow_schema;

CREATE TABLE IF NOT EXISTS requestflow_schema.employees (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS requestflow_schema.issues (
    id SERIAL PRIMARY KEY,
    number VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    author_id INTEGER NOT NULL REFERENCES requestflow_schema.employees(id) ON DELETE RESTRICT,
    executor_id INTEGER NOT NULL REFERENCES requestflow_schema.employees(id) ON DELETE RESTRICT,
    description TEXT NOT NULL,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('new', 'in_progress', 'done'))
);

CREATE INDEX IF NOT EXISTS idx_issues_executor_status ON requestflow_schema.issues(executor_id, status);
CREATE INDEX IF NOT EXISTS idx_issues_status ON requestflow_schema.issues(status);