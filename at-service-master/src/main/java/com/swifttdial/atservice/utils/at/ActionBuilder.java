package com.swifttdial.atservice.utils.at;

import com.swifttdial.atservice.utils.at.actions.*;

public class ActionBuilder {
    private Boolean finalized = false;
    private StringBuilder xml = new StringBuilder();

    public ActionBuilder() {
        this.xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?><Response>");
    }

    public String build() {
        this.finalized = true;
        this.xml.append("</Response>");
        return this.xml.toString();
    }

    private ActionBuilder action(Action action) {
        if (this.finalized) {
            throw new RuntimeException("This builder has been finalized by a call to build()");
        } else {
            this.xml.append(action.build());
            return this;
        }
    }

    public ActionBuilder say(Say action) {
        return this.action(action);
    }

    public ActionBuilder play(Play action) {
        return this.action(action);
    }

    public ActionBuilder dial(Dial action) {
        return this.action(action);
    }

    public ActionBuilder complete(Complete action) {
        return this.action(action);
    }

    public ActionBuilder redirect(Redirect action) {
        return this.action(action);
    }

    public ActionBuilder getDigits(GetDigits action) {
        return this.action(action);
    }
}
