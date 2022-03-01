package com.swifttdial.licenceservice.domains;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Getter
@Setter
@ToString
@Entity
@Table(schema = "core", name = "specializations")
public class Specialization extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "specialization_id")
    private Long id;

    @Column(name = "specialization_version")
    private Long version;

    @Column(name = "specialization_name")
    private String name;
}
