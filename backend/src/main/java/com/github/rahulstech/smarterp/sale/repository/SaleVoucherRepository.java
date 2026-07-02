package com.github.rahulstech.smarterp.sale.repository;

import com.github.rahulstech.smarterp.sale.model.SaleVoucherEntity;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SaleVoucherRepository extends JpaRepository<@NonNull SaleVoucherEntity, @NonNull UUID> {

    List<SaleVoucherEntity> findByCompanyIdOrderByVoucherDateDesc(UUID companyId);

    Optional<SaleVoucherEntity> findByCompanyIdAndId(UUID companyId, UUID id);

    Optional<SaleVoucherEntity> findByIdAndCompanyId(UUID id, UUID companyId);

    boolean existsByCompanyIdAndVoucherNumber(UUID companyId, String voucherNumber);

    Optional<SaleVoucherEntity> findTopByCompanyIdOrderByCreatedAtDesc(UUID companyId);
}
