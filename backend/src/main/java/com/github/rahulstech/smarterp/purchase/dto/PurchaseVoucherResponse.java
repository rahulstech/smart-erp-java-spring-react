package com.github.rahulstech.smarterp.purchase.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record PurchaseVoucherResponse(
    UUID id,
    String voucherNumber,
    LocalDate voucherDate,
    UUID supplierId,
    String supplierName,
    BigDecimal totalAmount,
    List<PurchaseVoucherItemResponse> items,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {}
