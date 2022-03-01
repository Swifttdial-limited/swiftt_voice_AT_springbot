package com.swifttdial.atservice.domains.custom;

import com.swifttdial.atservice.datatypes.CallDirection;
import com.swifttdial.atservice.datatypes.CallStatus;

public interface CallCountByDirection {
    CallDirection getDirection();
    long getTotal();
}
