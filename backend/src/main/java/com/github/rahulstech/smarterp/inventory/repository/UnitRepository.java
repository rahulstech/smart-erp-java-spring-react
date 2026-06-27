package com.github.rahulstech.smarterp.inventory.repository;

import com.github.rahulstech.smarterp.inventory.model.UnitEntity;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UnitRepository extends JpaRepository<@NonNull UnitEntity, @NonNull UUID> {

    Optional<UnitEntity> findByIdAndCompanyId(UUID id, UUID companyId);

    List<UnitEntity> findByCompanyId(UUID companyId);

    boolean existsByCompanyIdAndNameIgnoreCase(UUID companyId, String name);

    boolean existsByCompanyIdAndSymbolIgnoreCase(UUID companyId, String symbol);
}
