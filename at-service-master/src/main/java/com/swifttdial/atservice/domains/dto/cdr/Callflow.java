package com.swifttdial.atservice.domains.dto.cdr;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class Callflow {
    private Extension extension;
    private CallerProfile callerProfile;
    private Times times;
    private String dialplan;
    private String profileIndex;
}