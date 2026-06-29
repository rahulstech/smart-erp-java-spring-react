package com.github.rahulstech.smarterp.sale.dto;

import lombok.Builder;
import java.math.BigDecimal;
import java.util.UUID;

@Builder
public record SaleVoucherItemResponse(
        UUID id,
        UUID itemId,
        String itemName,
        String hsnCode,
        String unitName,
        BigDecimal quantity,
        BigDecimal rate,
        BigDecimal lineTotal
) {}
