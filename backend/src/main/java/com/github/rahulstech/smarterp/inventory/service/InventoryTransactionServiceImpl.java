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
import java.util.UUID;

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
        tx.setCompany(company);
        tx.setStockItem(stockItem);
        tx.setTransactionType(InventoryTransactionType.STOCK_ADJUSTMENT);
        tx.setQuantityChange(change);
        tx.setQuantityBefore(qtyBefore);
        tx.setQuantityAfter(qtyAfter);

        InventoryTransactionEntity savedTx = inventoryTransactionRepository.saveAndFlush(tx);

        // Update Stock Item's current quantity
        stockItem.setCurrentQuantity(qtyAfter);
        stockItemRepository.saveAndFlush(stockItem);

        return inventoryTransactionMapper.toResponse(savedTx);
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
                .map(inventoryTransactionMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryTransactionResponse> getAllTransactions(UUID companyId) {
        List<InventoryTransactionEntity> entities = inventoryTransactionRepository
                .findByCompanyIdOrderByCreatedAtDesc(companyId);

        return entities.stream()
                .map(inventoryTransactionMapper::toResponse)
                .toList();
    }
}
