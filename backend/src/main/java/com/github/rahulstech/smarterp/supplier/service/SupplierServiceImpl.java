package com.github.rahulstech.smarterp.supplier.service;

import com.github.rahulstech.smarterp.common.exception.HttpException;
import com.github.rahulstech.smarterp.common.model.Address;
import com.github.rahulstech.smarterp.company.model.CompanyEntity;
import com.github.rahulstech.smarterp.company.repository.CompanyRepository;
import com.github.rahulstech.smarterp.supplier.dto.CreateSupplierRequest;
import com.github.rahulstech.smarterp.supplier.dto.SupplierResponse;
import com.github.rahulstech.smarterp.supplier.dto.UpdateSupplierRequest;
import com.github.rahulstech.smarterp.supplier.mapper.SupplierMapper;
import com.github.rahulstech.smarterp.supplier.model.SupplierEntity;
import com.github.rahulstech.smarterp.supplier.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * Service implementation for managing Supplier master data.
 * Restricts all read and write operations to the active company context to enforce tenant isolation.
 */
@Service
@RequiredArgsConstructor
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;
    private final SupplierMapper supplierMapper;
    private final CompanyRepository companyRepository;

    /**
     * Registers a new supplier in the specified company context.
     * Validates that the company exists and the supplier code is unique within that company.
     */
    @Override
    @Transactional
    public SupplierResponse create(UUID companyId, CreateSupplierRequest request) {
        CompanyEntity company = companyRepository.findById(companyId)
                .orElseThrow(() -> HttpException.notFound("Company with id " + companyId + " not found"));

        if (supplierRepository.existsByCompanyIdAndSupplierCodeIgnoreCase(companyId, request.code())) {
            throw HttpException.badRequest("Supplier code " + request.code() + " already exists in the company");
        }

        SupplierEntity entity = supplierMapper.toEntity(request);
        entity.setCompanyId(companyId);

        BigDecimal openingBal = request.openingBalance() != null ? request.openingBalance() : BigDecimal.ZERO;
        entity.setOpeningBalance(openingBal);
        entity.setOutstandingAmount(openingBal);

        SupplierEntity saved = supplierRepository.saveAndFlush(entity);
        return supplierMapper.toResponse(saved);
    }

    /**
     * Updates editable fields of an existing supplier.
     * Prevents changes to supplierCode, company, openingBalance, and outstandingAmount.
     */
    @Override
    @Transactional
    public SupplierResponse update(UUID companyId, UUID supplierId, UpdateSupplierRequest request) {
        SupplierEntity entity = supplierRepository.findByIdAndCompanyId(supplierId, companyId)
                .orElseThrow(() -> HttpException.notFound("Supplier with id " + supplierId + " not found in current company"));

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

        SupplierEntity updated = supplierRepository.saveAndFlush(entity);
        return supplierMapper.toResponse(updated);
    }

    /**
     * Fetches details of a single supplier. Enforces company boundary.
     */
    @Override
    @Transactional(readOnly = true)
    public SupplierResponse getById(UUID companyId, UUID supplierId) {
        SupplierEntity entity = supplierRepository.findByIdAndCompanyId(supplierId, companyId)
                .orElseThrow(() -> HttpException.notFound("Supplier with id " + supplierId + " not found in current company"));
        return supplierMapper.toResponse(entity);
    }

    /**
     * Lists all suppliers registered under the specified company.
     */
    @Override
    @Transactional(readOnly = true)
    public List<SupplierResponse> getAll(UUID companyId) {
        List<SupplierEntity> entities = supplierRepository.findByCompanyIdOrderByCreatedAtDesc(companyId);
        return entities.stream()
                .map(supplierMapper::toResponse)
                .toList();
    }

    /**
     * Searches for suppliers in the specified company matching the name search keyword.
     */
    @Override
    @Transactional(readOnly = true)
    public List<SupplierResponse> search(UUID companyId, String keyword) {
        List<SupplierEntity> entities = supplierRepository.findByCompanyIdAndNameStartingWithIgnoreCaseOrderByCreatedAtDesc(companyId, keyword);
        return entities.stream()
                .map(supplierMapper::toResponse)
                .toList();
    }

    /**
     * Deletes a supplier by ID within the current company boundary.
     */
    @Override
    @Transactional
    public void delete(UUID companyId, UUID supplierId) {
        SupplierEntity entity = supplierRepository.findByIdAndCompanyId(supplierId, companyId)
                .orElseThrow(() -> HttpException.notFound("Supplier with id " + supplierId + " not found in current company"));
        supplierRepository.delete(entity);
    }

}
