package com.swifftdial.identityservice.domains.vo;

import com.fasterxml.jackson.annotation.JsonView;
import com.swifftdial.identityservice.domains.OrganogramNode;
import com.swifftdial.identityservice.domains.Role;
import com.swifftdial.identityservice.domains.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@Embeddable
public class Department {

    @JsonView({Role.Summary.class, User.LoginView.class})
    @Column(name = "department_id")
    private UUID publicId;

    @JsonView({Role.Summary.class, OrganogramNode.View.class, User.Full.class, User.LoginView.class})
    @Column(name = "department_name")
    private String name;

}