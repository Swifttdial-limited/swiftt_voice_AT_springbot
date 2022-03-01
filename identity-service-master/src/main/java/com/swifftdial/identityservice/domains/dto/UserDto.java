package com.swifftdial.identityservice.domains.dto;

import com.fasterxml.jackson.annotation.JsonView;
import com.swifftdial.identityservice.domains.NextOfKin;
import com.swifftdial.identityservice.domains.Role;
import com.swifftdial.identityservice.domains.User;
import com.swifftdial.identityservice.domains.UserIdentification;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class UserDto {

    @JsonView(User.CreatePatientView.class)
    private User user;

    private List<Role> roles = new ArrayList<>();

    @JsonView(User.CreatePatientView.class)
    private List<UserIdentification> userIdentifications = new ArrayList<>();

    @JsonView(User.CreatePatientView.class)
    private List<NextOfKin> nextOfKins = new ArrayList<>();
    private UUID institution;

    private Agent agent;

    private boolean agentProfile;

    public UserDto(User user, List<Role> roles) {
        this.user = user;
        this.roles = roles;
    }

}