package com.github.rahulstech.smarterp.inventory.dto;

import com.github.rahulstech.smarterp.inventory.model.InventoryTransactionType;
import lombok.Builder;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Builder
public record InventoryTransactionResponse(
        UUID id,
        UUID companyId,
        UUID stockItemId,
        String stockItemName,
        String stockItemCode,
        InventoryTransactionType transactionType,
        String referenceType,
        UUID referenceId,
        BigDecimal quantityChange,
        BigDecimal quantityBefore,
        BigDecimal quantityAfter,
        OffsetDateTime createdAt
) {}
