package com.swifftdial.identityservice.domains.vo;

import com.swifftdial.identityservice.domains.User;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.util.UUID;

@Getter
@Setter
@ToString
@Embeddable
public class Country {

    @JsonView(User.CreatePatientView.class)
    @Column(name = "country_publicId")
    private UUID publicId;

    @JsonView(User.CreatePatientView.class)
    @Column(name = "country_name")
    private String countryName;

    @JsonView(User.CreatePatientView.class)
    @Column(name = "country_iso2")
    private String iso2;

    @JsonView(User.CreatePatientView.class)
    @Column(name = "country_iso3")
    private String iso3;

    @JsonView(User.CreatePatientView.class)
    @Column(name = "country_fips")
    private String fips;

    @JsonView(User.CreatePatientView.class)
    @Column(name = "country_phonecode")
    private String phoneCode;

}
