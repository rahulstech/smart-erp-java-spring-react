package com.github.rahulstech.smarterp.sale.mapper;

import com.github.rahulstech.smarterp.sale.dto.*;
import com.github.rahulstech.smarterp.sale.model.SaleVoucher;
import com.github.rahulstech.smarterp.sale.model.SaleVoucherItem;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class SaleVoucherMapper {

    public SaleVoucher toEntity(CreateSaleVoucherRequest request) {
        if (request == null) {
            return null;
        }
        SaleVoucher entity = new SaleVoucher();
        entity.setCustomerId(request.customerId());
        entity.setVoucherDate(request.voucherDate());
        return entity;
    }

    public SaleVoucherItem toItemEntity(SaleVoucherItemRequest request) {
        if (request == null) {
            return null;
        }
        SaleVoucherItem itemEntity = new SaleVoucherItem();
        itemEntity.setStockItemId(request.itemId());
        itemEntity.setQuantity(request.quantity());
        itemEntity.setRate(request.rate());
        return itemEntity;
    }

    public SaleVoucherResponse toResponse(SaleVoucher entity, List<SaleVoucherItemResponse> items) {
        if (entity == null) {
            return null;
        }
        return SaleVoucherResponse.builder()
                .id(entity.getId())
                .voucherNumber(entity.getVoucherNumber())
                .voucherDate(entity.getVoucherDate())
                .customerId(entity.getCustomerId())
                .customerName(entity.getCustomerName())
                .grandTotal(entity.getGrandTotal())
                .cancelled(entity.isCancelled())
                .items(items != null ? items : Collections.emptyList())
                .build();
    }

    public SaleVoucherItemResponse toItemResponse(SaleVoucherItem entity) {
        if (entity == null) {
            return null;
        }
        return SaleVoucherItemResponse.builder()
                .id(entity.getId())
                .itemId(entity.getStockItemId())
                .itemName(entity.getItemName())
                .hsnCode(entity.getHsnCode())
                .unitName(entity.getUnitName())
                .quantity(entity.getQuantity())
                .rate(entity.getRate())
                .lineTotal(entity.getLineTotal())
                .build();
    }
}
