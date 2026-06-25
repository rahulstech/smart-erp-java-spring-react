package com.github.rahulstech.smarterp.company.dto;

import lombok.Builder;
import java.time.OffsetDateTime;
import java.util.UUID;

@Builder
public record CompanyResponse(
        UUID id,
        String name,
        String phone,
        String email,
        String address,
        String city,
        String state,
        String pincode,
        String country,
        String gstNumber,
        OffsetDateTime createdAt
) {}
