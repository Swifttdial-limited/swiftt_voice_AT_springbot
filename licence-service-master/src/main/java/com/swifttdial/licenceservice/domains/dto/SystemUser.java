package com.swifttdial.licenceservice.domains.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;
import java.util.UUID;

@Getter
@Setter
@ToString
public class SystemUser implements Serializable {

    private static final long serialVersionUID = 1L;

    private String fullName;
    private String username;
    private UUID publicId;

    public SystemUser(String fullName, String username, UUID publicId) {
        this.fullName = fullName;
        this.username = username;
        this.publicId = publicId;
    }
}
