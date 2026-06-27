package com.github.rahulstech.smarterp.inventory.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateCategoryRequest(
        @NotBlank(message = "name is required")
        String name
) {}
