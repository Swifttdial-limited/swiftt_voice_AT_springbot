package com.swifftdial.identityservice.utils.batch.country;


import com.swifftdial.identityservice.domains.Country;
import org.springframework.batch.item.ItemProcessor;

/**
 * This is a processor to ingest data, transform it and pipe it out to db
 *
 * Created by gathigai on 11/10/16.
 */
public class CountryItemProcessor implements ItemProcessor<Country, Country> {

    @Override
    public Country process(final Country country) throws Exception {
        final String countryName = country.getCountryName();
        final String iso2 = country.getIso2();
        final String iso3 = country.getIso3();
        final Integer numeric = country.getNumeric();
        final String phoneCode = country.getPhoneCode();
        final String currencyAlphabeticCode = country.getCurrencyAlphabeticCode();
        final String currencyCountryName = country.getCurrencyCountryName();
        final String currencyName = country.getCurrencyName();

        return new Country(countryName, iso2, iso3, numeric, phoneCode, currencyAlphabeticCode, currencyCountryName, currencyName);
    }

}
