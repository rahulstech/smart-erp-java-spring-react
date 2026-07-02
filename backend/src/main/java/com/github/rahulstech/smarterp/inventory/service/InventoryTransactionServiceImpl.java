package com.github.rahulstech.smarterp.inventory.service;

import com.github.rahulstech.smarterp.common.exception.HttpException;
import com.github.rahulstech.smarterp.company.model.CompanyEntity;
import com.github.rahulstech.smarterp.company.repository.CompanyRepository;
import com.github.rahulstech.smarterp.inventory.dto.AdjustStockRequest;
import com.github.rahulstech.smarterp.inventory.dto.InventoryTransactionResponse;
import com.github.rahulstech.smarterp.inventory.mapper.InventoryTransactionMapper;
import com.github.rahulstech.smarterp.inventory.model.InventoryTransactionEntity;
import com.github.rahulstech.smarterp.inventory.model.InventoryTransactionType;
import com.github.rahulstech.smarterp.inventory.model.StockItemEntity;
import com.github.rahulstech.smarterp.inventory.repository.InventoryTransactionRepository;
import com.github.rahulstech.smarterp.inventory.repository.StockItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryTransactionServiceImpl implements InventoryTransactionService {

    private final InventoryTransactionRepository inventoryTransactionRepository;
    private final InventoryTransactionMapper inventoryTransactionMapper;
    private final StockItemRepository stockItemRepository;
    private final CompanyRepository companyRepository;

    private BigDecimal scale(BigDecimal val) {
        if (val == null) {
            return null;
        }
        return val.setScale(2, RoundingMode.HALF_UP);
    }

    @Override
    @Transactional
    public InventoryTransactionResponse createAdjustmentTransaction(UUID companyId, UUID stockItemId, AdjustStockRequest request) {
        CompanyEntity company = companyRepository.findById(companyId)
                .orElseThrow(() -> HttpException.notFound("Company with id " + companyId + " not found"));

        StockItemEntity stockItem = stockItemRepository.findByIdAndCompanyId(stockItemId, companyId)
                .orElseThrow(() -> HttpException.notFound("Stock item with id " + stockItemId + " not found in current company"));

        BigDecimal qtyBefore = scale(stockItem.getCurrentQuantity());
        BigDecimal change = scale(request.quantity());
        BigDecimal qtyAfter = qtyBefore.add(change);

        if (qtyAfter.compareTo(BigDecimal.ZERO) < 0) {
            throw HttpException.badRequest("Adjustment would result in negative stock quantity");
        }

        InventoryTransactionEntity tx = new InventoryTransactionEntity();
        tx.setCompanyId(companyId);
        tx.setStockItemId(stockItemId);
        tx.setTransactionType(InventoryTransactionType.STOCK_ADJUSTMENT);
        tx.setQuantityChange(change);
        tx.setQuantityBefore(qtyBefore);
        tx.setQuantityAfter(qtyAfter);

        InventoryTransactionEntity savedTx = inventoryTransactionRepository.saveAndFlush(tx);

        // Update Stock Item's current quantity
        stockItem.setCurrentQuantity(qtyAfter);
        stockItemRepository.saveAndFlush(stockItem);

        return inventoryTransactionMapper.toResponse(savedTx, stockItem.getItemName(), stockItem.getItemCode());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryTransactionResponse> getItemTransactions(UUID companyId, UUID itemId) {
        // Enforce company boundary
        StockItemEntity stockItem = stockItemRepository.findByIdAndCompanyId(itemId, companyId)
                .orElseThrow(() -> HttpException.notFound("Stock item with id " + itemId + " not found in current company"));

        List<InventoryTransactionEntity> entities = inventoryTransactionRepository
                .findByCompanyIdAndStockItemIdOrderByCreatedAtDesc(companyId, itemId);

        return entities.stream()
                .map(entity -> inventoryTransactionMapper.toResponse(entity, stockItem.getItemName(), stockItem.getItemCode()))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryTransactionResponse> getAllTransactions(UUID companyId) {
        List<InventoryTransactionEntity> entities = inventoryTransactionRepository
                .findByCompanyIdOrderByCreatedAtDesc(companyId);

        List<StockItemEntity> stockItems = stockItemRepository.findByCompanyIdOrderByCreatedAtDesc(companyId);
        Map<UUID, StockItemEntity> stockItemMap = stockItems.stream()
                .collect(Collectors.toMap(StockItemEntity::getId, Function.identity()));

        return entities.stream()
                .map(entity -> {
                    StockItemEntity stockItem = stockItemMap.get(entity.getStockItemId());
                    String itemName = stockItem != null ? stockItem.getItemName() : null;
                    String itemCode = stockItem != null ? stockItem.getItemCode() : null;
                    return inventoryTransactionMapper.toResponse(entity, itemName, itemCode);
                })
                .toList();
     }

    @Override
    @Transactional
    public void recordStockIn(UUID companyId, UUID referenceId, String referenceType, UUID stockItemId, BigDecimal quantity) {
        StockItemEntity stockItem = stockItemRepository.findByIdAndCompanyId(stockItemId, companyId)
                .orElseThrow(() -> HttpException.notFound("Stock item not found for company: " + stockItemId));

        BigDecimal qtyBefore = stockItem.getCurrentQuantity() != null ? stockItem.getCurrentQuantity() : BigDecimal.ZERO;
        BigDecimal qtyAfter = qtyBefore.add(quantity);

        InventoryTransactionEntity tx = new InventoryTransactionEntity();
        tx.setCompanyId(companyId);
        tx.setStockItemId(stockItemId);
        tx.setTransactionType(InventoryTransactionType.STOCK_IN);
        tx.setReferenceType(referenceType);
        tx.setReferenceId(referenceId);
        tx.setQuantityChange(quantity);
        tx.setQuantityBefore(qtyBefore);
        tx.setQuantityAfter(qtyAfter);

        inventoryTransactionRepository.save(tx);

        stockItem.setCurrentQuantity(qtyAfter);
        stockItemRepository.save(stockItem);
    }

    @Override
    @Transactional
    public void recordStockOut(UUID companyId, UUID referenceId, String referenceType, UUID stockItemId, BigDecimal quantity) {
        StockItemEntity stockItem = stockItemRepository.findByIdAndCompanyId(stockItemId, companyId)
                .orElse(null);
        if (stockItem == null) return;

        BigDecimal qtyBefore = stockItem.getCurrentQuantity() != null ? stockItem.getCurrentQuantity() : BigDecimal.ZERO;
        BigDecimal qtyAfter = qtyBefore.subtract(quantity);

        InventoryTransactionEntity tx = new InventoryTransactionEntity();
        tx.setCompanyId(companyId);
        tx.setStockItemId(stockItemId);
        tx.setTransactionType(InventoryTransactionType.STOCK_OUT);
        tx.setReferenceType(referenceType);
        tx.setReferenceId(referenceId);
        tx.setQuantityChange(quantity.negate()); // -ve means stock decreased
        tx.setQuantityBefore(qtyBefore);
        tx.setQuantityAfter(qtyAfter);

        inventoryTransactionRepository.save(tx);

        stockItem.setCurrentQuantity(qtyAfter);
        stockItemRepository.save(stockItem);
    }

    @Override
    @Transactional
    public void adjustStockForUpdate(UUID companyId, UUID referenceId, String referenceType, Map<UUID, BigDecimal> oldQuantities, Map<UUID, BigDecimal> newQuantities) {
        java.util.Set<UUID> allStockItemIds = new java.util.HashSet<>();
        if (oldQuantities != null) {
            allStockItemIds.addAll(oldQuantities.keySet());
        }
        if (newQuantities != null) {
            allStockItemIds.addAll(newQuantities.keySet());
        }

        boolean isSale = "SALE_VOUCHER".equals(referenceType);

        for (UUID stockItemId : allStockItemIds) {
            BigDecimal oldQty = oldQuantities != null ? oldQuantities.getOrDefault(stockItemId, BigDecimal.ZERO) : BigDecimal.ZERO;
            BigDecimal newQty = newQuantities != null ? newQuantities.getOrDefault(stockItemId, BigDecimal.ZERO) : BigDecimal.ZERO;

            if (oldQty == null) oldQty = BigDecimal.ZERO;
            if (newQty == null) newQty = BigDecimal.ZERO;

            if (oldQty.compareTo(newQty) != 0) {
                StockItemEntity stockItem = stockItemRepository.findByIdAndCompanyId(stockItemId, companyId)
                        .orElseThrow(() -> HttpException.notFound("Stock item not found for company: " + stockItemId));

                BigDecimal qtyBefore = stockItem.getCurrentQuantity() != null ? stockItem.getCurrentQuantity() : BigDecimal.ZERO;
                
                BigDecimal qtyAfter;
                BigDecimal change;
                
                if (isSale) {
                    change = oldQty.subtract(newQty);
                    qtyAfter = qtyBefore.add(change);
                } else {
                    change = newQty.subtract(oldQty);
                    qtyAfter = qtyBefore.add(change);
                }

                InventoryTransactionEntity tx = new InventoryTransactionEntity();
                tx.setCompanyId(companyId);
                tx.setStockItemId(stockItemId);

                if (isSale) {
                    if (oldQuantities == null || !oldQuantities.containsKey(stockItemId)) {
                        tx.setTransactionType(InventoryTransactionType.STOCK_OUT);
                        tx.setQuantityChange(newQty.negate());
                    } else {
                        tx.setTransactionType(InventoryTransactionType.STOCK_ADJUSTMENT);
                        tx.setQuantityChange(change);
                    }
                } else {
                    if (oldQuantities == null || !oldQuantities.containsKey(stockItemId)) {
                        tx.setTransactionType(InventoryTransactionType.STOCK_IN);
                        tx.setQuantityChange(newQty);
                    } else {
                        tx.setTransactionType(InventoryTransactionType.STOCK_ADJUSTMENT);
                        tx.setQuantityChange(change);
                    }
                }

                tx.setReferenceType(referenceType);
                tx.setReferenceId(referenceId);
                tx.setQuantityBefore(qtyBefore);
                tx.setQuantityAfter(qtyAfter);

                inventoryTransactionRepository.save(tx);

                stockItem.setCurrentQuantity(qtyAfter);
                stockItemRepository.save(stockItem);
            }
        }
    }
}
