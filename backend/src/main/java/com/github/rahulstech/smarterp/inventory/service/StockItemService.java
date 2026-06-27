package com.github.rahulstech.smarterp.inventory.service;

import com.github.rahulstech.smarterp.inventory.dto.CreateStockItemRequest;
import com.github.rahulstech.smarterp.inventory.dto.StockItemResponse;
import com.github.rahulstech.smarterp.inventory.dto.UpdateStockItemRequest;
import java.util.List;
import java.util.UUID;

public interface StockItemService {

    StockItemResponse create(
        UUID companyId,
        CreateStockItemRequest request
    );

    StockItemResponse update(
        UUID companyId,
        UUID itemId,
        UpdateStockItemRequest request
    );

    StockItemResponse getById(
        UUID companyId,
        UUID itemId
    );

    List<StockItemResponse> getAll(
        UUID companyId
    );

    List<StockItemResponse> search(
        UUID companyId,
        String keyword
    );

    void delete(
        UUID companyId,
        UUID itemId
    );
}
