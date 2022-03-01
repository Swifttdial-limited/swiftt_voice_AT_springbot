package com.swifttdial.atservice.utils.at;

import com.google.gson.Gson;

public final class CallEntry {
    public String status;
    public String phoneNumber;
    public String sessionId;
    public String queueName = null;
    public int numCalls = 1;

    public CallEntry() {
    }

    public String toString() {
        return (new Gson()).toJson(this);
    }
}