package com.swifftdial.identityservice.domains;

import com.fasterxml.jackson.annotation.JsonView;
import com.swifftdial.identityservice.datatypes.Status;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(schema = "core", name = "actors")
@Where(clause = "deleted = false")
public class Actor extends BaseEntity {

    @JsonView({Role.Summary.class, UserSpecialization.SummaryView.class})
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "actor_id")
    private Long id;

    @JsonView({Role.Summary.class, UserSpecialization.SummaryView.class})
    @Version
    @Column(name = "actor_version")
    private Long version;

    @JsonView({Role.Summary.class, OrganogramNode.View.class, UserSpecialization.SummaryView.class, User.Full.class, User.LoginView.class})
    @NotNull
    @Column(name = "actor_name")
    private String name;

    @JsonView({Role.Summary.class, UserSpecialization.SummaryView.class})
    @Column(name = "actor_description")
    private String description;

    @Column(name = "actor_status")
    private Status status;

    public Actor(String actorName, String description) {
        this.name = actorName;
        this.description = description;
    }
}