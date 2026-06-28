package com.github.rahulstech.smarterp.purchase.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record PurchaseVoucherItemResponse(
    UUID stockItemId,
    String stockItemName,
    BigDecimal quantity,
    BigDecimal unitPrice,
    BigDecimal amount
) {}
