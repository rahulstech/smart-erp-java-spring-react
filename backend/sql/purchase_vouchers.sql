CREATE TABLE IF NOT EXISTS purchase_vouchers (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL,
    supplier_id UUID NOT NULL,
    voucher_number VARCHAR(100) NOT NULL,
    voucher_date DATE NOT NULL,
    total_amount DECIMAL(19, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT uq_purchase_vouchers_company_voucher_number UNIQUE (company_id, voucher_number),
    CONSTRAINT fk_purchase_vouchers_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    CONSTRAINT fk_purchase_vouchers_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

CREATE INDEX IF NOT EXISTS idx_purchase_vouchers_company_id ON purchase_vouchers(company_id);
CREATE INDEX IF NOT EXISTS idx_purchase_vouchers_supplier_id ON purchase_vouchers(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchase_vouchers_voucher_date ON purchase_vouchers(voucher_date);
