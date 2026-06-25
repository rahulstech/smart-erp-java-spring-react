package com.github.rahulstech.smarterp.customer.dto;

import lombok.Builder;
import java.math.BigDecimal;
import java.util.UUID;

@Builder
public record CustomerResponse(
        UUID id,
        String name,
        String phone,
        String email,
        BigDecimal currentBalance,
        String city,
        String state
) {}
