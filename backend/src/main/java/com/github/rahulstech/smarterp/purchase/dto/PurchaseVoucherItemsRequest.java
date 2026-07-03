package com.github.rahulstech.smarterp.purchase.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record PurchaseVoucherItemsRequest(
    @NotEmpty(message = "items are required")
    @Valid
    List<PurchaseVoucherItemRequest> items
) {}
