package com.github.rahulstech.smarterp.supplier.dto;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Response record containing Supplier details.
 */
@Builder
public record SupplierResponse(
        UUID id,
        UUID companyId,
        String code,
        String name,
        String phone,
        String email,
        String gstNumber,
        String address,
        String city,
        String state,
        String pincode,
        String country,
        BigDecimal openingBalance,
        BigDecimal outstandingAmount
) {}
