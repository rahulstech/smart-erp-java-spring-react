package com.github.rahulstech.smarterp.purchase.service;

import com.github.rahulstech.smarterp.common.exception.HttpException;
import com.github.rahulstech.smarterp.company.model.CompanyEntity;
import com.github.rahulstech.smarterp.company.repository.CompanyRepository;
import com.github.rahulstech.smarterp.inventory.model.StockItemEntity;
import com.github.rahulstech.smarterp.inventory.repository.StockItemRepository;
import com.github.rahulstech.smarterp.inventory.service.InventoryTransactionService;
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
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
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
    private final InventoryTransactionService inventoryTransactionService;

    /**
     * Creates a new Purchase Voucher.
     */
    @Override
    @Transactional
    public PurchaseVoucherResponse create(UUID companyId, CreatePurchaseVoucherRequest request) {
        // Step 1: Validate company existence and supplier boundary
        findCompanyOrThrow(companyId);
        SupplierEntity supplier = findSupplierOrThrow(companyId, request.supplierId());

        // Step 2: Initialize voucher aggregate and generate voucher number
        PurchaseVoucherEntity voucher = purchaseVoucherMapper.toEntity(request);
        voucher.setCompanyId(companyId);
        voucher.setVoucherNumber(generateVoucherNumber(companyId));
        voucher.setTotalAmount(BigDecimal.ZERO);

        // Step 4: Save parent voucher aggregate
        PurchaseVoucherEntity savedVoucher = purchaseVoucherRepository.save(voucher);

        return purchaseVoucherMapper.toResponse(savedVoucher, supplier.getName(), List.of());
    }

    /**
     * Updates an existing Purchase Voucher (header details only).
     */
    @Override
    @Transactional
    public PurchaseVoucherResponse update(UUID companyId, UUID voucherId, UpdatePurchaseVoucherRequest request) {
        // Step 1: Load existing voucher and validate supplier boundary
        findCompanyOrThrow(companyId);
        PurchaseVoucherEntity voucher = findVoucherOrThrow(companyId, voucherId);
        SupplierEntity supplier = findSupplierOrThrow(companyId, request.supplierId());

        voucher.setSupplierId(request.supplierId());
        voucher.setVoucherDate(request.voucherDate());

        PurchaseVoucherEntity updatedVoucher = purchaseVoucherRepository.save(voucher);

        return mapToResponse(updatedVoucher);
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
        
        // Reverse stock for existing items of the voucher
        List<PurchaseVoucherItemEntity> oldItems = purchaseVoucherItemRepository.findByPurchaseVoucherId(voucherId);
        for (PurchaseVoucherItemEntity item : oldItems) {
            inventoryTransactionService.recordStockOut(companyId, voucherId, "DELETED_PURCHASE_VOUCHER", item.getStockItemId(), item.getQuantity());
        }
        
        purchaseVoucherItemRepository.deleteByPurchaseVoucherId(voucherId);
        purchaseVoucherRepository.delete(voucher);
    }

    /**
     * Creates multiple line items for an existing Purchase Voucher.
     */
    @Override
    @Transactional
    public PurchaseVoucherResponse createItems(UUID companyId, UUID voucherId, PurchaseVoucherItemsRequest request) {
        findCompanyOrThrow(companyId);
        PurchaseVoucherEntity voucher = findVoucherOrThrow(companyId, voucherId);

        validateItemsNotEmpty(request.items());

        List<PurchaseVoucherItemEntity> itemEntities = new ArrayList<>();
        for (PurchaseVoucherItemRequest itemReq : request.items()) {
            PurchaseVoucherItemEntity itemEntity = buildAndValidateItemEntity(companyId, itemReq);
            itemEntity.setPurchaseVoucherId(voucherId);
            itemEntities.add(itemEntity);
        }

        List<PurchaseVoucherItemEntity> savedItems = purchaseVoucherItemRepository.saveAll(itemEntities);

        // Record stock in transactions and update quantities
        for (PurchaseVoucherItemEntity item : savedItems) {
            inventoryTransactionService.recordStockIn(companyId, voucherId, "PURCHASE_VOUCHER", item.getStockItemId(), item.getQuantity());
        }

        // Recalculate total amount across all items
        List<PurchaseVoucherItemEntity> allItems = purchaseVoucherItemRepository.findByPurchaseVoucherId(voucherId);
        BigDecimal totalAmount = allItems.stream()
                .map(PurchaseVoucherItemEntity::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        voucher.setTotalAmount(totalAmount);

        PurchaseVoucherEntity savedVoucher = purchaseVoucherRepository.save(voucher);
        return mapToResponse(savedVoucher);
    }

    /**
     * Replaces and updates line items for an existing Purchase Voucher.
     */
    @Override
    @Transactional
    public PurchaseVoucherResponse updateItems(UUID companyId, UUID voucherId, PurchaseVoucherItemsRequest request) {
        findCompanyOrThrow(companyId);
        PurchaseVoucherEntity voucher = findVoucherOrThrow(companyId, voucherId);

        validateItemsNotEmpty(request.items());

        // Load existing child items for comparison before deleting
        List<PurchaseVoucherItemEntity> oldItems = purchaseVoucherItemRepository.findByPurchaseVoucherId(voucherId);

        // Remove existing child items from database
        purchaseVoucherItemRepository.deleteByPurchaseVoucherId(voucherId);

        // Process new line items
        List<PurchaseVoucherItemEntity> itemEntities = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (PurchaseVoucherItemRequest itemReq : request.items()) {
            PurchaseVoucherItemEntity itemEntity = buildAndValidateItemEntity(companyId, itemReq);
            itemEntity.setPurchaseVoucherId(voucherId);
            itemEntities.add(itemEntity);
            totalAmount = totalAmount.add(itemEntity.getAmount());
        }
        voucher.setTotalAmount(totalAmount);

        // Persist updated aggregate and new child items
        PurchaseVoucherEntity updatedVoucher = purchaseVoucherRepository.save(voucher);
        purchaseVoucherItemRepository.saveAll(itemEntities);

        // Adjust stock and log transactions
        Map<UUID, BigDecimal> oldQuantities = oldItems.stream()
                .collect(Collectors.toMap(PurchaseVoucherItemEntity::getStockItemId, PurchaseVoucherItemEntity::getQuantity, (a, b) -> a));

        Map<UUID, BigDecimal> newQuantities = request.items().stream()
                .collect(Collectors.toMap(PurchaseVoucherItemRequest::stockItemId, PurchaseVoucherItemRequest::quantity, (a, b) -> a));

        inventoryTransactionService.adjustStockForUpdate(companyId, voucherId, "PURCHASE_VOUCHER", oldQuantities, newQuantities);

        return mapToResponse(updatedVoucher);
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

    @Override
    @Transactional(readOnly = true)
    public List<PurchaseVoucherItemResponse> getItems(UUID companyId, UUID voucherId) {
        findCompanyOrThrow(companyId);
        findVoucherOrThrow(companyId, voucherId);

        List<PurchaseVoucherItemEntity> itemEntities = purchaseVoucherItemRepository.findByPurchaseVoucherId(voucherId);
        return itemEntities.stream()
                .map(item -> {
                    StockItemEntity stockItem = stockItemRepository.findById(item.getStockItemId()).orElse(null);
                    return purchaseVoucherMapper.toItemResponse(item, stockItem != null ? stockItem.getItemName() : null);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PurchaseVoucherItemResponse getItem(UUID companyId, UUID voucherId, UUID itemId) {
        findCompanyOrThrow(companyId);
        findVoucherOrThrow(companyId, voucherId);

        PurchaseVoucherItemEntity item = purchaseVoucherItemRepository.findById(itemId)
                .orElseThrow(() -> HttpException.notFound("Purchase voucher item not found"));

        if (!item.getPurchaseVoucherId().equals(voucherId)) {
            throw HttpException.notFound("Purchase voucher item not found");
        }

        StockItemEntity stockItem = stockItemRepository.findById(item.getStockItemId()).orElse(null);
        return purchaseVoucherMapper.toItemResponse(item, stockItem != null ? stockItem.getItemName() : null);
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
