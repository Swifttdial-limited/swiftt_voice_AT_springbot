package com.swifttdial.licenceservice.utils.exceptions;

public class ForbiddenRestApiException extends RestApiException {
    private static final long serialVersionUID = 1L;

    public ForbiddenRestApiException() {
        super(RestApiHttpStatus.FORBIDDEN);
    }
}
