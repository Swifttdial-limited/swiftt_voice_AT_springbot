package com.swifttdial.licenceservice.utils.exceptions;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.web.client.HttpStatusCodeException;

import java.util.List;
import java.util.UUID;


/**
 * This represents a standard REST api error.
 *
 * Created by daniel.olanga on 11/22/2015.
 */
public class RestApiError {

    private final int httpStatus;
    private UUID apiCode;
    private String userMessage;
    private String developerMessage;
    private List<RestApiValidationError> validationErrors;

    @JsonCreator
    public RestApiError(@JsonProperty("httpStatus") RestApiHttpStatus httpStatus) {
        this.httpStatus = httpStatus.getStatusCode();
    }

    public static RestApiError fromHttpStatusCodeException(HttpStatusCodeException e) {
        String responseBody = e.getResponseBodyAsString();
        return JacksonUtils.fromJSON(responseBody, RestApiError.class);
    }

    @Override
    public String toString() {
        return JacksonUtils.toJSON(this);
    }

    public int getHttpStatus() {
        return httpStatus;
    }

    public UUID getApiCode() {
        return apiCode;
    }

    public RestApiError setApiCode(UUID apiCode) {
        this.apiCode = apiCode;
        return this;
    }

    public String getUserMessage() {
        return userMessage;
    }

    public RestApiError setUserMessage(String userMessage) {
        this.userMessage = userMessage;
        return this;
    }

    public String getDeveloperMessage() {
        return developerMessage;
    }

    public RestApiError setDeveloperMessage(String developerMessage) {
        this.developerMessage = developerMessage;
        return this;
    }

    public List<RestApiValidationError> getValidationErrors() {
        return validationErrors;
    }

    public RestApiError setValidationErros(List<RestApiValidationError> restApiFieldErrors) {
        this.validationErrors = restApiFieldErrors;
        return this;
    }

}
