package com.github.rahulstech.smarterp.inventory.mapper;

import com.github.rahulstech.smarterp.inventory.dto.CategoryResponse;
import com.github.rahulstech.smarterp.inventory.dto.CreateCategoryRequest;
import com.github.rahulstech.smarterp.inventory.model.CategoryEntity;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public CategoryEntity toEntity(CreateCategoryRequest request) {
        if (request == null) {
            return null;
        }
        CategoryEntity entity = new CategoryEntity();
        entity.setName(request.name());
        return entity;
    }

    public CategoryResponse toResponse(CategoryEntity entity) {
        if (entity == null) {
            return null;
        }
        return CategoryResponse.builder()
                .id(entity.getId())
                .companyId(entity.getCompany() != null ? entity.getCompany().getId() : null)
                .name(entity.getName())
                .build();
    }
}
