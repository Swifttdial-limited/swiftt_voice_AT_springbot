package com.swifttdial.atservice.domains;

import com.swifttdial.atservice.domains.BaseEntity;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Where;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.UUID;

@Getter
@Setter
@ToString
@Entity
@Table(schema = "systemusers", name = "users")
@Where(clause = "deleted =false")
public class User extends BaseEntity {
    @Id
    @Column(name = "user_id")
    private Long id;

    @Column(name = "user_version")
    private Long version;

    @Column(name = "user_firstname")
    private String firstName;

    @Column(name = "user_surname")
    private String surname;

    @Column(name = "user_othernames")
    private String otherNames;

    @Column(name = "user_enabled", nullable = false, updatable = false)
    private boolean enabled;
}
