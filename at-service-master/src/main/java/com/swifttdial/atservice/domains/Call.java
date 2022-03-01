package com.swifttdial.atservice.domains;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.swifttdial.atservice.datatypes.CallDirection;
import com.swifttdial.atservice.datatypes.CallSessionState;
import com.swifttdial.atservice.datatypes.CallStatus;
import lombok.*;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(schema = "calls", name = "calls")
@Where(clause = "deleted = false")
public class Call extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    private Long version;

    private String isActive;

    private String callerNumber;

    private String destinationNumber;

    @Enumerated(EnumType.STRING)
    private CallSessionState callSessionState;

    private String sessionId;

    @Enumerated(EnumType.STRING)
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

    @OneToMany(mappedBy = "call", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<CallDetail> callDetails = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private CallStatus status; /*Aborted, Success*/
}
