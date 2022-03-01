package com.swifttdial.atservice.utils.exceptions;

import com.swifttdial.atservice.utils.web.rest.RestApiException;
import com.swifttdial.atservice.utils.web.rest.RestApiHttpStatus;

/**
 * Created by daniel.olanga on 11/22/2015.
 */
public class InternalServerErrorRestApiException extends RestApiException {
    private static final long serialVersionUID = 1L;

    public InternalServerErrorRestApiException() {
        super(RestApiHttpStatus.INTERNAL_SERVER_ERROR);
    }
}