package com.swifttdial.atservice;

import com.africastalking.AfricasTalking;
import com.africastalking.VoiceService;
import com.swifttdial.atservice.configurations.ATCredentials;
//import com.swifttdial.atservice.utils.messaging.StreamChannels;
import com.swifttdial.atservice.utils.messaging.StreamChannels;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.circuitbreaker.EnableCircuitBreaker;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.netflix.feign.EnableFeignClients;
import org.springframework.cloud.netflix.hystrix.EnableHystrix;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.web.filter.CommonsRequestLoggingFilter;

@Slf4j
@EnableBinding(StreamChannels.class)
@EnableHystrix
@EnableFeignClients
@EnableCircuitBreaker
@EnableEurekaClient
@EnableResourceServer
@SpringBootApplication
public class AtServiceApplication {

    @Autowired
    public ATCredentials atCredentials;

    public static void main(String[] args) {
        SpringApplication.run(AtServiceApplication.class, args);
    }

    @Bean
    public VoiceService atVoiceService(){
        log.error("username: " + atCredentials.toString());
        int usernameIndex = atCredentials.getUsernames().indexOf("getso");
        if (usernameIndex != -1){
            AfricasTalking.initialize(atCredentials.getUsernames().get(usernameIndex), atCredentials.getApikeys().get("getso"));
            return AfricasTalking.getService(AfricasTalking.SERVICE_VOICE);
        }
        return null;
    }

    @Bean
    public Jackson2JsonMessageConverter converter() {
        return new Jackson2JsonMessageConverter();
    }
}