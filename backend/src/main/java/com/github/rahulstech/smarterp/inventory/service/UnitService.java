package com.github.rahulstech.smarterp.inventory.service;

import com.github.rahulstech.smarterp.inventory.dto.CreateUnitItemRequest;
import com.github.rahulstech.smarterp.inventory.dto.UnitResponse;
import com.github.rahulstech.smarterp.inventory.dto.UpdateUnitRequest;
import java.util.List;
import java.util.UUID;

public interface UnitService {

    UnitResponse create(UUID companyId, CreateUnitItemRequest request);

    UnitResponse update(UUID companyId, UUID unitId, UpdateUnitRequest request);

    UnitResponse getById(UUID companyId, UUID unitId);

    List<UnitResponse> getAll(UUID companyId);

    void delete(UUID companyId, UUID unitId);
}
