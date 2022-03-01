package com.swifftdial.identityservice.domains.dto;

import com.swifftdial.identityservice.domains.User;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

@Getter
@Setter
@ToString
public class AgentDto implements Serializable {
    private User user;
    private Agent agent;
}
