package com.swifftdial.identityservice.domains;

import com.fasterxml.jackson.annotation.JsonView;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@NoArgsConstructor
@ToString
@Entity
@Table(schema = "core", name = "identification_types")
@Where(clause = "deleted = false")
public class IdentificationType extends BaseEntity {

    @JsonView(User.CreatePatientView.class)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "identificationtype_id")
    @NotNull(groups = {User.UpdateView.class, User.CreatePatientView.class})
    private Long id;

    @JsonView(User.CreatePatientView.class)
    @Version
    @Column(name = "identificationtype_version")
    @NotNull(groups = {User.UpdateView.class, User.CreatePatientView.class})
    private Long version;

    @JsonView({User.Full.class, UserSpecialization.SummaryView.class})
    @NotNull
    @Column(name = "identificationtype_name")
    private String name;

    @Column(name = "identificationtype_code")
    private String code;

    @Min(0)
    @Column(name = "identificationtype_minimumrequiredage")
    private Integer minimumRequiredAge;

    @Column(name = "identificationtype_person", columnDefinition = "boolean default false")
    private boolean person;

    @Column(name = "identificationtype_contact", columnDefinition = "boolean default false")
    private boolean contact;

}
