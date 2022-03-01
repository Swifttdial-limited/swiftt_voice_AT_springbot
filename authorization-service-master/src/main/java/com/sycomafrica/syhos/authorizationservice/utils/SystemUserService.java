package com.sycomafrica.syhos.authorizationservice.utils;

import com.sycomafrica.syhos.authorizationservice.dto.Privilege;
import com.sycomafrica.syhos.authorizationservice.dto.Role;
import com.sycomafrica.syhos.authorizationservice.dto.User;
import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Created by olanga on 11/4/16.
 */
@Service
public class SystemUserService {

    @Autowired
    private SystemUserServiceFeignClient systemUserServiceFeignClient;

    /**
     * Service that invokes the {@link SystemUserServiceFeignClient}
     * @param username
     * @return Optional<SystemUser>
     */
    @HystrixCommand(fallbackMethod = "getSystemUserDefaultFallback")
    public Optional<User> getSystemUserByUsername(String username) {
        return Optional.of(systemUserServiceFeignClient.fetchSystemUserByUsername(username));
    }

    /**
     * The default fallback method when a user is not found or when the User Management service has timed out
     * @param username
     * @return
     */
    public Optional<User> getSystemUserDefaultFallback(String username) {
        return Optional.empty();
    }

    /**
     * Service that invokes the {@link SystemUserServiceFeignClient}
     * @param username
     * @return Optional<SystemUser>
     */
    @HystrixCommand(fallbackMethod = "getSystemUserByUsernameAndRoleDefaultFallback")
    public Optional<User> getSystemUserByUsernameAndRole(String username, String rolePublicId) {
        User user = systemUserServiceFeignClient.fetchSystemUserByUsername(username);
        if(!user.getRoles().isEmpty()) {
            Optional<Role> matchingRole = user.getRoles().stream().filter(role -> role.getPublicId().equals(UUID.fromString(rolePublicId))).findFirst();

            if(matchingRole.isPresent()) {
                user.getRoles().retainAll(Collections.singletonList(matchingRole.get()));
                return Optional.of(user);
            } else
                return Optional.empty();
        } else
            return Optional.empty();
    }

    /**
     * The default fallback method when a user is not found or when the User Management service has timed out
     * @param username
     * @return
     */
    public Optional<User> getSystemUserByUsernameAndRoleDefaultFallback(String username, String rolePublicId) {
        return Optional.empty();
    }

    /**
     * Method that takes in a collection of {@link Role}s and extracts {@link Privilege}s
     * @param roles
     * @return
     */
    public Collection<? extends GrantedAuthority> getAuthorities(Collection<Role> roles) {
        return this.getGrantedAuthorities(this.getPrivileges(roles));
    }

    /**
     * Takes in Collection of roles, adds the privileges for all roles to a Collection, the adds the privilegeNames
     * for all the privileges to a Collection<String>
     * @param roles
     * @return
     */
    private List<String> getPrivileges(Collection<Role> roles) {
        List<String> privileges = new ArrayList<>();
        List<Privilege> collection = new ArrayList<>();
        roles.forEach(role -> collection.addAll(role.getPrivileges()));
        collection.forEach(privilege -> privileges.add(privilege.getCode()));
        return privileges;
    }

    /**
     * Converts the list of strings to a list of GrantedAuthority
     * @param privileges
     * @return
     */
    private List<GrantedAuthority> getGrantedAuthorities(List<String> privileges) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        privileges.forEach(s -> authorities.add(new SimpleGrantedAuthority(s)));
        return authorities;
    }

    public List<Role> minifyRole(Collection<Role> roles) {
        List<Role> list = new ArrayList<>();
        for (Role r : roles) {
            Role role = new Role();
            role.setPublicId(r.getPublicId());
            role.setName(r.getName());
            role.setDepartment(r.getDepartment());
            list.add(role);
        }
        return list;
    }

}