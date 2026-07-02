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

    public InventoryTransactionResponse toResponse(InventoryTransactionEntity entity, String itemName, String itemCode) {
        if (entity == null) {
            return null;
        }
        return InventoryTransactionResponse.builder()
                .id(entity.getId())
                .companyId(entity.getCompanyId())
                .stockItemId(entity.getStockItemId())
                .stockItemName(itemName)
                .stockItemCode(itemCode)
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
