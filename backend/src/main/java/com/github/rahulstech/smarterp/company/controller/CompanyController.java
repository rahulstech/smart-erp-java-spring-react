package com.github.rahulstech.smarterp.company.controller;

import com.github.rahulstech.smarterp.auth.security.AuthenticatedUser;
import com.github.rahulstech.smarterp.company.dto.CompanyResponse;
import com.github.rahulstech.smarterp.company.dto.CreateCompanyRequest;
import com.github.rahulstech.smarterp.company.dto.UpdateCompanyRequest;
import com.github.rahulstech.smarterp.company.service.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Handles HTTP requests for managing companies.
 * Returns response payloads directly for standard 200 OK operations, 
 * using ResponseEntity wrappers only for custom status codes like 201 or 204.
 */
@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    /**
     * Creates a new company. Enforces request body validation.
     */
    @PostMapping
    public ResponseEntity<@NonNull CompanyResponse> createCompany(Authentication auth, @Valid @RequestBody CreateCompanyRequest request) {
        AuthenticatedUser principal = (AuthenticatedUser) auth.getPrincipal();
        CompanyResponse response = companyService.createCompany(principal.userId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Updates an existing company's details.
     */
    @PutMapping("/{companyId}")
    public CompanyResponse updateCompany(
            @PathVariable("companyId") UUID companyId,
            @Valid @RequestBody UpdateCompanyRequest request) {
        return companyService.updateCompany(companyId, request);
    }

    /**
     * Retrieves details for a specific company by ID.
     */
    @GetMapping("/{companyId}")
    public CompanyResponse getCompany(@PathVariable("companyId") UUID companyId) {
        return companyService.getCompany(companyId);
    }

    /**
     * Retrieves all companies in the system.
     */
    @GetMapping
    public List<CompanyResponse> getAllCompanies(Authentication auth) {
        AuthenticatedUser principal = (AuthenticatedUser) auth.getPrincipal();
        return companyService.getAllCompanies(principal.userId());
    }

    /**
     * Deletes a company by ID and returns no content.
     */
    @DeleteMapping("/{companyId}")
    public ResponseEntity<@NonNull Void> deleteCompany(@PathVariable("companyId") UUID companyId) {
        companyService.deleteCompany(companyId);
        return ResponseEntity.noContent().build();
    }
}
