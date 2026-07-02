package com.github.rahulstech.smarterp.purchase.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record UpdatePurchaseVoucherRequest(
    @NotNull(message = "supplierId is required")
    UUID supplierId,

    @NotNull(message = "voucherDate is required")
    LocalDate voucherDate,
    
    @NotEmpty(message = "items are required")
    @Valid
    List<PurchaseVoucherItemRequest> items
) {}
