package com.github.rahulstech.smarterp.supplier.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

/**
 * Request record for updating an existing Supplier.
 */
@Builder
public record UpdateSupplierRequest(
        @NotBlank(message = "name is required")
        String name,

        String phone,
        String email,
        String gstNumber,

        String address,
        String city,
        String state,
        String pincode,
        String country
) {}
