package com.github.rahulstech.smarterp.sale.repository;

import com.github.rahulstech.smarterp.sale.model.SaleVoucherItemEntity;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SaleVoucherItemRepository extends JpaRepository<@NonNull SaleVoucherItemEntity, @NonNull UUID> {

    List<SaleVoucherItemEntity> findBySaleVoucherId(UUID saleVoucherId);

    void deleteBySaleVoucherId(UUID saleVoucherId);
}
