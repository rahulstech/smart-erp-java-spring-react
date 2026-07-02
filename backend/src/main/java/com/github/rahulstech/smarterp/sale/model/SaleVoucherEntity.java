package com.github.rahulstech.smarterp.sale.model;

import com.github.rahulstech.smarterp.common.model.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Aggregate root entity representing a Sale Voucher transaction.
 */
@Getter
@Setter
@Entity
@Table(name = "sale_vouchers", uniqueConstraints = {
    @UniqueConstraint(name = "uq_sale_vouchers_company_voucher_number", columnNames = {"company_id", "voucher_number"})
})
public class SaleVoucherEntity extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @Column(name = "customer_id", nullable = false)
    private UUID customerId;

    @Column(name = "voucher_number", nullable = false, length = 100)
    private String voucherNumber;

    @Column(name = "voucher_date", nullable = false)
    private LocalDate voucherDate;

    @Column(name = "grand_total", nullable = false)
    private BigDecimal grandTotal = BigDecimal.ZERO;

    @Column(name = "cancelled", nullable = false)
    private boolean cancelled = false;
}
