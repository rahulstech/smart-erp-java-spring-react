package com.github.rahulstech.smarterp.sale.service;

import com.github.rahulstech.smarterp.sale.dto.*;
import java.util.List;
import java.util.UUID;

public interface SaleVoucherService {

    SaleVoucherResponse create(UUID companyId, CreateSaleVoucherRequest request);

    SaleVoucherResponse update(UUID companyId, UUID voucherId, UpdateSaleVoucherRequest request);

    SaleVoucherResponse getById(UUID companyId, UUID voucherId);

    List<SaleVoucherResponse> getAll(UUID companyId);

    void delete(UUID companyId, UUID voucherId);
}
