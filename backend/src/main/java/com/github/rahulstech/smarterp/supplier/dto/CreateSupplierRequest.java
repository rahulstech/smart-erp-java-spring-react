package com.github.rahulstech.smarterp.supplier.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

import java.math.BigDecimal;

/**
 * Request record for creating a new Supplier.
 */
@Builder
public record CreateSupplierRequest(
        @NotBlank(message = "code is required")
        String code,

        @NotBlank(message = "name is required")
        String name,

        String phone,
        String email,
        String gstNumber,

        String address,
        String city,
        String state,
        String pincode,
        String country,

        BigDecimal openingBalance
) {}
