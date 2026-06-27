package com.github.rahulstech.smarterp.inventory.service;

import com.github.rahulstech.smarterp.inventory.dto.CategoryResponse;
import com.github.rahulstech.smarterp.inventory.dto.CreateCategoryRequest;
import com.github.rahulstech.smarterp.inventory.dto.UpdateCategoryRequest;
import java.util.List;
import java.util.UUID;

public interface CategoryService {

    CategoryResponse create(UUID companyId, CreateCategoryRequest request);

    CategoryResponse update(UUID companyId, UUID categoryId, UpdateCategoryRequest request);

    CategoryResponse getById(UUID companyId, UUID categoryId);

    List<CategoryResponse> getAll(UUID companyId);

    void delete(UUID companyId, UUID categoryId);
}
