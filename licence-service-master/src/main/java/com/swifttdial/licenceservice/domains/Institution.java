package com.swifttdial.licenceservice.domains;

import com.swifttdial.licenceservice.domains.vo.Address;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Getter
@Setter
@ToString
@Entity
@Table(schema = "institutions", name = "institutions")
public class Institution extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "institution_id")
    private Long id;

    @Column(name = "institution_version")
    @Version
    private Long version;

    @Column(name = "institution_institutionname")
    private String institutionName;

    @Column(name = "institution_legalname")
    private String legalName;

    @Column(name = "institution_phonenumber")
    private String phoneNumber;

    @Column(name = "institution_emailaddress")
    private String emailAddress;

    @Column(name = "institution_customerfacingemailaddress")
    private String customerFacingEmailAddress;

    @Column(name = "institution_alternativephonenumber")
    private String alternativePhoneNumber;

    @Column(name = "institution_websiteurl")
    private String websiteUrl;

    @Embedded
    private Address address;

    @Column(name = "institution_hospital_code")
    private String code;

    @Column(name = "institution_logo")
    private String logo;

    @Column(name = "institution_tagline")
    private String tagline;

    @Column(name = "institution_taxidentificationnumber")
    private String taxIdentificationNumber;

    @Column(name = "institution_registrationnumber")
    private String registrationNumber;

    @Column(name = "institution_alternativeregistrationnumber")
    private String alternativeRegistrationNumber;

    private String atUsername;

}