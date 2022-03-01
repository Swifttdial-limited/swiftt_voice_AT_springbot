package com.swifttdial.licenceservice.utils.messaging;

import org.springframework.cloud.stream.annotation.Output;
import org.springframework.messaging.MessageChannel;

public interface StreamChannels {

    String INSTITUTION_CREATED  = "institution-created";
    String CLIENT_INSTITUTION_CREATED  = "client-institution-created";

    @Output(INSTITUTION_CREATED)
    MessageChannel institutionCreated();

    @Output(CLIENT_INSTITUTION_CREATED)
    MessageChannel clientInstitutionCreated();
}
