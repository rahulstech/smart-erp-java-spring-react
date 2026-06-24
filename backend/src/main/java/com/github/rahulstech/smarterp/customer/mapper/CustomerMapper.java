package com.github.rahulstech.smarterp.customer.mapper;

import com.github.rahulstech.smarterp.common.model.Address;
import com.github.rahulstech.smarterp.customer.dto.CreateCustomerRequest;
import com.github.rahulstech.smarterp.customer.dto.CustomerResponse;
import com.github.rahulstech.smarterp.customer.model.CustomerEntity;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapper {

    public CustomerEntity toEntity(CreateCustomerRequest request) {
        if (request == null) {
            return null;
        }

        CustomerEntity entity = new CustomerEntity();
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

        return entity;
    }

    public CustomerResponse toResponse(CustomerEntity entity) {
        if (entity == null) {
            return null;
        }

        CustomerResponse response = new CustomerResponse();
        response.setId(entity.getId());
        response.setName(entity.getName());
        response.setPhone(entity.getPhone());
        response.setEmail(entity.getEmail());
        response.setCurrentBalance(entity.getCurrentBalance());

        if (entity.getAddress() != null) {
            response.setCity(entity.getAddress().getCity());
            response.setState(entity.getAddress().getState());
        }

        return response;
    }
}
