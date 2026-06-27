package com.github.rahulstech.smarterp.inventory.dto;

import lombok.Builder;
import java.util.UUID;

@Builder
public record CategoryResponse(
        UUID id,
        UUID companyId,
        String name
) {}
