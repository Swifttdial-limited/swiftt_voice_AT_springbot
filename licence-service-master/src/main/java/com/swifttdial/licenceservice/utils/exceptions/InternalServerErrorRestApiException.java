package com.swifttdial.licenceservice.utils.exceptions;

public class InternalServerErrorRestApiException extends RestApiException {
    private static final long serialVersionUID = 1L;

    public InternalServerErrorRestApiException() {
        super(RestApiHttpStatus.INTERNAL_SERVER_ERROR);
    }
}