package com.swifttdial.licenceservice.domains.vo;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.validation.constraints.NotNull;
import java.util.UUID;

@Getter
@Setter
@Embeddable
public class Country {

    @Column(name = "country_public_id")
    public UUID publicId;

    @NotNull
    @Column(name = "country_name")
    private String countryName;

    @NotNull
    @Column(name = "country_iso2")
    private String iso2;

    @NotNull
    @Column(name = "country_iso3")
    private String iso3;

    @Column(name = "country_numeric")
    private Integer numeric;

    @NotNull
    @Column(name = "country_phonecode")
    private String phoneCode;

    @Column(name = "country_currencyalphabeticcode")
    private String currencyAlphabeticCode;

    @Column(name = "country_currencycountryname")
    private String currencyCountryName;

    @NotNull
    @Column(name = "country_currency")
    private String currencyName;

}
