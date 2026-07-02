CREATE TABLE IF NOT EXISTS sale_voucher_items (
    id UUID PRIMARY KEY,
    sale_voucher_id UUID NOT NULL,
    stock_item_id UUID NOT NULL,
    item_name VARCHAR(255),
    hsn_code VARCHAR(50),
    quantity DECIMAL(19, 4) NOT NULL DEFAULT 0.0000,
    rate DECIMAL(19, 2) NOT NULL DEFAULT 0.00,
    line_total DECIMAL(19, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT fk_sale_voucher_items_sale_voucher FOREIGN KEY (sale_voucher_id) REFERENCES sale_vouchers(id) ON DELETE CASCADE,
    CONSTRAINT fk_sale_voucher_items_stock_item FOREIGN KEY (stock_item_id) REFERENCES stock_items(id)
);

CREATE INDEX IF NOT EXISTS idx_sale_voucher_items_sale_voucher_id ON sale_voucher_items(sale_voucher_id);
CREATE INDEX IF NOT EXISTS idx_sale_voucher_items_stock_item_id ON sale_voucher_items(stock_item_id);
