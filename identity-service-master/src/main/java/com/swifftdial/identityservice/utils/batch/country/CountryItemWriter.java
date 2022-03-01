package com.swifftdial.identityservice.utils.batch.country;

import com.swifftdial.identityservice.domains.Country;
import com.swifftdial.identityservice.services.CountryService;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

/**
 * Created by gathigai on 11/10/16.
 */
public class CountryItemWriter implements ItemWriter<Country>, InitializingBean {

    @Autowired
    private CountryService countryService;

    @Override
    public void write(List<? extends Country> items) throws Exception {
        countryService.createNewCountries(items);
    }

    @Override
    public void afterPropertiesSet() throws Exception {}
}
