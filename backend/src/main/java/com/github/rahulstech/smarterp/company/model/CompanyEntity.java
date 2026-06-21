package com.github.rahulstech.smarterp.company.model;

import com.github.rahulstech.smarterp.common.model.Address;
import com.github.rahulstech.smarterp.common.model.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "companies")
public class CompanyEntity extends BaseEntity {

    @Column(name = "owner_id", nullable = false)
    private String ownerId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String email;

    @Embedded
    private Address address;

    @Column(name = "gst_number", nullable = false)
    private String gstNumber;

    @Column(nullable = false)
    private Boolean active = true;
}
