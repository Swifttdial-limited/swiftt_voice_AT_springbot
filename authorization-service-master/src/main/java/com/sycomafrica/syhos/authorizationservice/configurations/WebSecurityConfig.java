package com.sycomafrica.syhos.authorizationservice.configurations;

import com.sycomafrica.syhos.authorizationservice.dto.SystemUser;
import com.sycomafrica.syhos.authorizationservice.utils.SystemUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configurers.GlobalAuthenticationConfigurerAdapter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import javax.servlet.http.HttpServletRequest;
import java.util.Collections;

/**
 * Created by olanga on 11/4/16.
 */
@Configuration
class WebSecurityConfig extends GlobalAuthenticationConfigurerAdapter {

    private final HttpServletRequest request;
    private final SystemUserService systemUserService;

    @Autowired
    public WebSecurityConfig(HttpServletRequest request, SystemUserService systemUserService) {
        this.request = request;
        this.systemUserService = systemUserService;
    }

    @Bean
    BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    public void init(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(customUserDetailsService()).passwordEncoder(passwordEncoder());
    }

    @Bean
    UserDetailsService customUserDetailsService() throws UsernameNotFoundException {
        return this::loadUserByUsername;
    }

    private UserDetails loadUserByUsername(String username) {
        if (request.getParameter("role") == null) {
            return this.systemUserService.getSystemUserByUsername(username)
                    .map(user ->
                            new SystemUser(user.getUsername(), user.getPassword(), user.isForcePasswordReset(),
                                    user.isEnabled(), user.isAccountNonExpired(),
                                    user.isCredentialsNonExpired(), user.isAccountNonLocked(),
                                    Collections.singleton(new SimpleGrantedAuthority("LOGIN_PREAUTHORIZED")),
                                    user.getPublicId(), user.getFullName(), user.getPhoneNumber(),
                                    this.systemUserService.minifyRole(user.getRoles()), user.getTenant())
                    )
                    .orElseThrow(() -> new UsernameNotFoundException("could not find the user '" + username + "'"));
        } else if (request.getParameter("role") != null) {
            return this.systemUserService.getSystemUserByUsernameAndRole(username, request.getParameter("role"))
                    .map(user ->
                            new SystemUser(user.getUsername(), user.getPassword(), user.isForcePasswordReset(),
                                    user.isEnabled(), user.isAccountNonExpired(),
                                    user.isCredentialsNonExpired(), user.isAccountNonLocked(),
                                    this.systemUserService.getAuthorities(user.getRoles()),
                                    user.getPublicId(), user.getFullName(), user.getPhoneNumber(),
                                    this.systemUserService.minifyRole(user.getRoles()), user.getTenant())
                    )
                    .orElseThrow(() -> new UsernameNotFoundException("could not find the user '" + username + "'"));
        } else
            throw new UsernameNotFoundException("could not find the user '" + username + "'");

    }
}
