package com.swifttdial.atservice.domains.custom;

import com.swifttdial.atservice.domains.Agent;
import com.swifttdial.atservice.domains.Call;

public interface CallByAgent {
    String getAgent();
    long getTotal();
}
