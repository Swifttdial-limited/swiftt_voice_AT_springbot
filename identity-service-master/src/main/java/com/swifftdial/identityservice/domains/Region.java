package com.swifftdial.identityservice.domains;

import com.fasterxml.jackson.annotation.JsonView;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Where;

import javax.persistence.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@Entity
@Table(name = "regions", schema = "core")
@Where(clause = "deleted = false")
public class Region extends BaseEntity {

    @JsonView({User.CreatePatientView.class, User.Full.class, User.ProfileView.class})
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "region_id")
    private Long id;

    @JsonView({User.CreatePatientView.class, User.Full.class, User.ProfileView.class})
    @Version
    @Column(name = "region_version")
    private Long version;

    @JsonView({User.CreatePatientView.class, User.Full.class, User.ProfileView.class})
    @Column(name = "region_name", nullable = false)
    private String name;

    public Region(String name) {
        this.name = name;
    }
}
