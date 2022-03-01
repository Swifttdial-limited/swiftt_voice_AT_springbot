package com.swifttdial.atservice.utils.exceptions;


import com.swifttdial.atservice.utils.web.rest.RestApiException;
import com.swifttdial.atservice.utils.web.rest.RestApiHttpStatus;

/**
 * Created by daniel.olanga on 11/22/2015.
 */
public class BadRequestRestApiException extends RestApiException {
    private static final long serialVersionUID = 1L;

    public BadRequestRestApiException() {
        super(RestApiHttpStatus.BAD_REQUEST);
    }
}