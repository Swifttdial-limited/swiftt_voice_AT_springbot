package com.swifftdial.identityservice.services;

import com.swifftdial.identityservice.domains.Country;
import com.swifftdial.identityservice.repositories.CountryRepository;
import com.swifftdial.identityservice.utils.validators.Validators;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by gathigai on 12/2/16.
 */
@Service
public class CountryServiceImpl extends CountryService {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final CountryRepository countryRepository;

    @Autowired
    public CountryServiceImpl(CountryRepository countryRepository) {
        super(countryRepository, new Country());
        this.countryRepository = countryRepository;
    }

    @Override
    public Page<Country> fetchCountriesContaining(String countryName, Pageable pageable) {
        return countryRepository.findByCountryNameContainingIgnoreCase(countryName, pageable);
    }

    @Override
    public Long countCountries() {
        return countryRepository.count();
    }

    @Override
    public void createNewCountries(List<? extends Country> items) {
        items.forEach(i -> {
            final Country foundCountry = countryRepository.findByIso2AndPhoneCode(i.getIso2(), i.getPhoneCode());

            if(Validators.allNotEqualNull(foundCountry)) {
                i.setId(foundCountry.getId());
                i.setVersion(foundCountry.getVersion());
                i.setPublicId(foundCountry.getPublicId());
            }

            countryRepository.save(i);
        });

    }

    @Override
    public List<Country> fetchAll() {
        return countryRepository.findAll();
    }
}
