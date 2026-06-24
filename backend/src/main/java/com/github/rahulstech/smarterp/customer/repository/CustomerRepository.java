package com.github.rahulstech.smarterp.customer.repository;

import com.github.rahulstech.smarterp.customer.model.CustomerEntity;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CustomerRepository extends JpaRepository<@NonNull CustomerEntity, @NonNull UUID> {

    List<CustomerEntity> findByCompanyId(UUID companyId);

    List<CustomerEntity> findByCompanyIdAndNameContainingIgnoreCase(UUID companyId, String keyword);
}
