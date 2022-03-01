package com.swifttdial.atservice.domains.custom;

import com.swifttdial.atservice.datatypes.CallStatus;
import lombok.*;

public interface CallCountByStatus {
    CallStatus getStatus();
    long getTotal();
}
