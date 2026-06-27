CREATE TABLE IF NOT EXISTS stock_items (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL,
    category_id UUID NOT NULL,
    unit_id UUID NOT NULL,
    sku VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    quantity DECIMAL(19, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT uq_stock_items_company_sku UNIQUE (company_id, sku),
    CONSTRAINT fk_stock_items_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    CONSTRAINT fk_stock_items_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    CONSTRAINT fk_stock_items_unit FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_stock_items_company_id ON stock_items(company_id);
CREATE INDEX IF NOT EXISTS idx_stock_items_sku ON stock_items(sku);
CREATE INDEX IF NOT EXISTS idx_stock_items_company_name ON stock_items(company_id, name);
