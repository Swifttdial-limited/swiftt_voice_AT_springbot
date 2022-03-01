package com.swifttdial.atservice.domains.dto.cdr;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class Times {
    private String createdTime;
    private String profileCreatedTime;
    private String progressTime;
    private String progressMediaTime;
    private String answeredTime;
    private String hangupTime;
    private String transferTime;
}
