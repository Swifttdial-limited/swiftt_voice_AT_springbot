package com.swifttdial.atservice.domains.dto;

import lombok.*;

import javax.persistence.Embeddable;
import java.util.UUID;

@Getter
@Setter
@ToString
@Embeddable
@AllArgsConstructor
@NoArgsConstructor
public class SystemUser {

    private String fullName;
    private String username;
    private UUID publicId;

}
