package com.github.rahulstech.smarterp.purchase.mapper;

import com.github.rahulstech.smarterp.purchase.dto.*;
import com.github.rahulstech.smarterp.purchase.model.PurchaseVoucherEntity;
import com.github.rahulstech.smarterp.purchase.model.PurchaseVoucherItemEntity;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

/**
 * Maps Purchase Voucher components between database entities and DTO records using direct UUID references.
 */
@Component
public class PurchaseVoucherMapper {

    public PurchaseVoucherEntity toEntity(CreatePurchaseVoucherRequest request) {
        if (request == null) {
            return null;
        }
        PurchaseVoucherEntity entity = new PurchaseVoucherEntity();
        entity.setSupplierId(request.supplierId());
        entity.setVoucherDate(request.voucherDate());
        entity.setRemarks(request.remarks());
        return entity;
    }

    public PurchaseVoucherItemEntity toItemEntity(PurchaseVoucherItemRequest request) {
        if (request == null) {
            return null;
        }
        PurchaseVoucherItemEntity itemEntity = new PurchaseVoucherItemEntity();
        itemEntity.setStockItemId(request.stockItemId());
        itemEntity.setQuantity(request.quantity());
        itemEntity.setUnitPrice(request.unitPrice());
        return itemEntity;
    }

    public PurchaseVoucherResponse toResponse(PurchaseVoucherEntity entity, String supplierName, List<PurchaseVoucherItemResponse> items) {
        if (entity == null) {
            return null;
        }
        return new PurchaseVoucherResponse(
                entity.getId(),
                entity.getVoucherNumber(),
                entity.getVoucherDate(),
                entity.getSupplierId(),
                supplierName,
                entity.getTotalAmount(),
                entity.getRemarks(),
                items != null ? items : Collections.emptyList(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }

    public PurchaseVoucherItemResponse toItemResponse(PurchaseVoucherItemEntity entity, String stockItemName) {
        if (entity == null) {
            return null;
        }
        return new PurchaseVoucherItemResponse(
                entity.getStockItemId(),
                stockItemName,
                entity.getQuantity(),
                entity.getUnitPrice(),
                entity.getAmount()
        );
    }
}
