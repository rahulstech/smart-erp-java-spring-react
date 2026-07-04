package com.github.rahulstech.smarterp.inventory.controller;

import com.github.rahulstech.smarterp.inventory.dto.CategoryResponse;
import com.github.rahulstech.smarterp.inventory.dto.CreateCategoryRequest;
import com.github.rahulstech.smarterp.inventory.dto.UpdateCategoryRequest;
import com.github.rahulstech.smarterp.inventory.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/companies/{companyId}/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<@NonNull CategoryResponse> createCategory(
            @PathVariable("companyId") UUID companyId,
            @Valid @RequestBody CreateCategoryRequest request) {
        CategoryResponse response = categoryService.create(companyId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{categoryId}")
    public CategoryResponse updateCategory(
            @PathVariable("companyId") UUID companyId,
            @PathVariable("categoryId") UUID categoryId,
            @Valid @RequestBody UpdateCategoryRequest request) {
        return categoryService.update(companyId, categoryId, request);
    }

    @GetMapping("/{categoryId}")
    public CategoryResponse getCategory(
            @PathVariable("companyId") UUID companyId,
            @PathVariable("categoryId") UUID categoryId) {
        return categoryService.getById(companyId, categoryId);
    }

    @GetMapping
    public List<CategoryResponse> getCategories(
            @PathVariable("companyId") UUID companyId) {
        return categoryService.getAll(companyId);
    }
}
