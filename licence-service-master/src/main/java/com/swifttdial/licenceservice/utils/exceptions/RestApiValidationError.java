package com.swifttdial.licenceservice.utils.exceptions;

import lombok.Getter;
import lombok.Setter;

/**
 * Created by daniel.olanga on 11/22/2015.
 */
@Getter
@Setter
public class RestApiValidationError {

    private String fieldName, message;
}