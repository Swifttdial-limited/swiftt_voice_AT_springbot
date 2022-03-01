package com.swifftdial.identityservice.domains;

import com.fasterxml.jackson.annotation.JsonView;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@ToString
@NoArgsConstructor
@Entity
@Table(name = "titles", schema = "core")
@Where(clause = "deleted = false")
public class Title extends BaseEntity {

    @JsonView({User.CreatePatientView.class, User.Full.class, User.ProfileView.class})
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "title_id")
    private Long id;

    @JsonView({User.CreatePatientView.class, User.Full.class, User.ProfileView.class})
    @Version
    @Column(name = "tile_version")
    private Long version;

    @JsonView({User.CreatePatientView.class, User.Full.class, User.ProfileView.class})
    @NotNull(groups = Title.Create.class, message = "You must specify the title")
    @Column(name = "title_name")
    private String name;

    public Title(String name) {
        this.name = name;
    }

    public interface Create {}

}
