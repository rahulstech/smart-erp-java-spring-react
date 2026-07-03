package com.github.rahulstech.smarterp.sale.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record SaleVoucherItemsRequest(
    @NotEmpty(message = "item list cannot be empty")
    @Valid
    List<SaleVoucherItemRequest> items
) {}
