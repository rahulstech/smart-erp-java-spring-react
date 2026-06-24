package com.github.rahulstech.smarterp.customer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCustomerRequest {
    private String name;
    private String phone;
    private String email;

    private String address;
    private String city;
    private String state;
    private String pincode;
    private String country;

    private BigDecimal openingBalance;
}
