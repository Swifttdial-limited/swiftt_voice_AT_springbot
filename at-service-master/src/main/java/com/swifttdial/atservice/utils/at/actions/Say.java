package com.swifttdial.atservice.utils.at.actions;

public class Say extends Action {

    public Say(String text, boolean playBeep, Say.Voice voice) {
        this.tag = "Say";
        this.text = text;
        if (playBeep) {
            this.attributes.put("playBeep", "true");
        }

        if (voice != null) {
            this.attributes.put("voice", voice.name().toLowerCase());
        }

    }

    public Say(String text) {
        this(text, false, (Say.Voice)null);
    }

    public Say(String text, Say.Voice voice) {
        this(text, false, voice);
    }

    public Say(String text, boolean playBeep) {
        this(text, playBeep, (Say.Voice)null);
    }

    public static enum Voice {
        MAN,
        WOMAN;

        private Voice() {
        }
    }
}
