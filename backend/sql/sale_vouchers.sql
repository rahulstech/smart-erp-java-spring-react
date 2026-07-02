CREATE TABLE IF NOT EXISTS sale_vouchers (
    id UUID PRIMARY KEY,
    company_id UUID NOT NULL,
    customer_id UUID NOT NULL,
    voucher_number VARCHAR(100) NOT NULL,
    voucher_date DATE NOT NULL,
    grand_total DECIMAL(19, 2) NOT NULL DEFAULT 0.00,
    cancelled BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT uq_sale_vouchers_company_voucher_number UNIQUE (company_id, voucher_number),
    CONSTRAINT fk_sale_vouchers_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    CONSTRAINT fk_sale_vouchers_customer FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE INDEX IF NOT EXISTS idx_sale_vouchers_company_id ON sale_vouchers(company_id);
CREATE INDEX IF NOT EXISTS idx_sale_vouchers_customer_id ON sale_vouchers(customer_id);
CREATE INDEX IF NOT EXISTS idx_sale_vouchers_voucher_date ON sale_vouchers(voucher_date);
