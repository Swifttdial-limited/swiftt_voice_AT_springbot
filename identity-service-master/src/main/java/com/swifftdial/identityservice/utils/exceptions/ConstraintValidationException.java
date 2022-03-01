package com.swifftdial.identityservice.utils.exceptions;


import com.swifftdial.identityservice.utils.web.rest.RestApiException;
import com.swifftdial.identityservice.utils.web.rest.RestApiHttpStatus;

/**
 * Created by Elphas Khajira on 10/25/16.
 */
public class ConstraintValidationException extends RestApiException {
    private static final long serialVersionUID = 1L;

    public ConstraintValidationException() {
        super(RestApiHttpStatus.INTERNAL_SERVER_ERROR);
    }
}