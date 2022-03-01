package com.swifttdial.licenceservice.domains.vo;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Embedded;

@Getter
@Setter
@Embeddable
public class Address {

    @Embedded
    private Country country;

    @Column(name = "city")
    private String city;

    @Column(name = "postal_address")
    private String postalAddress;

    @Column(name = "postal_code")
    private String postalCode;

    @Column(name = "street_address")
    private String streetAddress;

    private Double latitude = 0.0;

    private Double longitude = 0.0;
}
