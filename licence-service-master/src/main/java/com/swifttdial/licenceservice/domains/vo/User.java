package com.swifttdial.licenceservice.domains.vo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class User {
    private String firstName;
    private String surname;
    private String otherNames;
    private String emailAddress;
    private String phoneNumber;
}
