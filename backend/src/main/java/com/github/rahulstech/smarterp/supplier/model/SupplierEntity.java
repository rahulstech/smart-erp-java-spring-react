package com.github.rahulstech.smarterp.supplier.model;

import com.github.rahulstech.smarterp.common.model.Address;
import com.github.rahulstech.smarterp.common.model.BaseEntity;
import com.github.rahulstech.smarterp.company.model.CompanyEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Database entity representing a Supplier.
 * Scoped to a specific Company and enforces unique supplier codes within that company.
 */
@Getter
@Setter
@Entity
@Table(name = "suppliers", uniqueConstraints = {
    @UniqueConstraint(name = "uq_suppliers_company_code", columnNames = {"company_id", "supplier_code"})
})
public class SupplierEntity extends BaseEntity {

    @Column(name = "company_id", nullable = false, updatable = false)
    private UUID companyId;

    @Column(name = "supplier_code", nullable = false, length = 100)
    private String supplierCode;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "phone", length = 50)
    private String phone;

    @Column(name = "email")
    private String email;

    @Column(name = "gst_number", length = 50)
    private String gstNumber;

    // Overrides default NOT NULL constraints defined in Address embeddable.
    // This allows suppliers to be registered without contact address info.
    @Embedded
    private Address address;

    @Column(name = "opening_balance", nullable = false)
    private BigDecimal openingBalance;

    @Column(name = "outstanding_amount", nullable = false)
    private BigDecimal outstandingAmount;
}
