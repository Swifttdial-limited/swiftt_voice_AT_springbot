package com.swifttdial.licenceservice.utils.exceptions;

public class BadRequestRestApiException extends RestApiException {
    private static final long serialVersionUID = 1L;

    public BadRequestRestApiException() {
        super(RestApiHttpStatus.BAD_REQUEST);
    }
}