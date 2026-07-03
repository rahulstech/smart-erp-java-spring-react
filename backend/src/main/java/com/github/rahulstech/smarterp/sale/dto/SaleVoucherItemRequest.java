package com.github.rahulstech.smarterp.sale.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

public record SaleVoucherItemRequest(
        @NotNull(message = "itemId is required")
        UUID itemId,

        String hsnCode,

        @NotNull(message = "quantity is required")
        @DecimalMin(value = "0.0", message = "quantity must be greater than zero")
        BigDecimal quantity,

        @NotNull(message = "rate is required")
        @DecimalMin(value = "0.0", message = "rate cannot be negative")
        BigDecimal rate
) {}
