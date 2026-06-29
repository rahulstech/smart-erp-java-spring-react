package com.github.rahulstech.smarterp.sale.dto;

import lombok.Builder;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Builder
public record SaleVoucherResponse(
        UUID id,
        String voucherNumber,
        LocalDate voucherDate,
        UUID customerId,
        String customerName,
        BigDecimal grandTotal,
        boolean cancelled,
        List<SaleVoucherItemResponse> items
) {}
