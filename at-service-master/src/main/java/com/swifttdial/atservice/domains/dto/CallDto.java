package com.swifttdial.atservice.domains.dto;

import com.swifttdial.atservice.datatypes.CallDirection;
import com.swifttdial.atservice.datatypes.CallSessionState;
import com.swifttdial.atservice.datatypes.CallStatus;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CallDto {

    private String isActive;

    private String callerNumber;

    private String destinationNumber;

    private CallSessionState callSessionState;

    private String sessionId;

    private CallDirection direction;

    private String recordingUrl;

    private String durationInSeconds;

    private String currencyCode;

    private String amount;

    private String callStartTime;

    private String  callerCarrierName;

    private String callerCountryCode;

    private String dialDurationInSeconds;

    private String dialStartTime;

    private String dialDestinationNumber;

    private String dtmfDigits;

    private CallStatus status;
}
