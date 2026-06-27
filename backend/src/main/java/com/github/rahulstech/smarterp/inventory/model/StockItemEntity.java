package com.github.rahulstech.smarterp.inventory.model;

import com.github.rahulstech.smarterp.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "stock_items", uniqueConstraints = {
    @UniqueConstraint(name = "uq_stock_items_company_sku", columnNames = {"company_id", "sku"})
}, indexes = {
    @Index(name = "idx_stock_items_company_name", columnList = "company_id, name")
})
public class StockItemEntity extends BaseEntity {

    @Column(name = "company_id", nullable = false, updatable = false)
    private UUID companyId;

    @Column(name = "category_id", nullable = false, updatable = false)
    private UUID categoryId;

    @Column(name = "unit_id", nullable = false, updatable = false)
    private UUID unitId;

    @Column(name = "sku", nullable = false, length = 100)
    private String itemCode;

    @Column(name = "name", nullable = false)
    private String itemName;

    @Column(name = "quantity", nullable = false)
    private BigDecimal currentQuantity = BigDecimal.ZERO;
}
