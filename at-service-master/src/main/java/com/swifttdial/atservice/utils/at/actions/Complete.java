package com.swifttdial.atservice.utils.at.actions;

public class Complete extends Action {

    public Complete(boolean isComplete, String sessionId) {
        this.tag = "Complete";

            this.attributes.put("isComplete", String.valueOf(isComplete));
        if (sessionId != null)
            this.attributes.put("sessionId", sessionId);
    }
}
