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
 * REST controller for managing Purchase Vouchers within a company context.
 * Delegates execution strictly to PurchaseVoucherService.
 */
@CrossOrigin
@RestController
@RequestMapping("/api/companies/{companyId}/purchase-vouchers")
@RequiredArgsConstructor
public class PurchaseVoucherController {

    private final PurchaseVoucherService purchaseVoucherService;

    @PostMapping
    public ResponseEntity<@NonNull PurchaseVoucherResponse> create(
            @PathVariable("companyId") UUID companyId,
            @Valid @RequestBody CreatePurchaseVoucherRequest request) {
        PurchaseVoucherResponse response = purchaseVoucherService.create(companyId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{voucherId}")
    public ResponseEntity<@NonNull PurchaseVoucherResponse> update(
            @PathVariable("companyId") UUID companyId,
            @PathVariable("voucherId") UUID voucherId,
            @Valid @RequestBody UpdatePurchaseVoucherRequest request) {
        PurchaseVoucherResponse response = purchaseVoucherService.update(companyId, voucherId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{voucherId}")
    public ResponseEntity<@NonNull PurchaseVoucherResponse> getById(
            @PathVariable("companyId") UUID companyId,
            @PathVariable("voucherId") UUID voucherId) {
        PurchaseVoucherResponse response = purchaseVoucherService.getById(companyId, voucherId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<@NonNull List<PurchaseVoucherResponse>> getAll(
            @PathVariable("companyId") UUID companyId) {
        List<PurchaseVoucherResponse> response = purchaseVoucherService.getAll(companyId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{voucherId}")
    public ResponseEntity<@NonNull Void> delete(
            @PathVariable("companyId") UUID companyId,
            @PathVariable("voucherId") UUID voucherId) {
        purchaseVoucherService.delete(companyId, voucherId);
        return ResponseEntity.noContent().build();
    }
}
