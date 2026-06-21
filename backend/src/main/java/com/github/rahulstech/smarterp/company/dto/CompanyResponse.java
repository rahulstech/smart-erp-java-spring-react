package com.github.rahulstech.smarterp.company.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyResponse {
    private UUID id;
    private String name;
    private String phone;
    private String email;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String country;
    private String gstNumber;
    private OffsetDateTime createdAt;
}
