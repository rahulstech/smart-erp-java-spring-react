package com.github.rahulstech.smarterp.inventory.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateUnitItemRequest(
        @NotBlank(message = "name is required")
        String name,

        @NotBlank(message = "symbol is required")
        String symbol
) {}
