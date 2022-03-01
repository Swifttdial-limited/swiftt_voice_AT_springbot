package com.swifttdial.atservice.utils.at;

import com.google.gson.Gson;

public final class CallTransferResponse {
    public String status;
    public String errorMessage;

    public CallTransferResponse() {
    }

    public String toString() {
        return (new Gson()).toJson(this);
    }
}