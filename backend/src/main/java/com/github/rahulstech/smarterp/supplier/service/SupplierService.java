package com.github.rahulstech.smarterp.supplier.service;

import com.github.rahulstech.smarterp.supplier.dto.CreateSupplierRequest;
import com.github.rahulstech.smarterp.supplier.dto.SupplierResponse;
import com.github.rahulstech.smarterp.supplier.dto.UpdateSupplierRequest;

import java.util.List;
import java.util.UUID;

/**
 * Service interface defining business operations for Supplier entities.
 */
public interface SupplierService {

    /**
     * Creates a new supplier within the scope of the given company.
     */
    SupplierResponse create(UUID companyId, CreateSupplierRequest request);

    /**
     * Updates an existing supplier. Enforces company boundary.
     */
    SupplierResponse update(UUID companyId, UUID supplierId, UpdateSupplierRequest request);

    /**
     * Retrieves a supplier by ID and company ID.
     */
    SupplierResponse getById(UUID companyId, UUID supplierId);

    /**
     * Retrieves all suppliers for the specified company.
     */
    List<SupplierResponse> getAll(UUID companyId);

    /**
     * Searches for suppliers by name containing keyword.
     */
    List<SupplierResponse> search(UUID companyId, String keyword);

    /**
     * Deletes a supplier by ID and company ID.
     */
    void delete(UUID companyId, UUID supplierId);
}
