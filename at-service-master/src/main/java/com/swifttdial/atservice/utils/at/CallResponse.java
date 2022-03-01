package com.swifttdial.atservice.utils.at;

import com.google.gson.Gson;

import java.util.List;

public final class CallResponse {
    public List<CallEntry> entries;
    public String errorMessage;

    public CallResponse() {
    }

    public String toString() {
        return (new Gson()).toJson(this);
    }
}