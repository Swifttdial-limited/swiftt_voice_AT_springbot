package com.swifttdial.atservice.utils.at.actions;

import java.net.URL;

public class Redirect extends Action {
    public Redirect(URL url) {
        this.tag = "Redirect";
        this.text = url.toString();
    }
}