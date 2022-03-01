package com.swifftdial.identityservice.web;

import com.swifftdial.identityservice.domains.Country;
import com.swifftdial.identityservice.services.CountryService;
import com.swifftdial.identityservice.utils.exceptions.BadRequestRestApiException;
import com.swifftdial.identityservice.utils.validators.Validators;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by gathigai on 12/2/16.
 */
@RestController
@RequestMapping("/countries")
public class CountryRestController {

    private final CountryService countryService;

    @Autowired
    public CountryRestController(CountryService countryService) {
        this.countryService = countryService;
    }

    @GetMapping
    public Page<Country> fetchCountries(@RequestParam(name = "searchQueryParam", required = false) String searchQueryParam,
                                        @PageableDefault(sort = "countryName", size = 20) Pageable pageable) {
        if(Validators.allNotEqualNull(searchQueryParam))
            if(searchQueryParam.length() < 3)
                throw new BadRequestRestApiException()
                        .developerMessage("Search Query Parameter must be longer than 2 characters")
                        .userMessage("Search Query Parameter must be longer than 2 characters");

        if(Validators.allNotEqualNull(searchQueryParam))
            return countryService.fetchCountriesContaining(searchQueryParam, pageable);
        else
            return countryService.fetchAll(pageable);

    }

}
