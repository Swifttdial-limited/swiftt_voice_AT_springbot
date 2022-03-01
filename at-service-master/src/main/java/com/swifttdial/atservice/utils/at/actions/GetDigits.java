package com.swifttdial.atservice.utils.at.actions;

import java.net.URL;

public class GetDigits extends Action {

    public GetDigits(Say say, int numDigits, String finishOnKey, URL callbackUrl, Integer timeout) {
        this.init(say, numDigits, finishOnKey, callbackUrl, timeout);
    }

    public GetDigits(Say say, int numDigits, String finishOnKey, URL callbackUrl) {
        this.init(say, numDigits, finishOnKey, callbackUrl, (Integer)null);
    }

    public GetDigits(Say say) {
        this.init(say, 0, (String)null, (URL)null, (Integer)null);
    }

    public GetDigits(Play play, int numDigits, String finishOnKey, URL callbackUrl, Integer timeout) {
        this.init(play, numDigits, finishOnKey, callbackUrl, timeout);
    }

    public GetDigits(Play play) {
        this.init(play, 0, (String)null, (URL)null, (Integer)null);
    }

    private void init(Action child, int numDigits, String finishOnKey, URL callbackUrl, Integer timeout) {
        this.tag = "GetDigits";
        if (numDigits > 0) {
            this.attributes.put("numDigits", String.valueOf(numDigits));
        }

        if (finishOnKey != null) {
            this.attributes.put("finishOnKey", finishOnKey);
        }

        if (callbackUrl != null) {
            this.attributes.put("callbackUrl", callbackUrl.toString());
        }

        if (timeout != null){
            this.attributes.put("timeout", timeout.toString());
        }

        this.children.add(child);
    }
}
