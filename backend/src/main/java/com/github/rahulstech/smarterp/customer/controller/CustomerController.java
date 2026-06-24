package com.github.rahulstech.smarterp.customer.controller;

import com.github.rahulstech.smarterp.customer.dto.CreateCustomerRequest;
import com.github.rahulstech.smarterp.customer.dto.CustomerResponse;
import com.github.rahulstech.smarterp.customer.dto.UpdateCustomerRequest;
import com.github.rahulstech.smarterp.customer.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@CrossOrigin
@RestController
@RequestMapping("/api/companies/{company_id}/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping
    public ResponseEntity<@NonNull CustomerResponse> createCustomer(
            @PathVariable("company_id") UUID companyId,
            @RequestBody CreateCustomerRequest request) {
        CustomerResponse response = customerService.createCustomer(companyId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{customerId}")
    public CustomerResponse updateCustomer(
            @PathVariable("customerId") UUID customerId,
            @RequestBody UpdateCustomerRequest request) {
        return customerService.updateCustomer(customerId, request);
    }

    @GetMapping("/{customerId}")
    public CustomerResponse getCustomer(
            @PathVariable("customerId") UUID customerId
    ) {
        return customerService.getCustomer(customerId);
    }

    @GetMapping
    public List<CustomerResponse> getCustomers(
            @PathVariable("company_id") UUID companyId,
            @RequestParam(value = "keyword", required = false) String keyword) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            return customerService.searchCustomers(keyword, companyId);
        }
        return customerService.getCustomers(companyId);
    }

    @DeleteMapping("/{customerId}")
    public ResponseEntity<@NonNull Void> deleteCustomer(
            @PathVariable("customerId") UUID customerId) {
        customerService.deleteCustomer(customerId);
        return ResponseEntity.noContent().build();
    }
}
