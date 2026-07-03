package com.github.rahulstech.smarterp.sale.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

public record CreateSaleVoucherRequest(
        @NotNull(message = "voucherDate is required")
        LocalDate voucherDate,

        @NotNull(message = "customerId is required")
        UUID customerId
) {}
