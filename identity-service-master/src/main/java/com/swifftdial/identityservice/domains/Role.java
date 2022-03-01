package com.swifftdial.identityservice.domains;

import com.fasterxml.jackson.annotation.JsonView;
import com.swifftdial.identityservice.domains.vo.Department;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(schema = "core", name = "roles")
@Where(clause = "deleted = false")
public class Role extends BaseEntity {

    @JsonView({Summary.class, OrganogramNode.View.class})
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private Long id;

    @JsonView({Summary.class, OrganogramNode.View.class})
    @Version
    @Column(name = "role_version")
    private Long version;

    @JsonView({Summary.class, OrganogramNode.View.class, User.LoginView.class, User.Full.class})
    @NotNull
    @Column(name = "role_name", nullable = false)
    private String name;

    @JsonView(Summary.class)
    @Column(name = "role_description")
    private String description;

    @JsonView({Summary.class, OrganogramNode.View.class, User.LoginView.class, User.Full.class})
    @ManyToOne
    @JoinColumn(name = "role_actor_id_fk")
    private Actor actor;

    @JsonView({Summary.class, OrganogramNode.View.class, User.LoginView.class, User.Full.class})
    @Embedded
    private Department department;

    @JsonView(Full.class)
    @ManyToMany(mappedBy="roles")
    private List<User> systemUsers;

    @JsonView({Role.Full.class, User.LoginView.class})
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "role_privileges", schema = "core",
            joinColumns = @JoinColumn(name = "role_id_fk"),
            inverseJoinColumns = @JoinColumn(name = "privilege_id_fk"))
    private Collection<Privilege> privileges = new ArrayList<>();

    public Role(String name, Actor actor) {
        this.name = name;
        this.actor = actor;
    }

    public void addPrivilege(Privilege privilege) {
        privileges.add(privilege);
    }

    public void removePrivilege(Privilege privilege) { privileges.remove(privilege); }

    public Actor getActor() {
        return actor;
    }

    public interface RoleView{}

    public interface RoleUpdate{}

    public interface Summary {}

    public interface Full extends Summary {}

}