package com.swifftdial.identityservice.domains.dto;

import com.swifftdial.identityservice.datatypes.Gender;
import com.swifftdial.identityservice.datatypes.UserType;
import com.swifftdial.identityservice.domains.Title;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.UUID;

@Getter
@Setter
public class UserUpdateDTO {
    private UUID publicId;
    private Title title;
    private String firstName;
    private String surname;
    private String otherNames;
    private String emailAddress;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private Date dateOfBirth;
    private Gender gender;

    private UserType userType;
}
