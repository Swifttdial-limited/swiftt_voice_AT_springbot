package com.swifftdial.identityservice.utils.exceptions;

import com.swifftdial.identityservice.utils.web.rest.RestApiException;
import com.swifftdial.identityservice.utils.web.rest.RestApiHttpStatus;

/**
 * Created by daniel.gathigai on 11/22/2015.
 */
public class UnauthorizedRestApiException extends RestApiException {

    private static final long serialVersionUID = 1L;

    public UnauthorizedRestApiException() {
        super(RestApiHttpStatus.UNAUTHORIZED);
    }

}