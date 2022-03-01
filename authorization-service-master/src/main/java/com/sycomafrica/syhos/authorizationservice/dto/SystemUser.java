package com.sycomafrica.syhos.authorizationservice.dto;

import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;
import java.util.UUID;

/**
 * Created by olanga on 11/4/16.
 */
@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = false)
public class SystemUser extends User {

    private static final long serialVersionUID = -3531439484732724601L;

    private final UUID publicId;
    private final boolean forcePasswordReset;
    private final String fullName, phoneNumber;
    private final Collection<Role> roles;
    private final UUID tenant;

    public SystemUser(String username, String password, boolean forcePasswordReset, boolean enabled, boolean accountNonExpired,
                      boolean credentialsNonExpired, boolean accountNonLocked, Collection<? extends GrantedAuthority> authorities,
                      UUID publicId, String fullName, String phoneNumber, Collection<Role> roles, UUID tenant) {
        super(username, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities);
        this.publicId = publicId;
        this.forcePasswordReset = forcePasswordReset;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.roles = roles;
        this.tenant = tenant;
    }

}