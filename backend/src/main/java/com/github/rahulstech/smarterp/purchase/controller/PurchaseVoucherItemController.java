package com.github.rahulstech.smarterp.purchase.controller;

import com.github.rahulstech.smarterp.purchase.dto.*;
import com.github.rahulstech.smarterp.purchase.service.PurchaseVoucherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for managing Purchase Voucher items.
 */
@RestController
@RequestMapping("/api/companies/{companyId}/purchase-vouchers/{voucherId}/items")
@RequiredArgsConstructor
public class PurchaseVoucherItemController {

    private final PurchaseVoucherService purchaseVoucherService;

    @PostMapping
    public ResponseEntity<@NonNull PurchaseVoucherResponse> createItems(
            @PathVariable("companyId") UUID companyId,
            @PathVariable("voucherId") UUID voucherId,
            @Valid @RequestBody PurchaseVoucherItemsRequest request) {
        PurchaseVoucherResponse response = purchaseVoucherService.createItems(companyId, voucherId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping
    public ResponseEntity<@NonNull PurchaseVoucherResponse> updateItems(
            @PathVariable("companyId") UUID companyId,
            @PathVariable("voucherId") UUID voucherId,
            @Valid @RequestBody PurchaseVoucherItemsRequest request) {
        PurchaseVoucherResponse response = purchaseVoucherService.updateItems(companyId, voucherId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<@NonNull List<PurchaseVoucherItemResponse>> getItems(
            @PathVariable("companyId") UUID companyId,
            @PathVariable("voucherId") UUID voucherId) {
        List<PurchaseVoucherItemResponse> response = purchaseVoucherService.getItems(companyId, voucherId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{itemId}")
    public ResponseEntity<@NonNull PurchaseVoucherItemResponse> getItem(
            @PathVariable("companyId") UUID companyId,
            @PathVariable("voucherId") UUID voucherId,
            @PathVariable("itemId") UUID itemId) {
        PurchaseVoucherItemResponse response = purchaseVoucherService.getItem(companyId, voucherId, itemId);
        return ResponseEntity.ok(response);
    }
}
