package com.github.rahulstech.smarterp.billing.service;

import com.github.rahulstech.smarterp.billing.pdf.InvoicePdfGenerator;
import com.github.rahulstech.smarterp.common.exception.HttpException;
import com.github.rahulstech.smarterp.company.model.CompanyEntity;
import com.github.rahulstech.smarterp.company.repository.CompanyRepository;
import com.github.rahulstech.smarterp.customer.model.CustomerEntity;
import com.github.rahulstech.smarterp.customer.repository.CustomerRepository;
import com.github.rahulstech.smarterp.sale.model.SaleVoucherEntity;
import com.github.rahulstech.smarterp.sale.model.SaleVoucherItemEntity;
import com.github.rahulstech.smarterp.sale.repository.SaleVoucherItemRepository;
import com.github.rahulstech.smarterp.sale.repository.SaleVoucherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Service implementation for managing billing tasks, loading entities, and coordinating PDF generation.
 */
@Service
@RequiredArgsConstructor
public class BillingServiceImpl implements BillingService {

    private final SaleVoucherRepository saleVoucherRepository;
    private final SaleVoucherItemRepository saleVoucherItemRepository;
    private final CustomerRepository customerRepository;
    private final CompanyRepository companyRepository;

    @Override
    @Transactional(readOnly = true)
    public byte[] generateInvoicePdf(UUID companyId, UUID saleVoucherId) {
        // Step 1: Load SaleVoucher
        SaleVoucherEntity voucher = saleVoucherRepository.findByCompanyIdAndId(companyId, saleVoucherId)
                .orElseThrow(() -> HttpException.notFound("Sale voucher not found"));

        // Step 2: Load Customer
        CustomerEntity customer = customerRepository.findByIdAndCompanyId(voucher.getCustomerId(), companyId)
                .orElseThrow(() -> HttpException.notFound("Customer not found"));

        // Step 3: Load Company
        CompanyEntity company = companyRepository.findById(companyId)
                .orElseThrow(() -> HttpException.notFound("Company not found"));

        // Step 4: Load SaleVoucherItems
        List<SaleVoucherItemEntity> items = saleVoucherItemRepository.findBySaleVoucherId(saleVoucherId);

        // Step 5: Delegate generation
        return InvoicePdfGenerator.generateInvoice(company, customer, voucher, items);
    }
}
