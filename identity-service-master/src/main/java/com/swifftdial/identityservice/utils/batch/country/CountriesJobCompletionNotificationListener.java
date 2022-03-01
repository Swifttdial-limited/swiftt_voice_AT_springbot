package com.swifftdial.identityservice.utils.batch.country;

import com.swifftdial.identityservice.services.CountryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.listener.JobExecutionListenerSupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Created by gathigai on 11/10/16.
 */
@Component
public class CountriesJobCompletionNotificationListener extends JobExecutionListenerSupport {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final CountryService countryService;

    @Autowired
    public CountriesJobCompletionNotificationListener(CountryService countryService) {
        this.countryService = countryService;
    }

    @Override
    public void afterJob(JobExecution jobExecution) {
        if(jobExecution.getStatus() == BatchStatus.COMPLETED) {
            logger.info("Imported :: " + countryService.countCountries() + " country records");
        }
    }

}
