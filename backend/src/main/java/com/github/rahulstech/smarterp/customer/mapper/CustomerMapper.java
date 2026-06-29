package com.github.rahulstech.smarterp.customer.mapper;

import com.github.rahulstech.smarterp.common.model.Address;
import com.github.rahulstech.smarterp.customer.dto.CreateCustomerRequest;
import com.github.rahulstech.smarterp.customer.dto.CustomerResponse;
import com.github.rahulstech.smarterp.customer.model.CustomerEntity;
import org.springframework.stereotype.Component;

/**
 * Maps Customer data between persistence entities and DTO records.
 */
@Component
public class CustomerMapper {

    /**
     * Converts a creation request DTO into a database entity,
     * nesting flat address fields into a single Address embeddable.
     */
    public CustomerEntity toEntity(CreateCustomerRequest request) {
        if (request == null) {
            return null;
        }

        CustomerEntity entity = new CustomerEntity();
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

        return entity;
    }

    /**
     * Converts a database entity into a response DTO record,
     * flattening the Address embeddable fields.
     */
    public CustomerResponse toResponse(CustomerEntity entity) {
        if (entity == null) {
            return null;
        }

        return CustomerResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .phone(entity.getPhone())
                .email(entity.getEmail())
                .currentBalance(entity.getCurrentBalance())
                .openingBalance(entity.getOpeningBalance())
                .address(entity.getAddress() != null ? entity.getAddress().getAddress() : null)
                .city(entity.getAddress() != null ? entity.getAddress().getCity() : null)
                .state(entity.getAddress() != null ? entity.getAddress().getState() : null)
                .pincode(entity.getAddress() != null ? entity.getAddress().getPincode() : null)
                .country(entity.getAddress() != null ? entity.getAddress().getCountry() : null)
                .build();
    }
}
