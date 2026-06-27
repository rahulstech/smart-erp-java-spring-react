package com.github.rahulstech.smarterp.inventory.model;

import com.github.rahulstech.smarterp.common.model.BaseEntity;
import com.github.rahulstech.smarterp.company.model.CompanyEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "units", uniqueConstraints = {
    @UniqueConstraint(name = "uq_units_company_symbol", columnNames = {"company_id", "symbol"})
})
public class UnitEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private CompanyEntity company;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "symbol", nullable = false)
    private String symbol;
}
