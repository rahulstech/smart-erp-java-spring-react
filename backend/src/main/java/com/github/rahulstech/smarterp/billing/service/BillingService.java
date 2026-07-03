package com.github.rahulstech.smarterp.billing.service;

import java.util.UUID;

/**
 * Service interface defining the billing module operations.
 */
public interface BillingService {

    /**
     * Generates a PDF invoice for the given Sale Voucher.
     *
     * @param companyId the unique identifier of the Company
     * @param saleVoucherId the unique identifier of the Sale Voucher
     * @return byte array containing the generated PDF
     */
    byte[] generateInvoicePdf(UUID companyId, UUID saleVoucherId);
}
