package com.github.rahulstech.smarterp.inventory.mapper;

import com.github.rahulstech.smarterp.inventory.dto.CreateStockItemRequest;
import com.github.rahulstech.smarterp.inventory.dto.StockItemResponse;
import com.github.rahulstech.smarterp.inventory.model.StockItemEntity;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class StockItemMapper {

    private BigDecimal scale(BigDecimal val) {
        if (val == null) {
            return null;
        }
        return val.setScale(2, RoundingMode.HALF_UP);
    }

    public StockItemEntity toEntity(CreateStockItemRequest request) {
        if (request == null) {
            return null;
        }
        StockItemEntity entity = new StockItemEntity();
        entity.setCategoryId(request.categoryId());
        entity.setUnitId(request.unitId());
        entity.setItemCode(request.itemCode());
        entity.setItemName(request.itemName());
        entity.setCurrentQuantity(BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP));
        return entity;
    }

    public StockItemResponse toResponse(StockItemEntity entity, String categoryName, String unitName, String unitSymbol) {
        if (entity == null) {
            return null;
        }
        return StockItemResponse.builder()
                .id(entity.getId())
                .companyId(entity.getCompanyId())
                .categoryId(entity.getCategoryId())
                .categoryName(categoryName)
                .unitId(entity.getUnitId())
                .unitName(unitName)
                .unitSymbol(unitSymbol)
                .itemCode(entity.getItemCode())
                .itemName(entity.getItemName())
                .currentQuantity(scale(entity.getCurrentQuantity()))
                .build();
    }
}
