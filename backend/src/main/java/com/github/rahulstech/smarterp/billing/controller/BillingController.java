package com.github.rahulstech.smarterp.billing.controller;

import com.github.rahulstech.smarterp.billing.service.BillingService;
import com.github.rahulstech.smarterp.common.exception.HttpException;
import com.github.rahulstech.smarterp.sale.model.SaleVoucherEntity;
import com.github.rahulstech.smarterp.sale.repository.SaleVoucherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Controller exposing REST API endpoints for billing operations.
 */
@CrossOrigin
@RestController
@RequestMapping("/api/companies/{companyId}/sale-vouchers/{voucherId}/billing")
@RequiredArgsConstructor
public class BillingController {

    private final BillingService billingService;
    private final SaleVoucherRepository saleVoucherRepository;

    @GetMapping("/invoice")
    public ResponseEntity<byte[]> getInvoicePdf(
            @PathVariable("companyId") UUID companyId,
            @PathVariable("voucherId") UUID voucherId) {
        // Retrieve Sale Voucher to dynamically fetch voucher code for the attachment filename
        SaleVoucherEntity voucher = saleVoucherRepository.findByCompanyIdAndId(companyId, voucherId)
                .orElseThrow(() -> HttpException.notFound("Sale voucher not found"));

        byte[] pdfBytes = billingService.generateInvoicePdf(companyId, voucherId);

        String filename = voucher.getVoucherNumber() + ".pdf";

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(pdfBytes);
    }
}
