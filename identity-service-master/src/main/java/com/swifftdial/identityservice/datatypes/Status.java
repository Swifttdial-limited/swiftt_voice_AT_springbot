package com.swifftdial.identityservice.datatypes;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Created by Elphas Khajira on 9/15/16.
 */
public enum Status {
    ACTIVE, INACTIVE;

    @JsonCreator(mode = JsonCreator.Mode.PROPERTIES)
    public static Status create(@JsonProperty("status") String s){
        return Status.valueOf(s);
    }
}
