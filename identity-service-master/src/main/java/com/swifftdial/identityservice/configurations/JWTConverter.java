package com.swifftdial.identityservice.configurations;

import com.swifftdial.identityservice.domains.dto.LoggedInUserDetails;
import org.springframework.boot.autoconfigure.security.oauth2.resource.JwtAccessTokenConverterConfigurer;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.DefaultAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;

@Component
public class JWTConverter extends DefaultAccessTokenConverter implements JwtAccessTokenConverterConfigurer {

    @Override
    public void configure(JwtAccessTokenConverter converter) {
        converter.setAccessTokenConverter(this);
    }

    @Override
    public OAuth2Authentication extractAuthentication(Map<String, ?> map) {
        OAuth2Authentication auth = super.extractAuthentication(map);

        LoggedInUserDetails details = new LoggedInUserDetails();
        //populate details from the provided map, which contains the whole JWT.
        details.setPublicId(UUID.fromString(String.valueOf(map.get("publicId"))));
        details.setUsername(String.valueOf(map.get("user_name")));
        details.setFullName(String.valueOf(map.get("fullName")));
        details.setClientId(String.valueOf(map.get("client_id")));
        details.setInstitution(UUID.fromString(String.valueOf(map.get("institution"))));

        auth.setDetails(details);
        return auth;
    }
}
