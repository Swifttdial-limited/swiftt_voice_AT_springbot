package com.swifftdial.identityservice.domains;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

/**
 * Created by gathigai on 12/2/16.
 */
@Getter
@Setter
@Entity
@Table(schema = "core", name = "countries")
public class Country extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "country_id")
    private Long id;

    @Column(name = "country_version")
    @Version
    private Long version;

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

    public Country() {}

    public Country(String countryName, String iso2, String iso3, Integer numeric, String phoneCode,
                   String currencyAlphabeticCode, String currencyCountryName, String currencyName) {
        super();
        this.countryName = countryName;
        this.iso2 = iso2;
        this.iso3 = iso3;
        this.numeric = numeric;
        this.phoneCode = phoneCode;
        this.currencyAlphabeticCode = currencyAlphabeticCode;
        this.currencyCountryName = currencyCountryName;
        this.currencyName = currencyName;
    }
}
