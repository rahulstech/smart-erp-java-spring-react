package com.github.rahulstech.smarterp.purchase.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

public record PurchaseVoucherItemRequest(
    @NotNull(message = "stockItemId is required")
    UUID stockItemId,

    @NotNull(message = "quantity is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "quantity must be greater than zero")
    BigDecimal quantity,

    @NotNull(message = "unitPrice is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "unitPrice cannot be negative")
    BigDecimal unitPrice
) {}
