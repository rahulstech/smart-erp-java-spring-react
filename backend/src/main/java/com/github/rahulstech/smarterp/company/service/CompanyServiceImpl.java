package com.github.rahulstech.smarterp.company.service;

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

/**
 * Service implementation for managing Company entities.
 * Restricts all read/write actions to companies owned by the currently authenticated user.
 */
@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;
    private final CompanyMapper companyMapper;

    /**
     * Creates a new company owned by the currently authenticated user.
     */
    @Override
    @Transactional
    public CompanyResponse createCompany(String userId, CreateCompanyRequest request) {
        CompanyEntity entity = companyMapper.toEntity(request);
        entity.setOwnerId(userId);
        CompanyEntity saved = companyRepository.saveAndFlush(entity);
        return companyMapper.toResponse(saved);
    }

    /**
     * Updates an existing company's properties.
     * Throws an HttpException if the company does not exist or is not owned by the current user.
     */
    @Override
    @Transactional
    public CompanyResponse updateCompany(UUID companyId, UpdateCompanyRequest request) {
        CompanyEntity entity = companyRepository.findById(companyId)
                .orElseThrow(() -> HttpException.notFound("Company with id " + companyId + " not found"));

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

        CompanyEntity updated = companyRepository.saveAndFlush(entity);
        return companyMapper.toResponse(updated);
    }

    /**
     * Deletes a company owned by the current user.
     */
    @Override
    @Transactional
    public void deleteCompany(UUID companyId) {
        companyRepository.deleteById(companyId);
    }

    /**
     * Retrieves a single company owned by the current user.
     */
    @Override
    @Transactional(readOnly = true)
    public CompanyResponse getCompany(UUID companyId) {
        CompanyEntity entity = companyRepository.findById(companyId)
                .orElseThrow(() -> HttpException.notFound("Company with id " + companyId + " not found"));

        return companyMapper.toResponse(entity);
    }

    /**
     * Retrieves all companies owned by the current user.
     */
    @Override
    @Transactional(readOnly = true)
    public List<CompanyResponse> getAllCompanies(String ownerId) {
        List<CompanyEntity> companies = companyRepository.findByOwnerId(ownerId);
        return companies.stream()
                .map(companyMapper::toResponse)
                .collect(Collectors.toList());
    }
}
