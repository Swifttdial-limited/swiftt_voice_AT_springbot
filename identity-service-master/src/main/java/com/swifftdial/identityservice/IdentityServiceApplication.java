package com.swifftdial.identityservice;

import com.swifftdial.identityservice.utils.messaging.StreamChannels;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.client.circuitbreaker.EnableCircuitBreaker;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.netflix.feign.EnableFeignClients;
import org.springframework.cloud.netflix.hystrix.EnableHystrix;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Page;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;

import java.io.IOException;

import static com.google.common.base.Predicates.or;

@EnableBinding(StreamChannels.class)
@EnableCaching
@EnableHystrix
@EnableFeignClients
@EnableCircuitBreaker
@EnableEurekaClient
@EnableResourceServer
@SpringBootApplication
public class IdentityServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(IdentityServiceApplication.class, args);
	}

	@Bean
	public Module springDataPageModule() {
		return new SimpleModule().addSerializer(Page.class, new JsonSerializer<Page>() {
			@Override
			public void serialize(Page value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
				gen.writeStartObject();
				gen.writeNumberField("totalElements",value.getTotalElements());
				gen.writeNumberField("totalPages", value.getTotalPages());
				gen.writeNumberField("number", value.getNumber());
				gen.writeNumberField("size", value.getSize());
				gen.writeBooleanField("first", value.isFirst());
				gen.writeBooleanField("last", value.isLast());
				gen.writeFieldName("content");
				serializers.defaultSerializeValue(value.getContent(),gen);
				gen.writeEndObject();
			}
		});
	}
}
