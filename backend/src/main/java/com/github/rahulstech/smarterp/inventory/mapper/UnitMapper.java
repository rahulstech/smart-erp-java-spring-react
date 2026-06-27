package com.github.rahulstech.smarterp.inventory.mapper;

import com.github.rahulstech.smarterp.inventory.dto.CreateUnitItemRequest;
import com.github.rahulstech.smarterp.inventory.dto.UnitResponse;
import com.github.rahulstech.smarterp.inventory.model.UnitEntity;
import org.springframework.stereotype.Component;

@Component
public class UnitMapper {

    public UnitEntity toEntity(CreateUnitItemRequest request) {
        if (request == null) {
            return null;
        }
        UnitEntity entity = new UnitEntity();
        entity.setName(request.name());
        entity.setSymbol(request.symbol());
        return entity;
    }

    public UnitResponse toResponse(UnitEntity entity) {
        if (entity == null) {
            return null;
        }
        return UnitResponse.builder()
                .id(entity.getId())
                .companyId(entity.getCompany() != null ? entity.getCompany().getId() : null)
                .name(entity.getName())
                .symbol(entity.getSymbol())
                .build();
    }
}
