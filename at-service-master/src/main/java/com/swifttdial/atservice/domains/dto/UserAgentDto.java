package com.swifttdial.atservice.domains.dto;

import com.swifttdial.atservice.domains.Agent;
import com.swifttdial.atservice.domains.User;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

@Getter
@Setter
@ToString
public class UserAgentDto implements Serializable {
    private UserDto user;
    private Agent agent;
}
