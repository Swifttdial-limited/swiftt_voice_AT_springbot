package com.swifttdial.atservice.domains.custom;

import com.swifttdial.atservice.datatypes.CallSessionState;
import com.swifttdial.atservice.datatypes.CallStatus;

public interface CallCountBySessionState {
    CallSessionState getSessionState();
    long getTotal();
}
