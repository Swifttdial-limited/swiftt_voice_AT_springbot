package com.swifftdial.identityservice.domains.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
public class ProfileAction {

    @NotNull
    private ProfileActionType actionType;
    private String currentPassword;
    private String password;
    private String confirmPassword;

    public enum ProfileActionType {
        CHANGE_PASSWORD, SET_OUT_OF_OFFICE
    }

}