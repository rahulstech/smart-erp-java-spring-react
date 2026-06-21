package com.github.rahulstech.smarterp.company.service;

import com.github.rahulstech.smarterp.company.dto.CompanyResponse;
import com.github.rahulstech.smarterp.company.dto.CreateCompanyRequest;
import com.github.rahulstech.smarterp.company.dto.UpdateCompanyRequest;

import java.util.List;
import java.util.UUID;

public interface CompanyService {

    CompanyResponse createCompany(CreateCompanyRequest request);

    CompanyResponse updateCompany(UUID companyId, UpdateCompanyRequest request);

    void deleteCompany(UUID companyId);

    CompanyResponse getCompany(UUID companyId);

    List<CompanyResponse> getAllCompanies();
}
