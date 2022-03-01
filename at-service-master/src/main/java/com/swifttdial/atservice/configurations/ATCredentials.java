package com.swifttdial.atservice.configurations;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Map;

@Data
@Configuration
@ConfigurationProperties(prefix = "atcredentials")
public class ATCredentials {
    private List<String> usernames;
    private Map<String, String> apikeys;
}
