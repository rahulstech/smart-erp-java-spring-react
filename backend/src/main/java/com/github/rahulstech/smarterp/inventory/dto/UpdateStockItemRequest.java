package com.github.rahulstech.smarterp.inventory.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record UpdateStockItemRequest(
        @NotNull(message = "categoryId is required")
        UUID categoryId,

        @NotNull(message = "unitId is required")
        UUID unitId,

        @NotBlank(message = "itemName is required")
        String itemName
) {}
