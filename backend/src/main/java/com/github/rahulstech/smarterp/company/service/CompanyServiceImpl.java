package com.github.rahulstech.smarterp.company.service;

import com.github.rahulstech.smarterp.common.provider.CurrentUserProvider;
import com.github.rahulstech.smarterp.common.model.Address;
import com.github.rahulstech.smarterp.company.dto.CompanyResponse;
import com.github.rahulstech.smarterp.company.dto.CreateCompanyRequest;
import com.github.rahulstech.smarterp.company.dto.UpdateCompanyRequest;
import com.github.rahulstech.smarterp.common.exception.HttpException;
import com.github.rahulstech.smarterp.company.mapper.CompanyMapper;
import com.github.rahulstech.smarterp.company.model.CompanyEntity;
import com.github.rahulstech.smarterp.company.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;
    private final CompanyMapper companyMapper;
    private final CurrentUserProvider currentUserProvider;

    @Override
    @Transactional
    public CompanyResponse createCompany(CreateCompanyRequest request) {
        CompanyEntity entity = companyMapper.toEntity(request);
        entity.setOwnerId(currentUserProvider.getCurrentUserId());
        entity.setActive(true);
        CompanyEntity saved = companyRepository.saveAndFlush(entity);
        return companyMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public CompanyResponse updateCompany(UUID companyId, UpdateCompanyRequest request) {
        String ownerId = currentUserProvider.getCurrentUserId();
        CompanyEntity entity = companyRepository.findByIdAndOwnerId(companyId, ownerId)
                .orElseThrow(() -> HttpException.notFound("Company with id " + companyId + " not found"));

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

        CompanyEntity updated = companyRepository.saveAndFlush(entity);
        return companyMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteCompany(UUID companyId) {
        String ownerId = currentUserProvider.getCurrentUserId();
        CompanyEntity entity = companyRepository.findByIdAndOwnerId(companyId, ownerId)
                .orElseThrow(() -> HttpException.notFound("Company with id " + companyId + " not found"));

        companyRepository.delete(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyResponse getCompany(UUID companyId) {
        String ownerId = currentUserProvider.getCurrentUserId();
        CompanyEntity entity = companyRepository.findByIdAndOwnerId(companyId, ownerId)
                .orElseThrow(() -> HttpException.notFound("Company with id " + companyId + " not found"));

        return companyMapper.toResponse(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompanyResponse> getAllCompanies() {
        String ownerId = currentUserProvider.getCurrentUserId();
        List<CompanyEntity> companies = companyRepository.findByOwnerId(ownerId);
        return companies.stream()
                .map(companyMapper::toResponse)
                .collect(Collectors.toList());
    }
}
