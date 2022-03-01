package com.swifftdial.identityservice.domains;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;

@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false, of = {"id"})
@Entity
@Table(schema = "core", name = "privileges")
public class Privilege implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "privilege_id")
    private Long id;

    @Version
    @Column(name = "privilege_version")
    private Long version;

    @Column(name = "privilege_default", columnDefinition = "boolean default false")
    private boolean assignedByDefault;

    @Column(name = "privilege_global", columnDefinition = "boolean default false")
    private boolean global;

    @JsonView({Role.Full.class, User.LoginView.class})
    @NotNull
    @Column(name = "privilege_code", unique = true, updatable = false)
    private String code;

    @JsonView(Role.Full.class)
    @NotNull
    @Column(name = "privilege_name", unique = true)
    private String name;

    @JsonView(Role.Full.class)
    @NotNull
    @Column(name = "privilege_description")
    private String description;

    @JsonView(Role.Full.class)
    @NotNull
    @Column(name = "privilege_group")
    private String privilegeGroup;

    @JsonIgnore
    @ManyToMany(mappedBy = "privileges")
    private Collection<Role> roles = new ArrayList<>();

    public Privilege(String privilegeGroup, String code, String name, String description, boolean global, boolean assignedByDefault) {
        this.privilegeGroup = privilegeGroup;
        this.code = code;
        this.name = name;
        this.description = description;
        this.global = global;
        this.assignedByDefault = assignedByDefault;
    }
}
