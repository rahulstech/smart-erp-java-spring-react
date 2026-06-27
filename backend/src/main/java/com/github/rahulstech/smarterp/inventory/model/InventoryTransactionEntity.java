package com.github.rahulstech.smarterp.inventory.model;

import com.github.rahulstech.smarterp.common.model.BaseEntity;
import com.github.rahulstech.smarterp.company.model.CompanyEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "inventory_transactions")
public class InventoryTransactionEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private CompanyEntity company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_item_id", nullable = false)
    private StockItemEntity stockItem;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false)
    private InventoryTransactionType transactionType;

    @Column(name = "reference_type")
    private String referenceType;

    @Column(name = "reference_id")
    private UUID referenceId;

    /**
     * <strong>NOTE</strong>: quantityChance can be +ve or -ve; but not zero.
     * +ve means stock increased; -ve means stock decreased
     */
    @Column(name = "quantity_change", nullable = false)
    private BigDecimal quantityChange;

    @Column(name = "quantity_before", nullable = false)
    private BigDecimal quantityBefore;

    @Column(name = "quantity_after", nullable = false)
    private BigDecimal quantityAfter;
}
