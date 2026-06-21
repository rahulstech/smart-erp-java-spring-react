package com.github.rahulstech.smarterp.company.repository;

import com.github.rahulstech.smarterp.company.model.CompanyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CompanyRepository extends JpaRepository<CompanyEntity, UUID> {

    List<CompanyEntity> findByOwnerId(String ownerId);

    Optional<CompanyEntity> findByIdAndOwnerId(UUID companyId, String ownerId);
}
