package com.swifttdial.atservice.utils.at.actions;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

public class Action {
    protected String tag;
    protected String text;
    protected HashMap<String, String> attributes = new HashMap<>();
    protected List<Action> children = new ArrayList<>();

    public Action() {
    }

    public String build(){
        StringBuilder str = new StringBuilder();
        str.append("<").append(this.tag);
        Iterator it;
        if (!this.attributes.isEmpty()) {
            it = this.attributes.keySet().iterator();

            while(it.hasNext()) {
                String key = (String)it.next();
                str.append(" ").append(key).append("=\"").append((String) this.attributes.get(key)).append("\"");
            }
        }

        if (!this.children.isEmpty()) {
            str.append(">");
            it = this.children.iterator();

            while(it.hasNext()) {
                Action child = (Action)it.next();
                str.append(child.build());
            }

            str.append("</").append(this.tag).append(">");
        } else if (this.text != null) {
            str.append(">").append(this.text).append("</").append(this.tag).append(">");
        } else {
            str.append("/>");
        }

        return str.toString();
    }
}
