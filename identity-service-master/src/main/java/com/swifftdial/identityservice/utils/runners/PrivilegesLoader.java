package com.swifftdial.identityservice.utils.runners;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameter;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@Order(800)
public class PrivilegesLoader implements CommandLineRunner {

    private final JobLauncher jobLauncher;
    private final Job importPrivilegesJob;

    public PrivilegesLoader(JobLauncher jobLauncher, Job importPrivilegesJob) {
        this.jobLauncher = jobLauncher;
        this.importPrivilegesJob = importPrivilegesJob;
    }

    @Override
    public void run(String... args) throws Exception {
        // start a batch job of importing all privileges
        jobLauncher.run(importPrivilegesJob, createInitialJobParameterMap());
    }

    private JobParameters createInitialJobParameterMap() {
        Map<String, JobParameter> m = new HashMap<>();
        m.put("time", new JobParameter(System.currentTimeMillis()));
        return new JobParameters(m);
    }
}
