package com.swifftdial.identityservice.domains.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
public class UserAction {

    @NotNull
    private UserActionType userActionType;

    public enum UserActionType {
        REQUEST_PASSWORD_RESET
    }
}
