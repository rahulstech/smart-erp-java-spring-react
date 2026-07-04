package com.github.rahulstech.smarterp.sale.controller;

import com.github.rahulstech.smarterp.sale.dto.*;
import com.github.rahulstech.smarterp.sale.service.SaleVoucherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for managing Sale Voucher items.
 */
@RestController
@RequestMapping("/api/companies/{companyId}/sale-vouchers/{voucherId}/items")
@RequiredArgsConstructor
public class SaleVoucherItemController {

    private final SaleVoucherService saleVoucherService;

    @PostMapping
    public ResponseEntity<@NonNull SaleVoucherResponse> createItems(
            @PathVariable("companyId") UUID companyId,
            @PathVariable("voucherId") UUID voucherId,
            @Valid @RequestBody SaleVoucherItemsRequest request) {
        SaleVoucherResponse response = saleVoucherService.createItems(companyId, voucherId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping
    public SaleVoucherResponse updateItems(
            @PathVariable("companyId") UUID companyId,
            @PathVariable("voucherId") UUID voucherId,
            @Valid @RequestBody SaleVoucherItemsRequest request) {
        return saleVoucherService.updateItems(companyId, voucherId, request);
    }

    @GetMapping
    public List<SaleVoucherItemResponse> getItems(
            @PathVariable("companyId") UUID companyId,
            @PathVariable("voucherId") UUID voucherId) {
        return saleVoucherService.getItems(companyId, voucherId);
    }

    @GetMapping("/{itemId}")
    public SaleVoucherItemResponse getItem(
            @PathVariable("companyId") UUID companyId,
            @PathVariable("voucherId") UUID voucherId,
            @PathVariable("itemId") UUID itemId) {
        return saleVoucherService.getItem(companyId, voucherId, itemId);
    }
}
