package com.swifttdial.atservice.domains.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.UUID;

@Getter
@Setter
@ToString
public class UserDto {
    private Long id;
    private String firstName;
    private String surname;
    private String otherNames;
    private boolean enabled;
    private UUID publicId;
}
