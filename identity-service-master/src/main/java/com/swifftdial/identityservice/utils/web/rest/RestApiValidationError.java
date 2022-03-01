package com.swifftdial.identityservice.utils.web.rest;

import lombok.Getter;
import lombok.Setter;

/**
 * Created by daniel.gathigai on 11/22/2015.
 */
@Getter
@Setter
public class RestApiValidationError {

    private String fieldName, message;
}