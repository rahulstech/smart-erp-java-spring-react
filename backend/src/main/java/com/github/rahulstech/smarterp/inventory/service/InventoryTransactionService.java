package com.github.rahulstech.smarterp.inventory.service;

import com.github.rahulstech.smarterp.inventory.dto.AdjustStockRequest;
import com.github.rahulstech.smarterp.inventory.dto.InventoryTransactionResponse;
import java.util.List;
import java.util.UUID;

public interface InventoryTransactionService {

    InventoryTransactionResponse createAdjustmentTransaction(
        UUID companyId,
        UUID stockItemId,
        AdjustStockRequest request
    );

    List<InventoryTransactionResponse> getItemTransactions(
        UUID companyId,
        UUID itemId
    );

    List<InventoryTransactionResponse> getAllTransactions(
        UUID companyId
    );
}
