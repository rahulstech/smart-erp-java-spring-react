package com.github.rahulstech.smarterp.company.mapper;

import com.github.rahulstech.smarterp.common.model.Address;
import com.github.rahulstech.smarterp.company.dto.CreateCompanyRequest;
import com.github.rahulstech.smarterp.company.dto.CompanyResponse;
import com.github.rahulstech.smarterp.company.model.CompanyEntity;
import org.springframework.stereotype.Component;

@Component
public class CompanyMapper {

    public CompanyEntity toEntity(CreateCompanyRequest request) {
        if (request == null) {
            return null;
        }

        CompanyEntity entity = new CompanyEntity();
        entity.setName(request.getName());
        entity.setPhone(request.getPhone());
        entity.setEmail(request.getEmail());
        entity.setGstNumber(request.getGstNumber());

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

    public CompanyResponse toResponse(CompanyEntity entity) {
        if (entity == null) {
            return null;
        }

        CompanyResponse response = new CompanyResponse();
        response.setId(entity.getId());
        response.setName(entity.getName());
        response.setPhone(entity.getPhone());
        response.setEmail(entity.getEmail());
        response.setGstNumber(entity.getGstNumber());
        response.setCreatedAt(entity.getCreatedAt());

        if (entity.getAddress() != null) {
            response.setAddress(entity.getAddress().getAddress());
            response.setCity(entity.getAddress().getCity());
            response.setState(entity.getAddress().getState());
            response.setPincode(entity.getAddress().getPincode());
            response.setCountry(entity.getAddress().getCountry());
        }

        return response;
    }
}
