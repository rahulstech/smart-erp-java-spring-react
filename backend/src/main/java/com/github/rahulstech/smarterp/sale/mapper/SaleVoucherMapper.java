package com.github.rahulstech.smarterp.sale.mapper;

import com.github.rahulstech.smarterp.sale.dto.*;
import com.github.rahulstech.smarterp.sale.model.SaleVoucherEntity;
import com.github.rahulstech.smarterp.sale.model.SaleVoucherItemEntity;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class SaleVoucherMapper {

    public SaleVoucherEntity toEntity(CreateSaleVoucherRequest request) {
        if (request == null) {
            return null;
        }
        SaleVoucherEntity entity = new SaleVoucherEntity();
        entity.setCustomerId(request.customerId());
        entity.setVoucherDate(request.voucherDate());
        return entity;
    }

    public SaleVoucherItemEntity toItemEntity(SaleVoucherItemRequest request) {
        if (request == null) {
            return null;
        }
        SaleVoucherItemEntity itemEntity = new SaleVoucherItemEntity();
        itemEntity.setStockItemId(request.itemId());
        itemEntity.setHsnCode(request.hsnCode());
        itemEntity.setQuantity(request.quantity());
        itemEntity.setRate(request.rate());
        return itemEntity;
    }

    public SaleVoucherResponse toResponse(SaleVoucherEntity entity, String customerName, List<SaleVoucherItemResponse> items) {
        if (entity == null) {
            return null;
        }
        return SaleVoucherResponse.builder()
                .id(entity.getId())
                .voucherNumber(entity.getVoucherNumber())
                .voucherDate(entity.getVoucherDate())
                .customerId(entity.getCustomerId())
                .customerName(customerName)
                .grandTotal(entity.getGrandTotal())
                .cancelled(entity.isCancelled())
                .items(items != null ? items : Collections.emptyList())
                .build();
    }

    public SaleVoucherItemResponse toItemResponse(SaleVoucherItemEntity entity, String unitName) {
        if (entity == null) {
            return null;
        }
        return SaleVoucherItemResponse.builder()
                .id(entity.getId())
                .itemId(entity.getStockItemId())
                .itemName(entity.getItemName())
                .hsnCode(entity.getHsnCode())
                .unitName(unitName)
                .quantity(entity.getQuantity())
                .rate(entity.getRate())
                .lineTotal(entity.getLineTotal())
                .build();
    }
}
