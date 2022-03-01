package com.swifttdial.atservice.domains.dto;

import com.swifttdial.atservice.domains.custom.CallByAgent;
import com.swifttdial.atservice.domains.custom.CallCountByDirection;
import com.swifttdial.atservice.domains.custom.CallCountBySessionState;
import com.swifttdial.atservice.domains.custom.CallCountByStatus;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class CallCountTotalDto {
    List<CallCountByStatus> callCountByStatus;
    List<CallCountByDirection> callCountByDirection;
    List<CallCountBySessionState> callCountBySessionState;
    List<CallByAgent> callByAgents;
}
