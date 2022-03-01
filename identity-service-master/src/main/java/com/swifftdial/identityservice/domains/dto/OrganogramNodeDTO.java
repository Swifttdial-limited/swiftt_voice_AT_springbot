package com.swifftdial.identityservice.domains.dto;

import com.swifftdial.identityservice.domains.OrganogramNode;
import com.swifftdial.identityservice.domains.Role;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.UUID;

@Getter
@Setter
@ToString
public class OrganogramNodeDTO extends Role {

    @JsonView(OrganogramNode.View.class)
    private long nodeId;

    @JsonView(OrganogramNode.View.class)
    private long nodeVersion;

    @JsonView(OrganogramNode.View.class)
    private UUID nodePublicId;

    @JsonView(OrganogramNode.View.class)
    private Role parent;
}
