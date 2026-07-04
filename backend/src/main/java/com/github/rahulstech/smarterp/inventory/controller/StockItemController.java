package com.github.rahulstech.smarterp.inventory.controller;

import com.github.rahulstech.smarterp.inventory.dto.CreateStockItemRequest;
import com.github.rahulstech.smarterp.inventory.dto.StockItemResponse;
import com.github.rahulstech.smarterp.inventory.dto.UpdateStockItemRequest;
import com.github.rahulstech.smarterp.inventory.service.StockItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/companies/{companyId}/stocks")
@RequiredArgsConstructor
public class StockItemController {

    private final StockItemService stockItemService;

    @PostMapping
    public ResponseEntity<@NonNull StockItemResponse> createStockItem(
            @PathVariable("companyId") UUID companyId,
            @Valid @RequestBody CreateStockItemRequest request) {
        StockItemResponse response = stockItemService.create(companyId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{itemId}")
    public StockItemResponse updateStockItem(
            @PathVariable("companyId") UUID companyId,
            @PathVariable("itemId") UUID itemId,
            @Valid @RequestBody UpdateStockItemRequest request) {
        return stockItemService.update(companyId, itemId, request);
    }

    @GetMapping("/{itemId}")
    public StockItemResponse getStockItem(
            @PathVariable("companyId") UUID companyId,
            @PathVariable("itemId") UUID itemId) {
        return stockItemService.getById(companyId, itemId);
    }

    @GetMapping
    public List<StockItemResponse> getStockItems(
            @PathVariable("companyId") UUID companyId) {
        return stockItemService.getAll(companyId);
    }

    @GetMapping("/search")
    public List<StockItemResponse> searchStockItems(
            @PathVariable("companyId") UUID companyId,
            @RequestParam("keyword") String keyword) {
        return stockItemService.search(companyId, keyword);
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<@NonNull Void> deleteStockItem(
            @PathVariable("companyId") UUID companyId,
            @PathVariable("itemId") UUID itemId) {
        stockItemService.delete(companyId, itemId);
        return ResponseEntity.noContent().build();
    }
}
