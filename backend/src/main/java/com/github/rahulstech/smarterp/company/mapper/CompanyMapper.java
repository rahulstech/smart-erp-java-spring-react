package com.github.rahulstech.smarterp.company.mapper;

import com.github.rahulstech.smarterp.common.model.Address;
import com.github.rahulstech.smarterp.company.dto.CreateCompanyRequest;
import com.github.rahulstech.smarterp.company.dto.CompanyResponse;
import com.github.rahulstech.smarterp.company.model.CompanyEntity;
import org.springframework.stereotype.Component;

/**
 * Maps Company data between persistence entities and DTO records.
 */
@Component
public class CompanyMapper {

    /**
     * Converts a creation request DTO into a database entity, 
     * nesting the flat address fields into a single Address embeddable.
     */
    public CompanyEntity toEntity(CreateCompanyRequest request) {
        if (request == null) {
            return null;
        }

        CompanyEntity entity = new CompanyEntity();
        entity.setName(request.name());
        entity.setPhone(request.phone());
        entity.setEmail(request.email());
        entity.setGstNumber(request.gstNumber());

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
    public CompanyResponse toResponse(CompanyEntity entity) {
        if (entity == null) {
            return null;
        }

        return CompanyResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .phone(entity.getPhone())
                .email(entity.getEmail())
                .gstNumber(entity.getGstNumber())
                .createdAt(entity.getCreatedAt())
                .address(entity.getAddress() != null ? entity.getAddress().getAddress() : null)
                .city(entity.getAddress() != null ? entity.getAddress().getCity() : null)
                .state(entity.getAddress() != null ? entity.getAddress().getState() : null)
                .pincode(entity.getAddress() != null ? entity.getAddress().getPincode() : null)
                .country(entity.getAddress() != null ? entity.getAddress().getCountry() : null)
                .build();
    }
}
