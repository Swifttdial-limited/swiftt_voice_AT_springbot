package com.swifttdial.atservice.domains;

import lombok.*;
import org.hibernate.annotations.Where;

import javax.persistence.*;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(schema = "calls", name = "call_profile")
@Where(clause = "deleted = false")
public class CallProfile extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    private Long version;

    @Column(name = "call_profile_outbound_caller_id")
    private String outBoundCallerId;

    @Column(name = "call_profile_username")
    private String username;

    @Column(name = "call_profile_api_key")
    private String apiKey;
}
