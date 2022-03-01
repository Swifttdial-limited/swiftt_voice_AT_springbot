package com.swifftdial.identityservice.domains;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Where;

import javax.persistence.*;

@Getter
@Setter
@ToString
@Entity
@Table(schema = "core", name = "departments")
@Where(clause = "deleted = false")
public class Department extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "department_id")
    private Long id;

    @Column(name = "department_version")
    @Version
    private Long version;

    @Column(name = "department_name")
    private String name;

    @Column(name = "department_code")
    private String code;

//    @Column(name = "department_is_bill_creation_allowed", columnDefinition = "boolean default true")
//    private boolean billCreationAllowed;

    @Column(name = "department_is_billing", columnDefinition = "boolean default false")
    private boolean billingAllowed;

    @Column(name = "department_is_ward", columnDefinition = "boolean default false")
    private boolean ward;

    @Column(name = "department_ismerchant", columnDefinition = "boolean default false")
    private boolean merchantDepartment;

    @Column(name = "department_isinvoicingDepartment", columnDefinition = "boolean default false")
    private boolean invoicingDepartment;

    @ManyToOne
    @JoinColumn(name = "parent_id_fk")
    private Department parentDepartment;
}
