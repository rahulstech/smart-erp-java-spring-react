package com.github.rahulstech.smarterp.inventory.controller;

import com.github.rahulstech.smarterp.inventory.dto.AdjustStockRequest;
import com.github.rahulstech.smarterp.inventory.dto.InventoryTransactionResponse;
import com.github.rahulstech.smarterp.inventory.service.InventoryTransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin
@RestController
@RequestMapping("/api/companies/{companyId}/stocks/{stockId}/transactions")
@RequiredArgsConstructor
public class InventoryTransactionController {

    private final InventoryTransactionService inventoryTransactionService;

    @PostMapping
    public ResponseEntity<@NonNull InventoryTransactionResponse> createTransaction(
            @PathVariable("companyId") UUID companyId,
            @PathVariable("stockId") UUID stockId,
            @Valid @RequestBody AdjustStockRequest request) {
        InventoryTransactionResponse response = inventoryTransactionService.createAdjustmentTransaction(companyId, stockId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public List<InventoryTransactionResponse> getItemTransactions(
            @PathVariable("companyId") UUID companyId,
            @PathVariable("stockId") UUID stockId) {
        return inventoryTransactionService.getItemTransactions(companyId, stockId);
    }
}
