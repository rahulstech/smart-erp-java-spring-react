package com.github.rahulstech.smarterp.sale.repository;

import com.github.rahulstech.smarterp.sale.model.SaleVoucher;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SaleVoucherRepository extends JpaRepository<@NonNull SaleVoucher, @NonNull UUID> {

    List<SaleVoucher> findByCompanyIdOrderByVoucherDateDesc(UUID companyId);

    Optional<SaleVoucher> findByCompanyIdAndId(UUID companyId, UUID id);

    Optional<SaleVoucher> findByIdAndCompanyId(UUID id, UUID companyId);

    boolean existsByCompanyIdAndVoucherNumber(UUID companyId, String voucherNumber);

    Optional<SaleVoucher> findTopByCompanyIdOrderByCreatedAtDesc(UUID companyId);
}
