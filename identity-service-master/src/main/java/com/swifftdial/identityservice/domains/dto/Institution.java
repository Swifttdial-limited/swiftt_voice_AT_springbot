package com.swifftdial.identityservice.domains.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.UUID;

@Getter
@Setter
@ToString
public class Institution {

    private UUID publicId;
    private String emailAddress;
    private String institutionName;
}
