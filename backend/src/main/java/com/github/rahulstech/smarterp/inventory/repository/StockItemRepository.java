package com.github.rahulstech.smarterp.inventory.repository;

import com.github.rahulstech.smarterp.inventory.model.StockItemEntity;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StockItemRepository extends JpaRepository<@NonNull StockItemEntity, @NonNull UUID> {

    Optional<StockItemEntity> findByIdAndCompanyId(UUID id, UUID companyId);

    boolean existsByCompanyIdAndItemCodeIgnoreCase(UUID companyId, String itemCode);

    List<StockItemEntity> findByCompanyIdOrderByCreatedAtDesc(UUID companyId);

    List<StockItemEntity> findByCompanyIdAndItemNameStartingWithIgnoreCaseOrderByCreatedAtDesc(UUID companyId, String prefix);
}
