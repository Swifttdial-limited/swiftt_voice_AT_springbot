package com.swifftdial.identityservice.domains;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import com.swifftdial.identityservice.datatypes.Gender;
import com.swifftdial.identityservice.datatypes.NextOfKinRelationshipType;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Where;

import javax.persistence.*;

@Getter
@Setter
@ToString
@Entity
@Table(schema = "systemusers", name = "next_of_kins")
@Where(clause = "deleted = false")
public class NextOfKin extends BaseEntity {

    @Id
    @Column(name = "nextofkin_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonView(User.CreatePatientView.class)
    @Enumerated(EnumType.STRING)
    @Column(name = "nextofkin_relationshiptype")
    private NextOfKinRelationshipType relationshipType;

    @JsonView(User.CreatePatientView.class)
    @Column(name = "nextofkin_firstname")
    private String firstName;

    @JsonView(User.CreatePatientView.class)
    @Column(name = "nextofkin_surname")
    private String surname;

    @JsonView(User.CreatePatientView.class)
    @Column(name = "nextofkin_othernames")
    private String otherNames;

    @Enumerated(EnumType.STRING)
    @Column(name = "nextofkin_gender")
    private Gender gender;

    @Column(name = "nextofkin_phonenumber")
    private String phoneNumber;

    @Column(name = "nextofkin_emailaddress")
    private String emailAddress;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "nextofkin_user_id_fk", updatable = false)
    private User user;

    @Transient
    private String fullName;

    public String getFullName() {
        StringBuilder sb = new StringBuilder();
        sb.append(firstName).append(" ").append(surname);
        if (otherNames != null)
            sb.append(" ").append(otherNames);
        return sb.toString();
    }

}
