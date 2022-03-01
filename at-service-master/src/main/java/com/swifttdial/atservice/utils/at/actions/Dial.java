package com.swifttdial.atservice.utils.at.actions;

import java.net.URL;
import java.util.List;

public class Dial extends Action {
    public Dial(List<String> phoneNumbers, boolean record, boolean sequential, String callerId, URL ringBackTone, int maxDuration) {
        this.tag = "Dial";
        this.attributes.put("phoneNumbers", String.join(",", phoneNumbers));
        if (record) {
            this.attributes.put("record", "true");
        }

        this.attributes.put("sequential", Boolean.toString(sequential));

//        if (sequential) {
//            this.attributes.put("sequential", "true");
//        }

        if (callerId != null) {
            this.attributes.put("callerId", callerId);
        }

        if (ringBackTone != null) {
            this.attributes.put("ringBackTone", ringBackTone.toString());
        }

        if (maxDuration > 0) {
            this.attributes.put("maxDuration", String.valueOf(maxDuration));
        }

    }

    public Dial(List<String> phoneNumbers) {
        this(phoneNumbers, false, false, (String)null, (URL)null, -1);
    }
}