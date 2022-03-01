package com.swifftdial.identityservice.repositories;


import com.swifftdial.identityservice.domains.Country;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

/**
 * Created by gathigai on 12/2/16.
 */
public interface CountryRepository extends GenericJpaRepository<Country, Long> {
    Page<Country> findByCountryNameContainingIgnoreCase(@Param("countryName") String countryName, Pageable pageable);

    Country findByIso2AndPhoneCode(String iso2, String phoneCode);
}
