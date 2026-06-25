package com.github.rahulstech.smarterp.customer.controller;

import com.github.rahulstech.smarterp.customer.dto.CreateCustomerRequest;
import com.github.rahulstech.smarterp.customer.dto.CustomerResponse;
import com.github.rahulstech.smarterp.customer.dto.UpdateCustomerRequest;
import com.github.rahulstech.smarterp.customer.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Handles HTTP requests for managing customers associated with a specific company.
 * Returns response payloads directly for standard 200 OK operations,
 * using ResponseEntity wrappers only for custom status codes like 201 or 204.
 */
@CrossOrigin
@RestController
@RequestMapping("/api/companies/{company_id}/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    /**
     * Creates a new customer within a company. Enforces request body validation.
     */
    @PostMapping
    public ResponseEntity<@NonNull CustomerResponse> createCustomer(
            @PathVariable("company_id") UUID companyId,
            @Valid @RequestBody CreateCustomerRequest request) {
        CustomerResponse response = customerService.createCustomer(companyId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Updates an existing customer's details.
     */
    @PutMapping("/{customerId}")
    public CustomerResponse updateCustomer(
            @PathVariable("customerId") UUID customerId,
            @Valid @RequestBody UpdateCustomerRequest request) {
        return customerService.updateCustomer(customerId, request);
    }

    /**
     * Retrieves details for a specific customer.
     */
    @GetMapping("/{customerId}")
    public CustomerResponse getCustomer(
            @PathVariable("customerId") UUID customerId
    ) {
        return customerService.getCustomer(customerId);
    }

    /**
     * Retrieves all customers of a company, supporting optional search keyword matching.
     */
    @GetMapping
    public List<CustomerResponse> getCustomers(
            @PathVariable("company_id") UUID companyId,
            @RequestParam(value = "keyword", required = false) String keyword) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            return customerService.searchCustomers(keyword, companyId);
        }
        return customerService.getCustomers(companyId);
    }

    /**
     * Deletes a customer by ID and returns no content.
     */
    @DeleteMapping("/{customerId}")
    public ResponseEntity<@NonNull Void> deleteCustomer(
            @PathVariable("customerId") UUID customerId) {
        customerService.deleteCustomer(customerId);
        return ResponseEntity.noContent().build();
    }
}
