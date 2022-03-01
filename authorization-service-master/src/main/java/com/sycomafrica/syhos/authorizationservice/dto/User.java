package com.sycomafrica.syhos.authorizationservice.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Collection;
import java.util.UUID;

/**
 * Created by olanga on 11/19/16.
 */
@Getter
@Setter
@ToString
public class User {

    private UUID tenant;
    private UUID publicId;
    private String username;
    private String password;
    private String fullName;
    private String phoneNumber;
    private boolean forcePasswordReset, enabled, accountNonExpired, accountNonLocked, credentialsNonExpired;
    private Collection<Role> roles;
    private boolean mobileApplicationActivated;
    private String mobileApplicationActivationCode;

}