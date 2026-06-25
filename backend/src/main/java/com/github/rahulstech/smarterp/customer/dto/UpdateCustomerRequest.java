package com.github.rahulstech.smarterp.customer.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import java.math.BigDecimal;

@Builder
public record UpdateCustomerRequest(
        @NotBlank(message = "name is required")
        String name,

        @NotBlank(message = "phone is required")
        String phone,

        @NotBlank(message = "email is required")
        @Email(message = "invalid email format")
        String email,

        @NotBlank(message = "address is required")
        String address,

        @NotBlank(message = "city is required")
        String city,

        @NotBlank(message = "state is required")
        String state,

        @NotBlank(message = "pincode is required")
        String pincode,

        @NotBlank(message = "country is required")
        String country,

        @NotNull(message = "openingBalance is required")
        BigDecimal openingBalance
) {}
