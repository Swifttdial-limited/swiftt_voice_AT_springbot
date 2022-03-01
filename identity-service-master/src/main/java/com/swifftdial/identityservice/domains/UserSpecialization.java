package com.swifftdial.identityservice.domains;

import com.fasterxml.jackson.annotation.JsonView;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@ToString
@NoArgsConstructor
@Entity
@Table(schema = "systemusers", name = "user_specializations")
@Where(clause = "deleted = false")
public class UserSpecialization extends BaseEntity {

    @JsonView({ SummaryView.class })
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "userspecialization_id")
    private Long id;

    @JsonView({ SummaryView.class })
    @Version
    @Column(name = "userspecialization_version")
    private Long version;

    @JsonView({ SummaryView.class })
    @ManyToOne
    @JoinColumn(name = "userspecialization_user_id_fk")
    private User user;

    @JsonView({ SummaryView.class })
    @ManyToOne
    @JoinColumn(name = "userspecialization_actor_id_fk")
    private Actor actor;

    @JsonView({ SummaryView.class })
    @ManyToOne
    @JoinColumn(name = "userspecialization_identificationtype_id_fk")
    private IdentificationType identificationType;

    @JsonView({ SummaryView.class })
    @NotNull
    @Column(name = "userspecialization_identification")
    private String identification;
    
    public interface SummaryView {}
    public interface FullView extends SummaryView {}
}
