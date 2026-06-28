package com.github.rahulstech.smarterp.purchase.service;

import com.github.rahulstech.smarterp.common.exception.HttpException;
import com.github.rahulstech.smarterp.company.model.CompanyEntity;
import com.github.rahulstech.smarterp.company.repository.CompanyRepository;
import com.github.rahulstech.smarterp.inventory.model.StockItemEntity;
import com.github.rahulstech.smarterp.inventory.repository.StockItemRepository;
import com.github.rahulstech.smarterp.purchase.dto.*;
import com.github.rahulstech.smarterp.purchase.mapper.PurchaseVoucherMapper;
import com.github.rahulstech.smarterp.purchase.model.PurchaseVoucherEntity;
import com.github.rahulstech.smarterp.purchase.model.PurchaseVoucherItemEntity;
import com.github.rahulstech.smarterp.purchase.repository.PurchaseVoucherItemRepository;
import com.github.rahulstech.smarterp.purchase.repository.PurchaseVoucherRepository;
import com.github.rahulstech.smarterp.supplier.model.SupplierEntity;
import com.github.rahulstech.smarterp.supplier.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service managing PurchaseVoucher aggregate root lifecycle.
 * Manages parent vouchers and child line items using direct UUID references without Hibernate relations.
 */
@Service
@RequiredArgsConstructor
public class PurchaseVoucherServiceImpl implements PurchaseVoucherService {

    private final PurchaseVoucherRepository purchaseVoucherRepository;
    private final PurchaseVoucherItemRepository purchaseVoucherItemRepository;
    private final CompanyRepository companyRepository;
    private final SupplierRepository supplierRepository;
    private final StockItemRepository stockItemRepository;
    private final PurchaseVoucherMapper purchaseVoucherMapper;

    /**
     * Creates a new Purchase Voucher and its associated line items.
     * Calculates line item amounts and total voucher amount server-side to ensure financial integrity.
     */
    @Override
    @Transactional
    public PurchaseVoucherResponse create(UUID companyId, CreatePurchaseVoucherRequest request) {
        // Step 1: Validate company existence and supplier boundary
        findCompanyOrThrow(companyId);
        SupplierEntity supplier = findSupplierOrThrow(companyId, request.supplierId());

        validateItemsNotEmpty(request.items());

        // Step 2: Initialize voucher aggregate and generate voucher number
        PurchaseVoucherEntity voucher = purchaseVoucherMapper.toEntity(request);
        voucher.setCompanyId(companyId);
        voucher.setVoucherNumber(generateVoucherNumber(companyId));

        // Step 3: Validate stock items and calculate line amounts and voucher total
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<PurchaseVoucherItemEntity> itemEntities = new ArrayList<>();

        for (PurchaseVoucherItemRequest itemReq : request.items()) {
            PurchaseVoucherItemEntity itemEntity = buildAndValidateItemEntity(companyId, itemReq);
            itemEntities.add(itemEntity);
            totalAmount = totalAmount.add(itemEntity.getAmount());
        }
        voucher.setTotalAmount(totalAmount);

        // Step 4: Save parent voucher aggregate first to obtain generated ID
        PurchaseVoucherEntity savedVoucher = purchaseVoucherRepository.save(voucher);

        // Step 5: Associate generated voucher ID with child items and persist them
        for (PurchaseVoucherItemEntity itemEntity : itemEntities) {
            itemEntity.setPurchaseVoucherId(savedVoucher.getId());
        }
        List<PurchaseVoucherItemEntity> savedItems = purchaseVoucherItemRepository.saveAll(itemEntities);

        // Step 6: Map saved aggregate and child entities into response DTO
        List<PurchaseVoucherItemResponse> itemResponses = savedItems.stream()
                .map(item -> {
                    StockItemEntity stockItem = stockItemRepository.findById(item.getStockItemId()).orElse(null);
                    return purchaseVoucherMapper.toItemResponse(item, stockItem != null ? stockItem.getItemName() : null);
                })
                .collect(Collectors.toList());

        return purchaseVoucherMapper.toResponse(savedVoucher, supplier.getName(), itemResponses);
    }

    /**
     * Updates an existing Purchase Voucher.
     * Replaces existing child items with updated ones and recalculates total amount.
     */
    @Override
    @Transactional
    public PurchaseVoucherResponse update(UUID companyId, UUID voucherId, UpdatePurchaseVoucherRequest request) {
        // Step 1: Load existing voucher and validate supplier boundary
        findCompanyOrThrow(companyId);
        PurchaseVoucherEntity voucher = findVoucherOrThrow(companyId, voucherId);
        SupplierEntity supplier = findSupplierOrThrow(companyId, request.supplierId());

        validateItemsNotEmpty(request.items());

        voucher.setSupplierId(request.supplierId());
        voucher.setVoucherDate(request.voucherDate());
        voucher.setRemarks(request.remarks());

        // Step 2: Remove existing child items from database
        purchaseVoucherItemRepository.deleteByPurchaseVoucherId(voucherId);

        // Step 3: Process new line items and recalculate aggregate total amount
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<PurchaseVoucherItemEntity> itemEntities = new ArrayList<>();

        for (PurchaseVoucherItemRequest itemReq : request.items()) {
            PurchaseVoucherItemEntity itemEntity = buildAndValidateItemEntity(companyId, itemReq);
            itemEntity.setPurchaseVoucherId(voucherId);
            itemEntities.add(itemEntity);
            totalAmount = totalAmount.add(itemEntity.getAmount());
        }
        voucher.setTotalAmount(totalAmount);

        // Step 4: Persist updated aggregate and new child items
        PurchaseVoucherEntity updatedVoucher = purchaseVoucherRepository.save(voucher);
        List<PurchaseVoucherItemEntity> savedItems = purchaseVoucherItemRepository.saveAll(itemEntities);

        List<PurchaseVoucherItemResponse> itemResponses = savedItems.stream()
                .map(item -> {
                    StockItemEntity stockItem = stockItemRepository.findById(item.getStockItemId()).orElse(null);
                    return purchaseVoucherMapper.toItemResponse(item, stockItem != null ? stockItem.getItemName() : null);
                })
                .collect(Collectors.toList());

        return purchaseVoucherMapper.toResponse(updatedVoucher, supplier.getName(), itemResponses);
    }

    /**
     * Retrieves details of a single Purchase Voucher by ID.
     */
    @Override
    @Transactional(readOnly = true)
    public PurchaseVoucherResponse getById(UUID companyId, UUID voucherId) {
        findCompanyOrThrow(companyId);
        PurchaseVoucherEntity voucher = findVoucherOrThrow(companyId, voucherId);
        return mapToResponse(voucher);
    }

    /**
     * Lists all Purchase Vouchers registered for the specified company.
     */
    @Override
    @Transactional(readOnly = true)
    public List<PurchaseVoucherResponse> getAll(UUID companyId) {
        findCompanyOrThrow(companyId);
        List<PurchaseVoucherEntity> vouchers = purchaseVoucherRepository.findByCompanyIdOrderByVoucherDateDesc(companyId);
        return vouchers.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Deletes a Purchase Voucher and all associated line items.
     */
    @Override
    @Transactional
    public void delete(UUID companyId, UUID voucherId) {
        findCompanyOrThrow(companyId);
        PurchaseVoucherEntity voucher = findVoucherOrThrow(companyId, voucherId);
        purchaseVoucherItemRepository.deleteByPurchaseVoucherId(voucherId);
        purchaseVoucherRepository.delete(voucher);
    }

    /**
     * Adds a single line item to an existing Purchase Voucher and recalculates aggregate total.
     */
    @Override
    @Transactional
    public PurchaseVoucherResponse addItem(UUID companyId, UUID voucherId, PurchaseVoucherItemRequest itemRequest) {
        findCompanyOrThrow(companyId);
        PurchaseVoucherEntity voucher = findVoucherOrThrow(companyId, voucherId);

        PurchaseVoucherItemEntity itemEntity = buildAndValidateItemEntity(companyId, itemRequest);
        itemEntity.setPurchaseVoucherId(voucherId);
        purchaseVoucherItemRepository.save(itemEntity);

        // Recalculate aggregate total amount across all items
        List<PurchaseVoucherItemEntity> allItems = purchaseVoucherItemRepository.findByPurchaseVoucherId(voucherId);
        BigDecimal totalAmount = allItems.stream()
                .map(PurchaseVoucherItemEntity::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        voucher.setTotalAmount(totalAmount);

        PurchaseVoucherEntity savedVoucher = purchaseVoucherRepository.save(voucher);
        return mapToResponse(savedVoucher);
    }

    /**
     * Helper to assemble a complete PurchaseVoucherResponse including supplier and item details.
     */
    private PurchaseVoucherResponse mapToResponse(PurchaseVoucherEntity voucher) {
        SupplierEntity supplier = supplierRepository.findById(voucher.getSupplierId()).orElse(null);
        String supplierName = supplier != null ? supplier.getName() : null;

        List<PurchaseVoucherItemEntity> itemEntities = purchaseVoucherItemRepository.findByPurchaseVoucherId(voucher.getId());
        List<PurchaseVoucherItemResponse> itemResponses = itemEntities.stream()
                .map(item -> {
                    StockItemEntity stockItem = stockItemRepository.findById(item.getStockItemId()).orElse(null);
                    return purchaseVoucherMapper.toItemResponse(item, stockItem != null ? stockItem.getItemName() : null);
                })
                .collect(Collectors.toList());

        return purchaseVoucherMapper.toResponse(voucher, supplierName, itemResponses);
    }

    private CompanyEntity findCompanyOrThrow(UUID companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> HttpException.notFound("Company not found"));
    }

    private SupplierEntity findSupplierOrThrow(UUID companyId, UUID supplierId) {
        return supplierRepository.findByIdAndCompanyId(supplierId, companyId)
                .orElseThrow(() -> HttpException.notFound("Supplier not found for company"));
    }

    private PurchaseVoucherEntity findVoucherOrThrow(UUID companyId, UUID voucherId) {
        return purchaseVoucherRepository.findByIdAndCompanyId(voucherId, companyId)
                .orElseThrow(() -> HttpException.notFound("Purchase voucher not found"));
    }

    private void validateItemsNotEmpty(List<PurchaseVoucherItemRequest> items) {
        if (items == null || items.isEmpty()) {
            throw HttpException.badRequest("Purchase voucher must contain at least one item");
        }
    }

    /**
     * Validates item quantities, unit prices, and stock item ownership before calculating item amount.
     */
    private PurchaseVoucherItemEntity buildAndValidateItemEntity(UUID companyId, PurchaseVoucherItemRequest itemReq) {
        if (itemReq.quantity() == null || itemReq.quantity().compareTo(BigDecimal.ZERO) <= 0) {
            throw HttpException.badRequest("Quantity must be greater than zero");
        }
        if (itemReq.unitPrice() == null || itemReq.unitPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw HttpException.badRequest("Unit price cannot be negative");
        }

        stockItemRepository.findByIdAndCompanyId(itemReq.stockItemId(), companyId)
                .orElseThrow(() -> HttpException.notFound("Stock item not found for company: " + itemReq.stockItemId()));

        // Always calculate monetary amounts server-side
        BigDecimal amount = itemReq.quantity().multiply(itemReq.unitPrice());

        PurchaseVoucherItemEntity itemEntity = purchaseVoucherMapper.toItemEntity(itemReq);
        itemEntity.setAmount(amount);
        return itemEntity;
    }

    /**
     * Generates a unique voucher number scoped to the company.
     */
    private String generateVoucherNumber(UUID companyId) {
        String prefix = "PV-" + System.currentTimeMillis();
        String voucherNumber = prefix;
        int count = 1;
        while (purchaseVoucherRepository.existsByCompanyIdAndVoucherNumber(companyId, voucherNumber)) {
            voucherNumber = prefix + "-" + count;
            count++;
        }
        return voucherNumber;
    }
}
