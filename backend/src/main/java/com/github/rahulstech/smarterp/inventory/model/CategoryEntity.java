package com.github.rahulstech.smarterp.inventory.model;

import com.github.rahulstech.smarterp.common.model.BaseEntity;
import com.github.rahulstech.smarterp.company.model.CompanyEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "categories", uniqueConstraints = {
    @UniqueConstraint(name = "uq_categories_company_name", columnNames = {"company_id", "name"})
})
public class CategoryEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private CompanyEntity company;

    @Column(name = "name", nullable = false)
    private String name;
}
