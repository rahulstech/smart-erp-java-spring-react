package com.github.rahulstech.smarterp.inventory.repository;

import com.github.rahulstech.smarterp.inventory.model.InventoryTransactionEntity;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InventoryTransactionRepository extends JpaRepository<@NonNull InventoryTransactionEntity, @NonNull UUID> {

    List<InventoryTransactionEntity> findByCompanyIdAndStockItemIdOrderByCreatedAtDesc(UUID companyId, UUID stockItemId);

    List<InventoryTransactionEntity> findByCompanyIdOrderByCreatedAtDesc(UUID companyId);
}
