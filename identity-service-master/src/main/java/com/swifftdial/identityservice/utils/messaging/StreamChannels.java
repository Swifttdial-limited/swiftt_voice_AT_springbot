package com.swifftdial.identityservice.utils.messaging;

import org.springframework.cloud.stream.annotation.Input;
import org.springframework.cloud.stream.annotation.Output;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.SubscribableChannel;

public interface StreamChannels {

    String AGENT_CREATED = "agent-created";
    String CLIENT_INSTITUTION_CREATED  = "client-institution-created";
    String INSTITUTION_CREATED          = "institution-created";
    String SYSTEM_USER_INGESTION_QUEUE  = "system-user-ingestion-queue";
    String USER_UPDATED                 = "user-updated";
    String USER_DELETED                 = "user-deleted";


    @Output(AGENT_CREATED)
    MessageChannel agentCreated();

    @Input(CLIENT_INSTITUTION_CREATED)
    MessageChannel clientInstitutionCreated();

    @Input(INSTITUTION_CREATED)
    SubscribableChannel institutionCreated();

    @Input(SYSTEM_USER_INGESTION_QUEUE)
    SubscribableChannel systemUserIngestionQueueChannel();

    @Output(USER_UPDATED)
    MessageChannel userUpdated();

    @Output(USER_DELETED)
    MessageChannel userDeleted();

}