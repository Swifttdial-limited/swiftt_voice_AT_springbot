package com.swifttdial.atservice.utils.at;

import com.google.gson.Gson;

import java.util.List;

public final class QueuedCallsResponse {
    public String status;
    public String errorMessage;
    public List<CallEntry> entries;

    public QueuedCallsResponse() {
    }

    public String toString() {
        return (new Gson()).toJson(this);
    }
}