package com.github.rahulstech.smarterp.inventory.mapper;

import com.github.rahulstech.smarterp.inventory.dto.InventoryTransactionResponse;
import com.github.rahulstech.smarterp.inventory.model.InventoryTransactionEntity;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class InventoryTransactionMapper {

    private BigDecimal scale(BigDecimal val) {
        if (val == null) {
            return null;
        }
        return val.setScale(2, RoundingMode.HALF_UP);
    }

    public InventoryTransactionResponse toResponse(InventoryTransactionEntity entity) {
        if (entity == null) {
            return null;
        }
        return InventoryTransactionResponse.builder()
                .id(entity.getId())
                .companyId(entity.getCompany() != null ? entity.getCompany().getId() : null)
                .stockItemId(entity.getStockItem() != null ? entity.getStockItem().getId() : null)
                .stockItemName(entity.getStockItem() != null ? entity.getStockItem().getItemName() : null)
                .stockItemCode(entity.getStockItem() != null ? entity.getStockItem().getItemCode() : null)
                .transactionType(entity.getTransactionType())
                .referenceType(entity.getReferenceType())
                .referenceId(entity.getReferenceId())
                .quantityChange(scale(entity.getQuantityChange()))
                .quantityBefore(scale(entity.getQuantityBefore()))
                .quantityAfter(scale(entity.getQuantityAfter()))
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
