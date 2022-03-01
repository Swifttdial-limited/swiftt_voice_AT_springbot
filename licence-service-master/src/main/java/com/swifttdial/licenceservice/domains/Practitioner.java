package com.swifttdial.licenceservice.domains;

import com.swifttdial.licenceservice.datatypes.PractitionerType;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.validator.constraints.Email;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@ToString
@Entity
@Table(schema = "practitioners", name = "practitioners")
public class Practitioner extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "practitioner_id")
    private Long id;

    @Column(name = "practitioner_version")
    private Long version;

    @Enumerated(EnumType.STRING)
    @Column(name = "practitioner_type")
    private PractitionerType type;

    @Column(name = "practitioner_firstname")
    private String firstName;

    @Column(name = "practitioner_surname")
    private String surname;

    @Column(name = "practitioner_othername")
    private String otherNames;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @Column(name = "practitioner_dateofbirth")
    private Date dateOfBirth;

    @Column(name = "practitioner_gender")
    private Gender gender;

    @Column(name = "practitioner_phonenumber", unique = true)
    private String phoneNumber;

    @Email
    @Column(name = "practitioner_emailaddress", unique = true)
    private String emailAddress;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @Column(name = "practitioner_registrationdate")
    private Date registrationDate;

    @Column(name = "practitioner_identificationnumber", unique = true)
    private String identificationNumber;

    private String photo;
    private String fingerprint;

    @OneToMany
    private List<Specialization> specializations = new ArrayList<>();

    @Transient
    private String fullName;

    public String getFullName() {
        StringBuilder sb = new StringBuilder();
        sb.append(firstName).append(" ").append(surname);
        if (otherNames != null)
            sb.append(" ").append(otherNames);
        return sb.toString();
    }

    enum Gender {
        MALE, FEMALE, OTHER
    }
}