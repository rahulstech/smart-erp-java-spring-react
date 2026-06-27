CREATE TABLE IF NOT EXISTS inventory_transactions (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL,
    stock_item_id UUID NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    reference_type VARCHAR(100),
    reference_id UUID,
    quantity_change DECIMAL(19, 2) NOT NULL,
    quantity_before DECIMAL(19, 2) NOT NULL,
    quantity_after DECIMAL(19, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT fk_inventory_transactions_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    CONSTRAINT fk_inventory_transactions_stock_item FOREIGN KEY (stock_item_id) REFERENCES stock_items(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_inv_tx_company_id ON inventory_transactions(company_id);
CREATE INDEX IF NOT EXISTS idx_inv_tx_stock_item_id ON inventory_transactions(stock_item_id);
CREATE INDEX IF NOT EXISTS idx_inv_tx_created_at ON inventory_transactions(created_at DESC);
