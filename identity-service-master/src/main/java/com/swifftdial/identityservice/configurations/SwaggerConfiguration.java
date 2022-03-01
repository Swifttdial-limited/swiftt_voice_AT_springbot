package com.swifftdial.identityservice.configurations;

import com.google.common.base.Predicate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import static com.google.common.base.Predicates.or;
import static springfox.documentation.builders.PathSelectors.regex;

@Configuration
@EnableSwagger2
public class SwaggerConfiguration {

    @Bean
    public Docket swaggerSettings() {
        return new Docket(DocumentationType.SWAGGER_2)
                .groupName("SWIFTT")
                .apiInfo(apiInfo())
                .select()
                .apis(RequestHandlerSelectors.any())
                .paths(paths())
                .build()
                .pathMapping("/");
    }

    private ApiInfo apiInfo() {
        Contact contact = new Contact("Daniel Warui", null, "daniel@swifttdial.com");
        return new ApiInfoBuilder()
                .title("Swifttdial Identity and Access Service")
                .description("All api endpoints")
                .contact(contact)
                .version("1")
                .build();
    }

    private Predicate<String> paths() {
        return or(
                regex("/actors.*"),
                regex("/identificationTypes.*"),
                regex("/internal.*"),
                regex("/organogramNodes.*"),
                regex("/privileges.*"),
                regex("/religions.*"),
                regex("/roles.*"),
                regex("/titles.*"),
                regex("/users.*")
        );
    }

}
