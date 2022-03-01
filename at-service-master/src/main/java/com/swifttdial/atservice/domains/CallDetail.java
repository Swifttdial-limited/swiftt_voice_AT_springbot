package com.swifttdial.atservice.domains;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.swifttdial.atservice.datatypes.CallSessionState;
import lombok.*;
import org.hibernate.annotations.Where;

import javax.persistence.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(schema = "calls", name = "call_details")
@Where(clause = "deleted = false")
public class CallDetail extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    private Long version;

    private String dtmfDigits;

    @Enumerated(EnumType.STRING)
    private CallSessionState callSessionState;

    private String isActive;

    @ManyToOne
    @JoinColumn(name = "call_id_fk", nullable = false)
    @JsonBackReference
    private Call call;

    @ManyToOne
    @JoinColumn(name = "call_detail__ivr_option_id_fk")
    private IvrOption ivrOption;

}
