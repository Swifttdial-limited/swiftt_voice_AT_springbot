package com.swifftdial.identityservice.domains;

import com.fasterxml.jackson.annotation.JsonView;
import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(schema = "systemusers", name = "organogram_nodes")
public class OrganogramNode extends BaseEntity {

    @JsonView(OrganogramNode.View.class)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private long id;

    @JsonView(OrganogramNode.View.class)
    @Version
    private long version;

    @JsonView(OrganogramNode.View.class)
    @OneToOne
    @JoinColumn(name = "role_id_fk")
    private Role role;

    @JsonView(OrganogramNode.View.class)
    @ManyToOne
    @JoinColumn(name = "parentrole_id_fk")
    private Role parentRole;

    public OrganogramNode(Role role) {
        this.role = role;
    }

    public OrganogramNode(Role role, Role parentRole) {
        this.role = role;
        this.parentRole = parentRole;
    }

    public interface View {}
}
