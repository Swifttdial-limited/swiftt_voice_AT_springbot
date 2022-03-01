package com.swifftdial.identityservice.utils.runners;


import com.swifftdial.identityservice.repositories.CountryRepository;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameter;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@Order(700)
public class FactsBootstrap implements CommandLineRunner {

    private final JobLauncher jobLauncher;
    private final Job importCountriesJob;

    private final CountryRepository countryRepository;

    @Autowired
    public FactsBootstrap(JobLauncher jobLauncher, Job importCountriesJob,
                          CountryRepository countryRepository) {
        this.jobLauncher = jobLauncher;
        this.importCountriesJob = importCountriesJob;
        this.countryRepository = countryRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (countryRepository.count() < 249) {
            jobLauncher.run(importCountriesJob, createInitialJobParameterMap());
        }
    }

    private JobParameters createInitialJobParameterMap() {
        Map<String, JobParameter> m = new HashMap<>();
        m.put("time", new JobParameter(System.currentTimeMillis()));
        return new JobParameters(m);
    }
}
