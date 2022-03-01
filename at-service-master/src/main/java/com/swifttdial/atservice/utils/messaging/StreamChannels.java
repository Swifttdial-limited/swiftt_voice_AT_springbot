package com.swifttdial.atservice.utils.messaging;

import org.springframework.cloud.stream.annotation.Input;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.SubscribableChannel;

public interface StreamChannels {

    String AGENT_CREATED = "agent-created";

    @Input(AGENT_CREATED)
    SubscribableChannel agentCreated();
}
