package com.github.rahulstech.smarterp.customer.service;

import com.github.rahulstech.smarterp.common.exception.HttpException;
import com.github.rahulstech.smarterp.common.model.Address;
import com.github.rahulstech.smarterp.common.provider.CurrentCompanyProvider;
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

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;
    private final CurrentCompanyProvider currentCompanyProvider;

    @Override
    @Transactional
    public CustomerResponse createCustomer(UUID companyId, CreateCustomerRequest request) {
        CustomerEntity entity = customerMapper.toEntity(request);
        entity.setCompanyId(companyId);
        entity.setCurrentBalance(request.getOpeningBalance());

        CustomerEntity saved = customerRepository.saveAndFlush(entity);
        return customerMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public CustomerResponse updateCustomer(UUID customerId, UpdateCustomerRequest request) {
        CustomerEntity entity = customerRepository.findById(customerId)
                .orElseThrow(() -> HttpException.notFound("Customer with id " + customerId + " not found in current company"));

        entity.setName(request.getName());
        entity.setPhone(request.getPhone());
        entity.setEmail(request.getEmail());
        entity.setOpeningBalance(request.getOpeningBalance());

        Address address = new Address(
                request.getAddress(),
                request.getCity(),
                request.getState(),
                request.getPincode(),
                request.getCountry()
        );
        entity.setAddress(address);

        CustomerEntity updated = customerRepository.saveAndFlush(entity);
        return customerMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteCustomer(UUID customerId) {
        CustomerEntity entity = customerRepository.findById(customerId)
                .orElseThrow(() -> HttpException.notFound("Customer with id " + customerId + " not found in current company"));

        customerRepository.delete(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponse getCustomer(UUID customerId) {
        CustomerEntity entity = customerRepository.findById(customerId)
                .orElseThrow(() -> HttpException.notFound("Customer with id " + customerId + " not found in current company"));

        return customerMapper.toResponse(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomerResponse> getCustomers(UUID companyId) {
        List<CustomerEntity> entities = customerRepository.findByCompanyId(companyId);
        return entities.stream()
                .map(customerMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomerResponse> searchCustomers(String keyword, UUID companyId) {
        List<CustomerEntity> entities = customerRepository.findByCompanyIdAndNameContainingIgnoreCase(companyId, keyword);
        return entities.stream()
                .map(customerMapper::toResponse)
                .collect(Collectors.toList());
    }
}
