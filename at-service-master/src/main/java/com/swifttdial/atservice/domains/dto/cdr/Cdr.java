package com.swifttdial.atservice.domains.dto.cdr;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Map;

@Getter
@Setter
@ToString
public class Cdr {
    private Map<String, String> variables;
    private AppLog appLog;
    private Callflow callflow;
}