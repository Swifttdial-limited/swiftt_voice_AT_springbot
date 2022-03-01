package com.swifttdial.licenceservice.domains.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.UUID;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class LoggedInUserDetails {
    private String username;
    private String fullName;
    private UUID publicId;
    private String clientId;
    private UUID department;
    private UUID institution;
}