package com.github.rahulstech.smarterp.sale.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record UpdateSaleVoucherRequest(
        @NotNull(message = "voucherDate is required")
        LocalDate voucherDate,

        @NotNull(message = "customerId is required")
        UUID customerId,

        @NotEmpty(message = "item list cannot be empty")
        @Valid
        List<SaleVoucherItemRequest> items
) {}
