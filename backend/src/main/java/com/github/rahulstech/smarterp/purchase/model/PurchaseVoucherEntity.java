package com.github.rahulstech.smarterp.purchase.model;

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
 * Aggregate root entity representing a Purchase Voucher.
 * Uses direct foreign key UUID fields without Hibernate relation annotations.
 */
@Getter
@Setter
@Entity
@Table(name = "purchase_vouchers", uniqueConstraints = {
    @UniqueConstraint(name = "uq_purchase_vouchers_company_voucher_number", columnNames = {"company_id", "voucher_number"})
})
public class PurchaseVoucherEntity extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @Column(name = "supplier_id", nullable = false)
    private UUID supplierId;

    @Column(name = "voucher_number", nullable = false, length = 100)
    private String voucherNumber;

    @Column(name = "voucher_date", nullable = false)
    private LocalDate voucherDate;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

}
