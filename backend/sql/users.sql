CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    display_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    CONSTRAINT uq_users_email UNIQUE (email)
);

-- Index on email for rapid lookup during login/registration
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
