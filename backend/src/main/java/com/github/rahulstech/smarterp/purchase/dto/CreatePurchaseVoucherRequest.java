package com.github.rahulstech.smarterp.purchase.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public record CreatePurchaseVoucherRequest(
    @NotNull(message = "supplierId is required")
    UUID supplierId,

    @NotNull(message = "voucherDate is required")
    LocalDate voucherDate
) {}
