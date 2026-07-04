CREATE TABLE IF NOT EXISTS purchase_voucher_items (
    id UUID PRIMARY KEY,
    purchase_voucher_id UUID NOT NULL,
    stock_item_id UUID NOT NULL,
    quantity DECIMAL(19, 2) NOT NULL,
    unit_price DECIMAL(19, 2) NOT NULL,
    amount DECIMAL(19, 2) NOT NULL,
    CONSTRAINT fk_purchase_voucher_items_voucher FOREIGN KEY (purchase_voucher_id) REFERENCES purchase_vouchers(id) ON DELETE CASCADE,
    CONSTRAINT fk_purchase_voucher_items_stock_item FOREIGN KEY (stock_item_id) REFERENCES stock_items(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_purchase_voucher_items_voucher_id ON purchase_voucher_items(purchase_voucher_id);
CREATE INDEX IF NOT EXISTS idx_purchase_voucher_items_stock_item_id ON purchase_voucher_items(stock_item_id);
