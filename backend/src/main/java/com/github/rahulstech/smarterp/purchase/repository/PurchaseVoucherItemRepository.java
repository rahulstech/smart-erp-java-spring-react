package com.github.rahulstech.smarterp.purchase.repository;

import com.github.rahulstech.smarterp.purchase.model.PurchaseVoucherItemEntity;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository interface for PurchaseVoucherItem child operations.
 */
@Repository
public interface PurchaseVoucherItemRepository extends JpaRepository<@NonNull PurchaseVoucherItemEntity, @NonNull UUID> {

    List<PurchaseVoucherItemEntity> findByPurchaseVoucherId(UUID purchaseVoucherId);

    void deleteByPurchaseVoucherId(UUID purchaseVoucherId);
}
