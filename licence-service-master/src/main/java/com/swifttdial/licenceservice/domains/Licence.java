package com.swifttdial.licenceservice.domains;

import com.swifttdial.licenceservice.datatypes.LicenseType;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.util.Date;

@Getter
@Setter
@ToString
@Entity
@Table(schema = "institutions", name = "licences")
public class Licence extends BaseEntity {

    @Column(name = "licence_id")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "licence_version")
    @Version
    private Long version;

    @Column(name = "licence_licencetype")
    @Enumerated(EnumType.STRING)
    private LicenseType licenseType;

    @ManyToOne
    @JoinColumn(name = "licence_institution_id_fk")
    private Institution institution;

    // TimeZone

    // should be aware of timeZone of institution
    @Column(name = "licence_issuedate")
    private Date issueDate;

    // should be aware of timeZone of institution
    @Column(name = "licence_expirydate")
    private Date expiryDate;

    @Column(name = "licence_active")
    private boolean active;

}