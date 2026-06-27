package com.github.rahulstech.smarterp.supplier.controller;

import com.github.rahulstech.smarterp.supplier.dto.CreateSupplierRequest;
import com.github.rahulstech.smarterp.supplier.dto.SupplierResponse;
import com.github.rahulstech.smarterp.supplier.dto.UpdateSupplierRequest;
import com.github.rahulstech.smarterp.supplier.service.SupplierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for managing Supplier master records within a company context.
 * Enforces validation and routes commands to SupplierService.
 */
@CrossOrigin
@RestController
@RequestMapping("/api/companies/{companyId}/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    /**
     * Registers a new supplier in the company directory.
     */
    @PostMapping
    public ResponseEntity<@NonNull SupplierResponse> create(
            @PathVariable("companyId") UUID companyId,
            @Valid @RequestBody CreateSupplierRequest request) {
        SupplierResponse response = supplierService.create(companyId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Updates an existing supplier's details.
     */
    @PutMapping("/{supplierId}")
    public SupplierResponse update(
            @PathVariable("companyId") UUID companyId,
            @PathVariable("supplierId") UUID supplierId,
            @Valid @RequestBody UpdateSupplierRequest request) {
        return supplierService.update(companyId, supplierId, request);
    }

    /**
     * Retrieves details for a specific supplier by ID.
     */
    @GetMapping("/{supplierId}")
    public SupplierResponse getById(
            @PathVariable("companyId") UUID companyId,
            @PathVariable("supplierId") UUID supplierId) {
        return supplierService.getById(companyId, supplierId);
    }

    /**
     * Retrieves all suppliers associated with the specified company.
     */
    @GetMapping
    public List<SupplierResponse> getAll(
            @PathVariable("companyId") UUID companyId) {
        return supplierService.getAll(companyId);
    }

    /**
     * Searches for suppliers in the specified company whose names contain the given keyword.
     */
    @GetMapping("/search")
    public List<SupplierResponse> search(
            @PathVariable("companyId") UUID companyId,
            @RequestParam("keyword") String keyword) {
        return supplierService.search(companyId, keyword);
    }

    /**
     * Deletes a supplier by ID.
     */
    @DeleteMapping("/{supplierId}")
    public ResponseEntity<@NonNull Void> delete(
            @PathVariable("companyId") UUID companyId,
            @PathVariable("supplierId") UUID supplierId) {
        supplierService.delete(companyId, supplierId);
        return ResponseEntity.noContent().build();
    }
}
