package com.github.rahulstech.smarterp.supplier.mapper;

import com.github.rahulstech.smarterp.common.model.Address;
import com.github.rahulstech.smarterp.supplier.dto.CreateSupplierRequest;
import com.github.rahulstech.smarterp.supplier.dto.SupplierResponse;
import com.github.rahulstech.smarterp.supplier.model.SupplierEntity;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Maps Supplier data between database entities and DTO records.
 */
@Component
public class SupplierMapper {

    /**
     * Converts a creation request DTO into a database entity,
     * nesting flat address fields into a single Address embeddable.
     */
    public SupplierEntity toEntity(CreateSupplierRequest request) {
        if (request == null) {
            return null;
        }

        var openingBalance = request.openingBalance() == null ? BigDecimal.ZERO : request.openingBalance();

        SupplierEntity entity = new SupplierEntity();
        entity.setSupplierCode(request.code());
        entity.setName(request.name());
        entity.setPhone(request.phone());
        entity.setEmail(request.email());
        entity.setGstNumber(request.gstNumber());
        entity.setOpeningBalance(openingBalance);

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
    public SupplierResponse toResponse(SupplierEntity entity) {
        if (entity == null) {
            return null;
        }

        var address = entity.getAddress();

        return SupplierResponse.builder()
                .id(entity.getId())
                .companyId(entity.getCompanyId())
                .code(entity.getSupplierCode())
                .name(entity.getName())
                .phone(entity.getPhone())
                .email(entity.getEmail())
                .gstNumber(entity.getGstNumber())
                .address(address.getAddress())
                .city(address.getCity())
                .state(address.getState())
                .pincode(address.getPincode())
                .country(address.getCountry())
                .openingBalance(entity.getOpeningBalance())
                .outstandingAmount(entity.getOutstandingAmount())
                .build();
    }
}
