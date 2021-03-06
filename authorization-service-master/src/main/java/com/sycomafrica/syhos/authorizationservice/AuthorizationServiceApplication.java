package com.sycomafrica.syhos.authorizationservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.circuitbreaker.EnableCircuitBreaker;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.netflix.feign.EnableFeignClients;
import org.springframework.cloud.netflix.hystrix.EnableHystrix;

@EnableCircuitBreaker
@EnableEurekaClient
@EnableFeignClients
@EnableHystrix
@SpringBootApplication
public class AuthorizationServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuthorizationServiceApplication.class, args);
	}
}
