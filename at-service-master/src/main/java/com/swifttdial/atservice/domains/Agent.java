package com.swifttdial.atservice.domains;

import com.swifttdial.atservice.datatypes.AgentStatus;
import com.swifttdial.atservice.domains.dto.SystemUser;
import lombok.*;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.util.Objects;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(schema = "systemusers", name = "agents")
@Where(clause = "deleted =false")
public class Agent extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "agent_id")
    private Long id;

    @Version
    private Long version;

    @Column(name = "agent_phone_number", nullable = false)
    private String phoneNumber;

    private boolean sipId;

    @Column(name = "agent_is_ready",columnDefinition = "boolean default false")
    private boolean ready;

    @Enumerated(EnumType.STRING)
    private AgentStatus status;

    @OneToOne(optional = false)
    @JoinColumn(name = "agent_user_id")
    private User user;

    @PrePersist
    public void prePersist(){
        status = AgentStatus.ACTIVE;
        ready = true;
    }

    public boolean isEnabled(){
        return ready && AgentStatus.ACTIVE.equals(status);
    }
}
