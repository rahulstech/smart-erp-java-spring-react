package com.github.rahulstech.smarterp.inventory.repository;

import com.github.rahulstech.smarterp.inventory.model.CategoryEntity;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<@NonNull CategoryEntity, @NonNull UUID> {

    Optional<CategoryEntity> findByIdAndCompanyId(UUID id, UUID companyId);

    List<CategoryEntity> findByCompanyId(UUID companyId);

    boolean existsByCompanyIdAndNameIgnoreCase(UUID companyId, String name);
}
