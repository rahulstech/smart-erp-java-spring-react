package com.github.rahulstech.smarterp.inventory.dto;

import lombok.Builder;
import java.util.UUID;

@Builder
public record UnitResponse(
        UUID id,
        UUID companyId,
        String name,
        String symbol
) {}
