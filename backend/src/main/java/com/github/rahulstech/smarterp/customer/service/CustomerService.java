package com.github.rahulstech.smarterp.customer.service;

import com.github.rahulstech.smarterp.customer.dto.CreateCustomerRequest;
import com.github.rahulstech.smarterp.customer.dto.CustomerResponse;
import com.github.rahulstech.smarterp.customer.dto.UpdateCustomerRequest;

import java.util.List;
import java.util.UUID;

public interface CustomerService {

    CustomerResponse createCustomer(UUID companyId, CreateCustomerRequest request);

    CustomerResponse updateCustomer(UUID customerId, UpdateCustomerRequest request);

    void deleteCustomer(UUID customerId);

    CustomerResponse getCustomer(UUID customerId);

    List<CustomerResponse> getCustomers(UUID companyId);

    List<CustomerResponse> searchCustomers(String keyword, UUID companyId);
}
