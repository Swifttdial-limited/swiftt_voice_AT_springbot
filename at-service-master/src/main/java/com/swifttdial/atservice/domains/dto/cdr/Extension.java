package com.swifttdial.atservice.domains.dto.cdr;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class Extension {
    private Application[] application;
    private String name;
    private String number;
}