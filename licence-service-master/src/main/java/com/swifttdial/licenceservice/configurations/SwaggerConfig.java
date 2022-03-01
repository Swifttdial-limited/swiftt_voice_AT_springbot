package com.swifttdial.licenceservice.configurations;

import com.google.common.base.Predicate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import static com.google.common.base.Predicates.or;
import static springfox.documentation.builders.PathSelectors.regex;

@Profile("localconfig")
@Configuration
@EnableSwagger2
public class SwaggerConfig {

    @Bean
    public Docket swaggerSettings() {
        return new Docket(DocumentationType.SWAGGER_2)
                .groupName("SYHOS")
                .apiInfo(apiInfo())
                .select()
                .apis(RequestHandlerSelectors.any())
                .paths(paths())
                .build()
                .pathMapping("/");
    }

    private ApiInfo apiInfo() {
        Contact contact = new Contact("Gathigai Warui", null, "gathigai@gmail.com");
        return new ApiInfoBuilder()
                .title("Syhos API Documents")
                .description("All api endpoints")
                .contact(contact)
                .version("1")
                .build();
    }

    private Predicate<String> paths() {
        return or(
                regex("/practitioners.*"),
                regex("/specializations.*")
        );
    }

}
