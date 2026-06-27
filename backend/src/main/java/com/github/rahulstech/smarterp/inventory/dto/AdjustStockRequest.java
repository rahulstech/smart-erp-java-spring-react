package com.github.rahulstech.smarterp.inventory.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record AdjustStockRequest(
        // InventoryTransaction type STOCK_ADJUSTMENT does not need referenceType and referenceId
        // because it not is due to purchase or sell

        // quantity must not 0; but can be +ve or -ve. see InventoryTransactionEntity.quantityChange
        @NotNull(message = "quantity is required")
        BigDecimal quantity
) {

    @AssertTrue(message = "quantity must not be 0 for stock adjustment")
    public boolean isValidQuantity() {
        // null check is unnecessary because it is confirmed before this check
        return quantity.compareTo(BigDecimal.ZERO) != 0;
    }
}
