package com.github.rahulstech.smarterp.sale.model;

import com.github.rahulstech.smarterp.common.model.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Child entity representing line items of a Sale Voucher.
 */
@Getter
@Setter
@Entity
@Table(name = "sale_voucher_items")
public class SaleVoucherItemEntity extends BaseEntity {

    @Column(name = "sale_voucher_id", nullable = false)
    private UUID saleVoucherId;

    @Column(name = "stock_item_id", nullable = false)
    private UUID stockItemId;

    @Column(name = "item_name")
    private String itemName;

    @Column(name = "hsn_code")
    private String hsnCode;

    @Column(name = "quantity", nullable = false)
    private BigDecimal quantity = BigDecimal.ZERO;

    @Column(name = "rate", nullable = false)
    private BigDecimal rate = BigDecimal.ZERO;

    @Column(name = "line_total", nullable = false)
    private BigDecimal lineTotal = BigDecimal.ZERO;
}
