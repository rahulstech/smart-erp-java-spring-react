package com.github.rahulstech.smarterp.inventory.service;

import com.github.rahulstech.smarterp.common.exception.HttpException;
import com.github.rahulstech.smarterp.company.model.CompanyEntity;
import com.github.rahulstech.smarterp.company.repository.CompanyRepository;
import com.github.rahulstech.smarterp.inventory.dto.CategoryResponse;
import com.github.rahulstech.smarterp.inventory.dto.CreateCategoryRequest;
import com.github.rahulstech.smarterp.inventory.dto.UpdateCategoryRequest;
import com.github.rahulstech.smarterp.inventory.mapper.CategoryMapper;
import com.github.rahulstech.smarterp.inventory.model.CategoryEntity;
import com.github.rahulstech.smarterp.inventory.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final CompanyRepository companyRepository;

    @Override
    @Transactional
    public CategoryResponse create(UUID companyId, CreateCategoryRequest request) {
        CompanyEntity company = companyRepository.findById(companyId)
                .orElseThrow(() -> HttpException.notFound("Company with id " + companyId + " not found"));

        if (categoryRepository.existsByCompanyIdAndNameIgnoreCase(companyId, request.name())) {
            throw HttpException.badRequest("Category with name " + request.name() + " already exists");
        }

        CategoryEntity entity = categoryMapper.toEntity(request);
        entity.setCompany(company);

        CategoryEntity saved = categoryRepository.saveAndFlush(entity);
        return categoryMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public CategoryResponse update(UUID companyId, UUID categoryId, UpdateCategoryRequest request) {
        CategoryEntity entity = categoryRepository.findByIdAndCompanyId(categoryId, companyId)
                .orElseThrow(() -> HttpException.notFound("Category with id " + categoryId + " not found in current company"));

        if (!entity.getName().equalsIgnoreCase(request.name()) &&
                categoryRepository.existsByCompanyIdAndNameIgnoreCase(companyId, request.name())) {
            throw HttpException.badRequest("Category with name " + request.name() + " already exists");
        }

        entity.setName(request.name());
        CategoryEntity updated = categoryRepository.saveAndFlush(entity);
        return categoryMapper.toResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getById(UUID companyId, UUID categoryId) {
        CategoryEntity entity = categoryRepository.findByIdAndCompanyId(categoryId, companyId)
                .orElseThrow(() -> HttpException.notFound("Category with id " + categoryId + " not found in current company"));
        return categoryMapper.toResponse(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAll(UUID companyId) {
        List<CategoryEntity> entities = categoryRepository.findByCompanyId(companyId);
        return entities.stream()
                .map(categoryMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public void delete(UUID companyId, UUID categoryId) {
        CategoryEntity entity = categoryRepository.findByIdAndCompanyId(categoryId, companyId)
                .orElseThrow(() -> HttpException.notFound("Category with id " + categoryId + " not found in current company"));
        categoryRepository.delete(entity);
    }
}
