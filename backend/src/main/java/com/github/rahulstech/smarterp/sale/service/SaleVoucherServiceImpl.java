package com.github.rahulstech.smarterp.sale.service;

import com.github.rahulstech.smarterp.common.exception.HttpException;
import com.github.rahulstech.smarterp.company.model.CompanyEntity;
import com.github.rahulstech.smarterp.company.repository.CompanyRepository;
import com.github.rahulstech.smarterp.customer.model.CustomerEntity;
import com.github.rahulstech.smarterp.customer.repository.CustomerRepository;
import com.github.rahulstech.smarterp.inventory.model.StockItemEntity;
import com.github.rahulstech.smarterp.inventory.model.UnitEntity;
import com.github.rahulstech.smarterp.inventory.repository.StockItemRepository;
import com.github.rahulstech.smarterp.inventory.repository.UnitRepository;
import com.github.rahulstech.smarterp.sale.dto.*;
import com.github.rahulstech.smarterp.sale.mapper.SaleVoucherMapper;
import com.github.rahulstech.smarterp.sale.model.SaleVoucher;
import com.github.rahulstech.smarterp.sale.model.SaleVoucherItem;
import com.github.rahulstech.smarterp.sale.repository.SaleVoucherItemRepository;
import com.github.rahulstech.smarterp.sale.repository.SaleVoucherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service implementation managing business logic and financial calculations for Sale Vouchers.
 */
@Service
@RequiredArgsConstructor
public class SaleVoucherServiceImpl implements SaleVoucherService {

    private final SaleVoucherRepository saleVoucherRepository;
    private final SaleVoucherItemRepository saleVoucherItemRepository;
    private final CompanyRepository companyRepository;
    private final CustomerRepository customerRepository;
    private final StockItemRepository stockItemRepository;
    private final UnitRepository unitRepository;
    private final SaleVoucherMapper saleVoucherMapper;

    @Override
    @Transactional
    public SaleVoucherResponse create(UUID companyId, CreateSaleVoucherRequest request) {
        // Step 1: Validate entity existence and company boundaries
        findCompanyOrThrow(companyId);
        CustomerEntity customer = findCustomerOrThrow(companyId, request.customerId());
        validateItemList(request.items());

        // Step 2: Initialize sale voucher entity and generate company-scoped voucher number
        SaleVoucher voucher = saleVoucherMapper.toEntity(request);
        voucher.setCompanyId(companyId);
        voucher.setVoucherNumber(generateVoucherNumber(companyId));
        voucher.setCustomerName(customer.getName());

        // Step 3: Process line items and calculate financial totals
        List<SaleVoucherItem> items = processAndValidateItems(companyId, request.items());
        calculateVoucherFinancials(voucher, items);

        // Step 4: Persist parent voucher aggregate and associate generated ID with child line items
        SaleVoucher savedVoucher = saleVoucherRepository.save(voucher);
        for (SaleVoucherItem item : items) {
            item.setSaleVoucherId(savedVoucher.getId());
        }
        List<SaleVoucherItem> savedItems = saleVoucherItemRepository.saveAll(items);

        // Step 5: Map persisted entities to response DTO
        List<SaleVoucherItemResponse> itemResponses = savedItems.stream()
                .map(saleVoucherMapper::toItemResponse)
                .collect(Collectors.toList());

        return saleVoucherMapper.toResponse(savedVoucher, itemResponses);
    }

    @Override
    @Transactional
    public SaleVoucherResponse update(UUID companyId, UUID voucherId, UpdateSaleVoucherRequest request) {
        // Step 1: Validate existing voucher and boundary relations
        findCompanyOrThrow(companyId);
        SaleVoucher voucher = findVoucherOrThrow(companyId, voucherId);
        CustomerEntity customer = findCustomerOrThrow(companyId, request.customerId());
        validateItemList(request.items());

        voucher.setCustomerId(request.customerId());
        voucher.setVoucherDate(request.voucherDate());
        voucher.setCustomerName(customer.getName());

        // Step 2: Remove existing line items for clean recreation
        saleVoucherItemRepository.deleteBySaleVoucherId(voucherId);

        // Step 3: Process new line items and recalculate aggregate financial totals
        List<SaleVoucherItem> items = processAndValidateItems(companyId, request.items());
        for (SaleVoucherItem item : items) {
            item.setSaleVoucherId(voucherId);
        }
        calculateVoucherFinancials(voucher, items);

        // Step 4: Persist updated aggregate and return mapped response
        SaleVoucher updatedVoucher = saleVoucherRepository.save(voucher);
        List<SaleVoucherItem> savedItems = saleVoucherItemRepository.saveAll(items);

        List<SaleVoucherItemResponse> itemResponses = savedItems.stream()
                .map(saleVoucherMapper::toItemResponse)
                .collect(Collectors.toList());

        return saleVoucherMapper.toResponse(updatedVoucher, itemResponses);
    }

    @Override
    @Transactional(readOnly = true)
    public SaleVoucherResponse getById(UUID companyId, UUID voucherId) {
        findCompanyOrThrow(companyId);
        SaleVoucher voucher = findVoucherOrThrow(companyId, voucherId);
        return mapToResponse(voucher);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SaleVoucherResponse> getAll(UUID companyId) {
        findCompanyOrThrow(companyId);
        List<SaleVoucher> vouchers = saleVoucherRepository.findByCompanyIdOrderByVoucherDateDesc(companyId);
        return vouchers.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void delete(UUID companyId, UUID voucherId) {
        findCompanyOrThrow(companyId);
        SaleVoucher voucher = findVoucherOrThrow(companyId, voucherId);
        saleVoucherItemRepository.deleteBySaleVoucherId(voucherId);
        saleVoucherRepository.delete(voucher);
    }

    private SaleVoucherResponse mapToResponse(SaleVoucher voucher) {
        List<SaleVoucherItem> items = saleVoucherItemRepository.findBySaleVoucherId(voucher.getId());
        List<SaleVoucherItemResponse> itemResponses = items.stream()
                .map(saleVoucherMapper::toItemResponse)
                .collect(Collectors.toList());
        return saleVoucherMapper.toResponse(voucher, itemResponses);
    }

    private CompanyEntity findCompanyOrThrow(UUID companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> HttpException.notFound("Company not found"));
    }

    private CustomerEntity findCustomerOrThrow(UUID companyId, UUID customerId) {
        return customerRepository.findByIdAndCompanyId(customerId, companyId)
                .orElseThrow(() -> HttpException.notFound("Customer not found for company"));
    }

    private SaleVoucher findVoucherOrThrow(UUID companyId, UUID voucherId) {
        return saleVoucherRepository.findByCompanyIdAndId(companyId, voucherId)
                .orElseThrow(() -> HttpException.notFound("Sale voucher not found"));
    }

    private void validateItemList(List<SaleVoucherItemRequest> items) {
        if (items == null || items.isEmpty()) {
            throw HttpException.badRequest("Item list cannot be empty");
        }
    }

    private List<SaleVoucherItem> processAndValidateItems(UUID companyId, List<SaleVoucherItemRequest> itemRequests) {
        List<SaleVoucherItem> items = new ArrayList<>();

        for (SaleVoucherItemRequest itemReq : itemRequests) {
            if (itemReq.quantity() == null || itemReq.quantity().compareTo(BigDecimal.ZERO) <= 0) {
                throw HttpException.badRequest("Quantity must be greater than zero");
            }
            if (itemReq.rate() == null || itemReq.rate().compareTo(BigDecimal.ZERO) < 0) {
                throw HttpException.badRequest("Rate cannot be negative");
            }

            StockItemEntity stockItem = stockItemRepository.findByIdAndCompanyId(itemReq.itemId(), companyId)
                    .orElseThrow(() -> HttpException.notFound("Stock item not found for company"));

            String unitName = null;
            if (stockItem.getUnitId() != null) {
                Optional<UnitEntity> unitOpt = unitRepository.findById(stockItem.getUnitId());
                if (unitOpt.isPresent()) {
                    unitName = unitOpt.get().getName();
                }
            }

            SaleVoucherItem itemEntity = saleVoucherMapper.toItemEntity(itemReq);
            itemEntity.setItemName(stockItem.getItemName());
            itemEntity.setUnitName(unitName);
            itemEntity.setHsnCode(null);

            BigDecimal lineTotal = itemReq.quantity().multiply(itemReq.rate()).setScale(2, RoundingMode.HALF_UP);
            itemEntity.setLineTotal(lineTotal);

            items.add(itemEntity);
        }
        return items;
    }

    private void calculateVoucherFinancials(SaleVoucher voucher, List<SaleVoucherItem> items) {
        BigDecimal grandTotal = BigDecimal.ZERO;
        for (SaleVoucherItem item : items) {
            grandTotal = grandTotal.add(item.getLineTotal());
        }
        voucher.setGrandTotal(grandTotal.setScale(2, RoundingMode.HALF_UP));
    }

    private String generateVoucherNumber(UUID companyId) {
        Optional<SaleVoucher> latestVoucher = saleVoucherRepository.findTopByCompanyIdOrderByCreatedAtDesc(companyId);
        long nextSeq = 1;
        if (latestVoucher.isPresent() && latestVoucher.get().getVoucherNumber() != null) {
            String lastNum = latestVoucher.get().getVoucherNumber();
            if (lastNum.startsWith("SAL-")) {
                try {
                    nextSeq = Long.parseLong(lastNum.substring(4)) + 1;
                } catch (NumberFormatException e) {
                    // fallback if formatting was different
                }
            }
        }
        String voucherNum = String.format("SAL-%06d", nextSeq);
        while (saleVoucherRepository.existsByCompanyIdAndVoucherNumber(companyId, voucherNum)) {
            nextSeq++;
            voucherNum = String.format("SAL-%06d", nextSeq);
        }
        return voucherNum;
    }
}
