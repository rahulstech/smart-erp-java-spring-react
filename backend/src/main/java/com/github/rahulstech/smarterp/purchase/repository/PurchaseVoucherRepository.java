package com.github.rahulstech.smarterp.purchase.repository;

import com.github.rahulstech.smarterp.purchase.model.PurchaseVoucherEntity;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for PurchaseVoucher aggregate root operations.
 */
@Repository
public interface PurchaseVoucherRepository extends JpaRepository<@NonNull PurchaseVoucherEntity, @NonNull UUID> {

    Optional<PurchaseVoucherEntity> findByIdAndCompanyId(UUID id, UUID companyId);

    List<PurchaseVoucherEntity> findByCompanyIdOrderByVoucherDateDesc(UUID companyId);

    boolean existsByCompanyIdAndVoucherNumber(UUID companyId, String voucherNumber);
}
