package com.swifftdial.identityservice.domains;

import com.fasterxml.jackson.annotation.JsonView;

import org.hibernate.annotations.Where;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Version;
import javax.validation.constraints.NotNull;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * Different kinds of user userIdentifications eg. ID,PASSPORT etc
 */
@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
@Table(schema = "systemusers", name = "user_identifications")
@Where(clause = "deleted = false")
public class UserIdentification extends BaseEntity {

    @JsonView(User.CreatePatientView.class)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "useridentification_id")
    @NotNull(groups = {User.UpdateView.class})
    private Long id;

    @JsonView(User.CreatePatientView.class)
    @Version
    @Column(name = "useridentification_version")
    @NotNull(groups = User.UpdateView.class)
    private Long version;

    @JsonView(User.CreatePatientView.class)
    @Column(name = "useridentification_identification")
    private String identification;

    @JsonView(User.CreatePatientView.class)
    @ManyToOne
    @JoinColumn(name = "identification_type_fk")
    private IdentificationType identificationType;

    @ManyToOne
    @JoinColumn(name = "user_id_fk")
    private User user;
}
