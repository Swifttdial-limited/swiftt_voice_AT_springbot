package com.swifttdial.atservice.domains.dto.cdr;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.UUID;
@Getter
@Setter
@ToString
public class CallerProfile {
    private String username;
    private String dialplan;
    private String callerIDName;
    private String ani;
    private String aniii;
    private String callerIDNumber;
    private String networkAddr;
    private String rdnis;
    private String destinationNumber;
    private UUID uuid;
    private String source;
    private String context;
    private String chanName;
    private Originatee originatee;
}