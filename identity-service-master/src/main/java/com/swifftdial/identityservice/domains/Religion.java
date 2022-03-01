package com.swifftdial.identityservice.domains;

import com.fasterxml.jackson.annotation.JsonView;

import org.hibernate.annotations.Where;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Version;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@Entity
@Table(name = "religions", schema = "core")
@Where(clause = "deleted = false")
public class Religion extends BaseEntity {

    @JsonView(User.CreatePatientView.class)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "religion_id")
    private Long id;

    @JsonView(User.CreatePatientView.class)
    @Version
    @Column(name = "religion_version")
    private Long version;

    @JsonView(User.CreatePatientView.class)
    @Column(name = "religion_name", nullable = false)
    private String name;

    public Religion(String name) {
        this.name = name;
    }
}
