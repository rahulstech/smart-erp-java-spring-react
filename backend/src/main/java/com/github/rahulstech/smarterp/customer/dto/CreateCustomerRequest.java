package com.github.rahulstech.smarterp.customer.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import java.math.BigDecimal;

@Builder
public record CreateCustomerRequest(
        @NotBlank(message = "name is required")
        String name,

        @NotBlank(message = "phone is required")
        String phone,

        @Email(message = "invalid email format")
        String email,

        String address,
        String city,
        String state,
        String pincode,
        String country,

        @NotNull(message = "openingBalance is required")
        BigDecimal openingBalance
) {}
