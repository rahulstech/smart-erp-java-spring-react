package com.github.rahulstech.smarterp.inventory.service;

import com.github.rahulstech.smarterp.common.exception.HttpException;
import com.github.rahulstech.smarterp.company.model.CompanyEntity;
import com.github.rahulstech.smarterp.company.repository.CompanyRepository;
import com.github.rahulstech.smarterp.inventory.dto.CreateUnitItemRequest;
import com.github.rahulstech.smarterp.inventory.dto.UnitResponse;
import com.github.rahulstech.smarterp.inventory.dto.UpdateUnitRequest;
import com.github.rahulstech.smarterp.inventory.mapper.UnitMapper;
import com.github.rahulstech.smarterp.inventory.model.UnitEntity;
import com.github.rahulstech.smarterp.inventory.repository.UnitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UnitServiceImpl implements UnitService {

    private final UnitRepository unitRepository;
    private final UnitMapper unitMapper;
    private final CompanyRepository companyRepository;

    @Override
    @Transactional
    public UnitResponse create(UUID companyId, CreateUnitItemRequest request) {
        CompanyEntity company = companyRepository.findById(companyId)
                .orElseThrow(() -> HttpException.notFound("Company with id " + companyId + " not found"));

        if (unitRepository.existsByCompanyIdAndNameIgnoreCase(companyId, request.name())) {
            throw HttpException.badRequest("Unit with name " + request.name() + " already exists");
        }
        if (unitRepository.existsByCompanyIdAndSymbolIgnoreCase(companyId, request.symbol())) {
            throw HttpException.badRequest("Unit with symbol " + request.symbol() + " already exists");
        }

        UnitEntity entity = unitMapper.toEntity(request);
        entity.setCompany(company);

        UnitEntity saved = unitRepository.saveAndFlush(entity);
        return unitMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public UnitResponse update(UUID companyId, UUID unitId, UpdateUnitRequest request) {
        UnitEntity entity = unitRepository.findByIdAndCompanyId(unitId, companyId)
                .orElseThrow(() -> HttpException.notFound("Unit with id " + unitId + " not found in current company"));

        if (!entity.getName().equalsIgnoreCase(request.name()) &&
                unitRepository.existsByCompanyIdAndNameIgnoreCase(companyId, request.name())) {
            throw HttpException.badRequest("Unit with name " + request.name() + " already exists");
        }
        if (!entity.getSymbol().equalsIgnoreCase(request.symbol()) &&
                unitRepository.existsByCompanyIdAndSymbolIgnoreCase(companyId, request.symbol())) {
            throw HttpException.badRequest("Unit with symbol " + request.symbol() + " already exists");
        }

        entity.setName(request.name());
        entity.setSymbol(request.symbol());

        UnitEntity updated = unitRepository.saveAndFlush(entity);
        return unitMapper.toResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public UnitResponse getById(UUID companyId, UUID unitId) {
        UnitEntity entity = unitRepository.findByIdAndCompanyId(unitId, companyId)
                .orElseThrow(() -> HttpException.notFound("Unit with id " + unitId + " not found in current company"));
        return unitMapper.toResponse(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UnitResponse> getAll(UUID companyId) {
        List<UnitEntity> entities = unitRepository.findByCompanyId(companyId);
        return entities.stream()
                .map(unitMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public void delete(UUID companyId, UUID unitId) {
        UnitEntity entity = unitRepository.findByIdAndCompanyId(unitId, companyId)
                .orElseThrow(() -> HttpException.notFound("Unit with id " + unitId + " not found in current company"));
        unitRepository.delete(entity);
    }
}
