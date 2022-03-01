package com.swifftdial.identityservice.domains.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class SystemUser {

    private String fullName;
    private String username;
    private UUID publicId;

}
