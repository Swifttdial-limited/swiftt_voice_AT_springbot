package com.swifftdial.identityservice.services;


import com.swifftdial.identityservice.domains.Country;
import com.swifftdial.identityservice.repositories.CountryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Created by gathigai on 12/2/16.
 */
public abstract class CountryService extends CRUDAbstractService<Country, CountryRepository> {
    public CountryService(CountryRepository countryRepository, Country country) {
        super(country, countryRepository);
    }

    abstract public Page<Country> fetchCountriesContaining(String countryName, Pageable pageable);

    abstract public Long countCountries();

    abstract public void createNewCountries(List<? extends Country> items);

    public abstract List<Country> fetchAll();
}
