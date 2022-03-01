package com.swifftdial.identityservice.domains.dto;

import com.swifftdial.identityservice.domains.Privilege;
import com.swifftdial.identityservice.domains.User;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RoleAction {

    private RoleActionType actionType;
    private List<User> users;
    private List<Privilege> privileges;

    public enum RoleActionType {
        ADD_PRIVILEGES, REMOVE_PRIVILEGES, ADD_USERS, REMOVE_USERS
    }
}
