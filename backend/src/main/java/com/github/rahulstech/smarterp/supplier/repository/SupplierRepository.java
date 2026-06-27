package com.github.rahulstech.smarterp.supplier.repository;

import com.github.rahulstech.smarterp.supplier.model.SupplierEntity;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for managing Supplier database operations.
 */
@Repository
public interface SupplierRepository extends JpaRepository<@NonNull SupplierEntity, @NonNull UUID> {

    /**
     * Finds a supplier by ID and company ID. Enforces company boundary.
     */
    Optional<SupplierEntity> findByIdAndCompanyId(UUID supplierId, UUID companyId);

    /**
     * Checks if a supplier code already exists within a specific company (case-insensitive).
     */
    boolean existsByCompanyIdAndSupplierCodeIgnoreCase(UUID companyId, String supplierCode);

    /**
     * Searches for suppliers in a company whose names start with the prefix (case-insensitive), ordered by createdAt desc.
     */
    List<SupplierEntity> findByCompanyIdAndNameStartingWithIgnoreCaseOrderByCreatedAtDesc(UUID companyId, String prefix);

    /**
     * Lists all suppliers for a company, ordered by createdAt desc.
     */
    List<SupplierEntity> findByCompanyIdOrderByCreatedAtDesc(UUID companyId);
}
