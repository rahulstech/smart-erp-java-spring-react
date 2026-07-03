package com.github.rahulstech.smarterp.common.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class Address {

    @Column
    private String address;

    @Column
    private String city;

    @Column
    private String state;

    @Column
    private String pincode;

    @Column
    private String country;

    /**
     * Builds and returns a formatted full address string.
     * Format: address, city, state, country, pin (pincode).
     * If any field does not exist or is empty, it is skipped.
     */
    public String buildFullAddress() {
        java.util.List<String> parts = new java.util.ArrayList<>();
        if (address != null && !address.trim().isEmpty()) {
            parts.add(address.trim());
        }
        if (city != null && !city.trim().isEmpty()) {
            parts.add(city.trim());
        }
        if (state != null && !state.trim().isEmpty()) {
            parts.add(state.trim());
        }
        if (country != null && !country.trim().isEmpty()) {
            parts.add(country.trim());
        }
        if (pincode != null && !pincode.trim().isEmpty()) {
            parts.add(pincode.trim());
        }
        return String.join(", ", parts);
    }
}
