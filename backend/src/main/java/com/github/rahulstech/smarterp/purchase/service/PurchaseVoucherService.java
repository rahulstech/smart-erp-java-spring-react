package com.github.rahulstech.smarterp.purchase.service;

import com.github.rahulstech.smarterp.purchase.dto.*;

import java.util.List;
import java.util.UUID;

/**
 * Service interface for managing Purchase Voucher aggregate roots.
 */
public interface PurchaseVoucherService {

    PurchaseVoucherResponse create(UUID companyId, CreatePurchaseVoucherRequest request);

    PurchaseVoucherResponse update(UUID companyId, UUID voucherId, UpdatePurchaseVoucherRequest request);

    PurchaseVoucherResponse getById(UUID companyId, UUID voucherId);

    List<PurchaseVoucherResponse> getAll(UUID companyId);

    void delete(UUID companyId, UUID voucherId);

    PurchaseVoucherResponse addItem(UUID companyId, UUID voucherId, PurchaseVoucherItemRequest request);
}
