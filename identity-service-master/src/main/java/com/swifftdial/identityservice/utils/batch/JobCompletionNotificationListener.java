package com.swifftdial.identityservice.utils.batch;

import com.swifftdial.identityservice.services.PrivilegeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.core.BatchStatus;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.listener.JobExecutionListenerSupport;
import org.springframework.stereotype.Component;

@Component
public class JobCompletionNotificationListener extends JobExecutionListenerSupport {

    private static final Logger logger = LoggerFactory.getLogger(JobCompletionNotificationListener.class);

    private final PrivilegeService privilegeService;

    public JobCompletionNotificationListener(PrivilegeService privilegeService) {
        this.privilegeService = privilegeService;
    }

    @Override
    public void afterJob(JobExecution jobExecution) {
        if(jobExecution.getStatus().equals(BatchStatus.COMPLETED)) {
            logger.info("**********************************************************");
            logger.info("> Privileges loading job finished! Imported :: " + privilegeService.countPrivileges() + " records");
            logger.info("**********************************************************");
        }
    }

}
