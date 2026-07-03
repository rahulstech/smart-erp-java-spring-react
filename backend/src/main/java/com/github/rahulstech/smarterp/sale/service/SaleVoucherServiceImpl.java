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
import com.github.rahulstech.smarterp.inventory.service.InventoryTransactionService;
import com.github.rahulstech.smarterp.sale.dto.*;
import com.github.rahulstech.smarterp.sale.mapper.SaleVoucherMapper;
import com.github.rahulstech.smarterp.sale.model.SaleVoucherEntity;
import com.github.rahulstech.smarterp.sale.model.SaleVoucherItemEntity;
import com.github.rahulstech.smarterp.sale.repository.SaleVoucherItemRepository;
import com.github.rahulstech.smarterp.sale.repository.SaleVoucherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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
    private final InventoryTransactionService inventoryTransactionService;

    @Override
    @Transactional
    public SaleVoucherResponse create(UUID companyId, CreateSaleVoucherRequest request) {
        // Step 1: Validate entity existence and company boundaries
        findCompanyOrThrow(companyId);
        CustomerEntity customer = findCustomerOrThrow(companyId, request.customerId());

        // Step 2: Initialize sale voucher entity and generate company-scoped voucher number
        SaleVoucherEntity voucher = saleVoucherMapper.toEntity(request);
        voucher.setCompanyId(companyId);
        voucher.setVoucherNumber(generateVoucherNumber(companyId));
        voucher.setGrandTotal(BigDecimal.ZERO);

        // Step 4: Persist parent voucher aggregate
        SaleVoucherEntity savedVoucher = saleVoucherRepository.save(voucher);

        return saleVoucherMapper.toResponse(savedVoucher, customer.getName(), List.of());
    }

    @Override
    @Transactional
    public SaleVoucherResponse update(UUID companyId, UUID voucherId, UpdateSaleVoucherRequest request) {
        // Step 1: Validate existing voucher and boundary relations
        findCompanyOrThrow(companyId);
        SaleVoucherEntity voucher = findVoucherOrThrow(companyId, voucherId);
        CustomerEntity customer = findCustomerOrThrow(companyId, request.customerId());

        voucher.setCustomerId(request.customerId());
        voucher.setVoucherDate(request.voucherDate());

        // Step 4: Persist updated aggregate and return mapped response
        SaleVoucherEntity updatedVoucher = saleVoucherRepository.save(voucher);

        return mapToResponse(updatedVoucher);
    }

    @Override
    @Transactional(readOnly = true)
    public SaleVoucherResponse getById(UUID companyId, UUID voucherId) {
        findCompanyOrThrow(companyId);
        SaleVoucherEntity voucher = findVoucherOrThrow(companyId, voucherId);
        return mapToResponse(voucher);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SaleVoucherResponse> getAll(UUID companyId) {
        findCompanyOrThrow(companyId);
        List<SaleVoucherEntity> vouchers = saleVoucherRepository.findByCompanyIdOrderByVoucherDateDesc(companyId);
        return vouchers.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void delete(UUID companyId, UUID voucherId) {
        findCompanyOrThrow(companyId);
        SaleVoucherEntity voucher = findVoucherOrThrow(companyId, voucherId);
        
        // Reverse stock for existing items of the voucher
        List<SaleVoucherItemEntity> oldItems = saleVoucherItemRepository.findBySaleVoucherId(voucherId);
        for (SaleVoucherItemEntity item : oldItems) {
            inventoryTransactionService.recordStockIn(companyId, voucherId, "DELETED_SALE_VOUCHER", item.getStockItemId(), item.getQuantity());
        }

        saleVoucherItemRepository.deleteBySaleVoucherId(voucherId);
        saleVoucherRepository.delete(voucher);
    }

    @Override
    @Transactional
    public SaleVoucherResponse createItems(UUID companyId, UUID voucherId, SaleVoucherItemsRequest request) {
        findCompanyOrThrow(companyId);
        SaleVoucherEntity voucher = findVoucherOrThrow(companyId, voucherId);

        validateItemList(request.items());

        List<SaleVoucherItemEntity> items = processAndValidateItems(companyId, request.items());
        for (SaleVoucherItemEntity item : items) {
            item.setSaleVoucherId(voucherId);
        }

        List<SaleVoucherItemEntity> savedItems = saleVoucherItemRepository.saveAll(items);

        // Record stock out transactions and update quantities
        for (SaleVoucherItemEntity item : savedItems) {
            inventoryTransactionService.recordStockOut(companyId, voucherId, "SALE_VOUCHER", item.getStockItemId(), item.getQuantity());
        }

        // Recalculate financials across all items
        List<SaleVoucherItemEntity> allItems = saleVoucherItemRepository.findBySaleVoucherId(voucherId);
        calculateVoucherFinancials(voucher, allItems);
        saleVoucherRepository.save(voucher);

        return mapToResponse(voucher);
    }

    @Override
    @Transactional
    public SaleVoucherResponse updateItems(UUID companyId, UUID voucherId, SaleVoucherItemsRequest request) {
        findCompanyOrThrow(companyId);
        SaleVoucherEntity voucher = findVoucherOrThrow(companyId, voucherId);

        validateItemList(request.items());

        // Load existing child items for comparison before deleting
        List<SaleVoucherItemEntity> oldItems = saleVoucherItemRepository.findBySaleVoucherId(voucherId);

        // Remove existing line items for clean recreation
        saleVoucherItemRepository.deleteBySaleVoucherId(voucherId);

        // Process new line items
        List<SaleVoucherItemEntity> items = processAndValidateItems(companyId, request.items());
        for (SaleVoucherItemEntity item : items) {
            item.setSaleVoucherId(voucherId);
        }

        // Persist updated items
        saleVoucherItemRepository.saveAll(items);

        // Recalculate financials
        List<SaleVoucherItemEntity> allItems = saleVoucherItemRepository.findBySaleVoucherId(voucherId);
        calculateVoucherFinancials(voucher, allItems);
        SaleVoucherEntity updatedVoucher = saleVoucherRepository.save(voucher);

        // Adjust stock and log transactions
        Map<UUID, BigDecimal> oldQuantities = oldItems.stream()
                .collect(Collectors.toMap(SaleVoucherItemEntity::getStockItemId, SaleVoucherItemEntity::getQuantity, (a, b) -> a));

        Map<UUID, BigDecimal> newQuantities = request.items().stream()
                .collect(Collectors.toMap(SaleVoucherItemRequest::itemId, SaleVoucherItemRequest::quantity, (a, b) -> a));

        inventoryTransactionService.adjustStockForUpdate(companyId, voucherId, "SALE_VOUCHER", oldQuantities, newQuantities);

        return mapToResponse(updatedVoucher);
    }

    private SaleVoucherResponse mapToResponse(SaleVoucherEntity voucher) {
        String customerName = getCustomerName(voucher.getCustomerId());
        List<SaleVoucherItemEntity> items = saleVoucherItemRepository.findBySaleVoucherId(voucher.getId());
        List<SaleVoucherItemResponse> itemResponses = items.stream()
                .map(item -> {
                    String unitName = getUnitNameForStockItem(item.getStockItemId());
                    return saleVoucherMapper.toItemResponse(item, unitName);
                })
                .collect(Collectors.toList());
        return saleVoucherMapper.toResponse(voucher, customerName, itemResponses);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SaleVoucherItemResponse> getItems(UUID companyId, UUID voucherId) {
        findCompanyOrThrow(companyId);
        findVoucherOrThrow(companyId, voucherId);

        List<SaleVoucherItemEntity> itemEntities = saleVoucherItemRepository.findBySaleVoucherId(voucherId);
        return itemEntities.stream()
                .map(item -> {
                    String unitName = getUnitNameForStockItem(item.getStockItemId());
                    return saleVoucherMapper.toItemResponse(item, unitName);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SaleVoucherItemResponse getItem(UUID companyId, UUID voucherId, UUID itemId) {
        findCompanyOrThrow(companyId);
        findVoucherOrThrow(companyId, voucherId);

        SaleVoucherItemEntity item = saleVoucherItemRepository.findById(itemId)
                .orElseThrow(() -> HttpException.notFound("Sale voucher item not found"));

        if (!item.getSaleVoucherId().equals(voucherId)) {
            throw HttpException.notFound("Sale voucher item not found");
        }

        String unitName = getUnitNameForStockItem(item.getStockItemId());
        return saleVoucherMapper.toItemResponse(item, unitName);
    }

    private String getUnitNameForStockItem(UUID stockItemId) {
        return stockItemRepository.findById(stockItemId)
                .flatMap(stockItem -> {
                    if (stockItem.getUnitId() != null) {
                        return unitRepository.findById(stockItem.getUnitId())
                                .map(UnitEntity::getName);
                    }
                    return Optional.empty();
                })
                .orElse(null);
    }

    private String getCustomerName(UUID customerId) {
        return customerRepository.findById(customerId)
                .map(CustomerEntity::getName)
                .orElse(null);
    }

    private CompanyEntity findCompanyOrThrow(UUID companyId) {
        return companyRepository.findById(companyId)
                .orElseThrow(() -> HttpException.notFound("Company not found"));
    }

    private CustomerEntity findCustomerOrThrow(UUID companyId, UUID customerId) {
        return customerRepository.findByIdAndCompanyId(customerId, companyId)
                .orElseThrow(() -> HttpException.notFound("Customer not found for company"));
    }

    private SaleVoucherEntity findVoucherOrThrow(UUID companyId, UUID voucherId) {
        return saleVoucherRepository.findByCompanyIdAndId(companyId, voucherId)
                .orElseThrow(() -> HttpException.notFound("Sale voucher not found"));
    }

    private void validateItemList(List<SaleVoucherItemRequest> items) {
        if (items == null || items.isEmpty()) {
            throw HttpException.badRequest("Item list cannot be empty");
        }
    }

    private List<SaleVoucherItemEntity> processAndValidateItems(UUID companyId, List<SaleVoucherItemRequest> itemRequests) {
        List<SaleVoucherItemEntity> items = new ArrayList<>();

        for (SaleVoucherItemRequest itemReq : itemRequests) {
            if (itemReq.quantity() == null || itemReq.quantity().compareTo(BigDecimal.ZERO) <= 0) {
                throw HttpException.badRequest("Quantity must be greater than zero");
            }
            if (itemReq.rate() == null || itemReq.rate().compareTo(BigDecimal.ZERO) < 0) {
                throw HttpException.badRequest("Rate cannot be negative");
            }

            StockItemEntity stockItem = stockItemRepository.findByIdAndCompanyId(itemReq.itemId(), companyId)
                    .orElseThrow(() -> HttpException.notFound("Stock item not found for company"));

            SaleVoucherItemEntity itemEntity = saleVoucherMapper.toItemEntity(itemReq);
            itemEntity.setItemName(stockItem.getItemName());

            BigDecimal lineTotal = itemReq.quantity().multiply(itemReq.rate()).setScale(2, RoundingMode.HALF_UP);
            itemEntity.setLineTotal(lineTotal);

            items.add(itemEntity);
        }
        return items;
    }

    private void calculateVoucherFinancials(SaleVoucherEntity voucher, List<SaleVoucherItemEntity> items) {
        BigDecimal grandTotal = BigDecimal.ZERO;
        for (SaleVoucherItemEntity item : items) {
            grandTotal = grandTotal.add(item.getLineTotal());
        }
        voucher.setGrandTotal(grandTotal.setScale(2, RoundingMode.HALF_UP));
    }

    private String generateVoucherNumber(UUID companyId) {
        Optional<SaleVoucherEntity> latestVoucher = saleVoucherRepository.findTopByCompanyIdOrderByCreatedAtDesc(companyId);
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
