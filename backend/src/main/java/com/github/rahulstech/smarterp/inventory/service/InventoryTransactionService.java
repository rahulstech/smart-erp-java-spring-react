package com.github.rahulstech.smarterp.inventory.service;

import com.github.rahulstech.smarterp.inventory.dto.AdjustStockRequest;
import com.github.rahulstech.smarterp.inventory.dto.InventoryTransactionResponse;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
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

    void recordStockIn(UUID companyId, UUID referenceId, String referenceType, UUID stockItemId, BigDecimal quantity);

    void recordStockOut(UUID companyId, UUID referenceId, String referenceType, UUID stockItemId, BigDecimal quantity);

    void adjustStockForUpdate(UUID companyId, UUID referenceId, String referenceType, Map<UUID, BigDecimal> oldQuantities, Map<UUID, BigDecimal> newQuantities);
}
