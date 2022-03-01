package com.swifttdial.licenceservice.utils.exceptions;

public class ConstraintValidationException extends RestApiException {
    private static final long serialVersionUID = 1L;

    public ConstraintValidationException() {
        super(RestApiHttpStatus.INTERNAL_SERVER_ERROR);
    }
}