package com.github.rahulstech.smarterp.inventory.service;

import com.github.rahulstech.smarterp.common.exception.HttpException;
import com.github.rahulstech.smarterp.company.repository.CompanyRepository;
import com.github.rahulstech.smarterp.inventory.dto.CreateStockItemRequest;
import com.github.rahulstech.smarterp.inventory.dto.StockItemResponse;
import com.github.rahulstech.smarterp.inventory.dto.UpdateStockItemRequest;
import com.github.rahulstech.smarterp.inventory.mapper.StockItemMapper;
import com.github.rahulstech.smarterp.inventory.model.CategoryEntity;
import com.github.rahulstech.smarterp.inventory.model.StockItemEntity;
import com.github.rahulstech.smarterp.inventory.model.UnitEntity;
import com.github.rahulstech.smarterp.inventory.repository.CategoryRepository;
import com.github.rahulstech.smarterp.inventory.repository.StockItemRepository;
import com.github.rahulstech.smarterp.inventory.repository.UnitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StockItemServiceImpl implements StockItemService {

    private final StockItemRepository stockItemRepository;
    private final StockItemMapper stockItemMapper;
    private final CompanyRepository companyRepository;
    private final CategoryRepository categoryRepository;
    private final UnitRepository unitRepository;

    @Override
    @Transactional
    public StockItemResponse create(UUID companyId, CreateStockItemRequest request) {
        if (!companyRepository.existsById(companyId)) {
            throw HttpException.notFound("Company with id " + companyId + " not found");
        }

        CategoryEntity category = categoryRepository.findByIdAndCompanyId(request.categoryId(), companyId)
                .orElseThrow(() -> HttpException.notFound("Category with id " + request.categoryId() + " not found in current company"));

        UnitEntity unit = unitRepository.findByIdAndCompanyId(request.unitId(), companyId)
                .orElseThrow(() -> HttpException.notFound("Unit with id " + request.unitId() + " not found in current company"));

        if (stockItemRepository.existsByCompanyIdAndItemCodeIgnoreCase(companyId, request.itemCode())) {
            throw HttpException.badRequest("Stock item with code " + request.itemCode() + " already exists in the company");
        }

        StockItemEntity entity = stockItemMapper.toEntity(request);
        entity.setCompanyId(companyId);

        StockItemEntity saved = stockItemRepository.saveAndFlush(entity);
        return stockItemMapper.toResponse(saved, category.getName(), unit.getName(), unit.getSymbol());
    }

    @Override
    @Transactional
    public StockItemResponse update(UUID companyId, UUID itemId, UpdateStockItemRequest request) {
        StockItemEntity entity = stockItemRepository.findByIdAndCompanyId(itemId, companyId)
                .orElseThrow(() -> HttpException.notFound("Stock item with id " + itemId + " not found in current company"));

        CategoryEntity category = categoryRepository.findByIdAndCompanyId(request.categoryId(), companyId)
                .orElseThrow(() -> HttpException.notFound("Category with id " + request.categoryId() + " not found in current company"));

        UnitEntity unit = unitRepository.findByIdAndCompanyId(request.unitId(), companyId)
                .orElseThrow(() -> HttpException.notFound("Unit with id " + request.unitId() + " not found in current company"));

        entity.setCategoryId(request.categoryId());
        entity.setUnitId(request.unitId());
        entity.setItemName(request.itemName());

        StockItemEntity updated = stockItemRepository.saveAndFlush(entity);
        return stockItemMapper.toResponse(updated, category.getName(), unit.getName(), unit.getSymbol());
    }

    @Override
    @Transactional(readOnly = true)
    public StockItemResponse getById(UUID companyId, UUID itemId) {
        StockItemEntity entity = stockItemRepository.findByIdAndCompanyId(itemId, companyId)
                .orElseThrow(() -> HttpException.notFound("Stock item with id " + itemId + " not found in current company"));
        return mapToResponse(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StockItemResponse> getAll(UUID companyId) {
        List<StockItemEntity> entities = stockItemRepository.findByCompanyIdOrderByCreatedAtDesc(companyId);
        return entities.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StockItemResponse> search(UUID companyId, String keyword) {
        List<StockItemEntity> entities = stockItemRepository.findByCompanyIdAndItemNameStartingWithIgnoreCaseOrderByCreatedAtDesc(companyId, keyword);
        return entities.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public void delete(UUID companyId, UUID itemId) {
        StockItemEntity entity = stockItemRepository.findByIdAndCompanyId(itemId, companyId)
                .orElseThrow(() -> HttpException.notFound("Stock item with id " + itemId + " not found in current company"));
        stockItemRepository.delete(entity);
    }

    private StockItemResponse mapToResponse(StockItemEntity entity) {
        CategoryEntity category = categoryRepository.findById(entity.getCategoryId()).orElse(null);
        UnitEntity unit = unitRepository.findById(entity.getUnitId()).orElse(null);
        String categoryName = category != null ? category.getName() : null;
        String unitName = unit != null ? unit.getName() : null;
        String unitSymbol = unit != null ? unit.getSymbol() : null;
        return stockItemMapper.toResponse(entity, categoryName, unitName, unitSymbol);
    }
}
