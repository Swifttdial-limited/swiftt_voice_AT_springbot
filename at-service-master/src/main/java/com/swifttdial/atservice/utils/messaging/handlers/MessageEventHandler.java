package com.swifttdial.atservice.utils.messaging.handlers;

import com.swifttdial.atservice.domains.Agent;
import com.swifttdial.atservice.domains.User;
import com.swifttdial.atservice.domains.dto.UserAgentDto;
import com.swifttdial.atservice.services.AgentService;
import com.swifttdial.atservice.utils.messaging.StreamChannels;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class MessageEventHandler {

    private final AgentService agentService;

    public MessageEventHandler(AgentService agentService) {
        this.agentService = agentService;
    }

    @StreamListener(StreamChannels.AGENT_CREATED)
    public void agentCreated(UserAgentDto userAgentDto){
        this.createAgent(userAgentDto);
    }

    private void createAgent(UserAgentDto userAgentDto){
        log.error("***************** Agent Creation ****************");
        log.error(userAgentDto.toString());
        User user = new User();
        user.setEnabled(userAgentDto.getUser().isEnabled());
        user.setFirstName(userAgentDto.getUser().getFirstName());
        user.setId(userAgentDto.getUser().getId());
        user.setOtherNames(userAgentDto.getUser().getOtherNames());
        user.setSurname(userAgentDto.getUser().getSurname());
        user.setPublicId(userAgentDto.getUser().getPublicId());
        userAgentDto.getAgent().setUser(user);
        agentService.createAgent(userAgentDto.getAgent());
    }
}
