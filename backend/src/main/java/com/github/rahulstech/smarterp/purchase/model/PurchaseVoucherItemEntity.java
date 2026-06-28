package com.github.rahulstech.smarterp.purchase.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Child entity representing individual line items within a Purchase Voucher.
 * Uses direct foreign key UUID fields without Hibernate relation annotations.
 */
@Getter
@Setter
@Entity
@Table(name = "purchase_voucher_items")
public class PurchaseVoucherItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "purchase_voucher_id", nullable = false)
    private UUID purchaseVoucherId;

    @Column(name = "stock_item_id", nullable = false)
    private UUID stockItemId;

    @Column(name = "quantity", nullable = false)
    private BigDecimal quantity;

    @Column(name = "unit_price", nullable = false)
    private BigDecimal unitPrice;

    @Column(name = "amount", nullable = false)
    private BigDecimal amount;
}
