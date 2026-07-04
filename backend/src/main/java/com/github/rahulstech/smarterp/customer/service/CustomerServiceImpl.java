package com.github.rahulstech.smarterp.customer.service;

import com.github.rahulstech.smarterp.common.exception.HttpException;
import com.github.rahulstech.smarterp.common.model.Address;
import com.github.rahulstech.smarterp.customer.dto.CreateCustomerRequest;
import com.github.rahulstech.smarterp.customer.dto.CustomerResponse;
import com.github.rahulstech.smarterp.customer.dto.UpdateCustomerRequest;
import com.github.rahulstech.smarterp.customer.mapper.CustomerMapper;
import com.github.rahulstech.smarterp.customer.model.CustomerEntity;
import com.github.rahulstech.smarterp.customer.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service implementation for managing Customer entities.
 * Ensures customers are created and modified within the scope of a specific company.
 */
@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    /**
     * Creates a customer linked to the specified company.
     * Sets the customer's current balance to their opening balance upon creation.
     */
    @Override
    @Transactional
    public CustomerResponse createCustomer(UUID companyId, CreateCustomerRequest request) {
        CustomerEntity entity = customerMapper.toEntity(request);
        entity.setCompanyId(companyId);
        entity.setCurrentBalance(request.openingBalance());

        CustomerEntity saved = customerRepository.saveAndFlush(entity);
        return customerMapper.toResponse(saved);
    }

    /**
     * Updates customer properties.
     * Throws an HttpException if the customer does not exist in the company context.
     */
    @Override
    @Transactional
    public CustomerResponse updateCustomer(UUID customerId, UpdateCustomerRequest request) {
        CustomerEntity entity = customerRepository.findById(customerId)
                .orElseThrow(() -> HttpException.notFound("Customer with id " + customerId + " not found in current company"));

        entity.setName(request.name());
        entity.setPhone(request.phone());
        entity.setEmail(request.email());
        entity.setOpeningBalance(request.openingBalance());

        Address address = new Address(
                request.address(),
                request.city(),
                request.state(),
                request.pincode(),
                request.country()
        );
        entity.setAddress(address);

        CustomerEntity updated = customerRepository.saveAndFlush(entity);
        return customerMapper.toResponse(updated);
    }

    /**
     * Deletes a customer by ID.
     */
    @Override
    @Transactional
    public void deleteCustomer(UUID customerId) {
        CustomerEntity entity = customerRepository.findById(customerId)
                .orElseThrow(() -> HttpException.notFound("Customer with id " + customerId + " not found in current company"));

        customerRepository.delete(entity);
    }

    /**
     * Retrieves customer details by ID.
     */
    @Override
    @Transactional(readOnly = true)
    public CustomerResponse getCustomer(UUID customerId) {
        CustomerEntity entity = customerRepository.findById(customerId)
                .orElseThrow(() -> HttpException.notFound("Customer with id " + customerId + " not found in current company"));

        return customerMapper.toResponse(entity);
    }

    /**
     * Retrieves all customers belonging to the specified company.
     */
    @Override
    @Transactional(readOnly = true)
    public List<CustomerResponse> getCustomers(UUID companyId) {
        List<CustomerEntity> entities = customerRepository.findByCompanyId(companyId);
        return entities.stream()
                .map(customerMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Performs a case-insensitive search for customers inside the company matching the keyword.
     */
    @Override
    @Transactional(readOnly = true)
    public List<CustomerResponse> searchCustomers(String keyword, UUID companyId) {
        List<CustomerEntity> entities = customerRepository.findByCompanyIdAndNameContainingIgnoreCase(companyId, keyword);
        return entities.stream()
                .map(customerMapper::toResponse)
                .collect(Collectors.toList());
    }
}
