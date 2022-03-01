package com.swifttdial.atservice.utils.at.actions;

import java.net.URL;

public class Play extends Action {
    public Play(URL url) {
        this.tag = "Play";
        this.attributes.put("url", url.toString());
    }
}
