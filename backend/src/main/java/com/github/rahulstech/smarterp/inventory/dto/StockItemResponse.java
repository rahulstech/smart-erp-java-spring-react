package com.github.rahulstech.smarterp.inventory.dto;

import lombok.Builder;
import java.math.BigDecimal;
import java.util.UUID;

@Builder
public record StockItemResponse(
        UUID id,
        UUID companyId,
        UUID categoryId,
        String categoryName,
        UUID unitId,
        String unitName,
        String unitSymbol,
        String itemCode,
        String itemName,
        BigDecimal currentQuantity
) {}
