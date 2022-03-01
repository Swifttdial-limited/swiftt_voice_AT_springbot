package com.mkopohela.gateway.configurations;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;

/**
 * Created by gathigai on 11/3/16.
 */
@Configuration
public class ResourceServerConfig extends ResourceServerConfigurerAdapter {

    @Override
    public void configure(HttpSecurity http) throws Exception {
        // only secure channel, https, is allowed
        //http.requiresChannel().anyRequest().requiresSecure();
        http.authorizeRequests().antMatchers(HttpMethod.GET, "/api/v1/uaa/**").permitAll();
        http.authorizeRequests().antMatchers(HttpMethod.POST, "/api/v1/uaa/**").permitAll();
        http.authorizeRequests().antMatchers(HttpMethod.POST, "/api/v1/uaa/oauth/token").permitAll();
        http.authorizeRequests().antMatchers(HttpMethod.POST, "/api/v1/uaa/users/register").permitAll();
        http.authorizeRequests().antMatchers(HttpMethod.POST, "/api/v1/uaa/users/registrationConfirmation").permitAll();
        http.authorizeRequests() .antMatchers(HttpMethod.GET, "/api/v1/uaa/users/resendAccountVerification").permitAll();
        http.authorizeRequests() .antMatchers(HttpMethod.POST, "/api/v1/mpesa/**").permitAll();
        http.authorizeRequests() .antMatchers(HttpMethod.POST, "/api/v1/calls/**").permitAll();
        http.httpBasic().disable();
//        http.oauth2ResourceServer().jwt();

        http.authorizeRequests().anyRequest().authenticated();
        /*.and()
                .csrf().csrfTokenRepository(getCSRFTokenRepository()).ignoringAntMatchers("/uaa/‌​oauth/token").and()
                .addFilterAfter(createCSRFHeaderFilter(), CsrfFilter.class);*/
    }
}