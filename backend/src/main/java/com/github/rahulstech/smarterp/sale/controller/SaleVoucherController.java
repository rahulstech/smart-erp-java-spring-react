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
 * REST Controller providing endpoints for managing Sale Vouchers.
 */
@CrossOrigin
@RestController
@RequestMapping("/api/companies/{companyId}/sale-vouchers")
@RequiredArgsConstructor
public class SaleVoucherController {

    private final SaleVoucherService saleVoucherService;

    @PostMapping
    public ResponseEntity<@NonNull SaleVoucherResponse> create(
            @PathVariable("companyId") UUID companyId,
            @Valid @RequestBody CreateSaleVoucherRequest request) {
        SaleVoucherResponse response = saleVoucherService.create(companyId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{voucherId}")
    public SaleVoucherResponse update(
            @PathVariable("companyId") UUID companyId,
            @PathVariable("voucherId") UUID voucherId,
            @Valid @RequestBody UpdateSaleVoucherRequest request) {
        return saleVoucherService.update(companyId, voucherId, request);
    }

    @GetMapping("/{voucherId}")
    public SaleVoucherResponse getById(
            @PathVariable("companyId") UUID companyId,
            @PathVariable("voucherId") UUID voucherId) {
        return saleVoucherService.getById(companyId, voucherId);
    }

    @GetMapping
    public List<SaleVoucherResponse> getAll(
            @PathVariable("companyId") UUID companyId) {
        return saleVoucherService.getAll(companyId);
    }

    @DeleteMapping("/{voucherId}")
    public ResponseEntity<@NonNull Void> delete(
            @PathVariable("companyId") UUID companyId,
            @PathVariable("voucherId") UUID voucherId) {
        saleVoucherService.delete(companyId, voucherId);
        return ResponseEntity.noContent().build();
    }
}
