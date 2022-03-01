package com.swifftdial.identityservice.domains.dto;

import com.swifftdial.identityservice.domains.Actor;
import com.swifftdial.identityservice.domains.vo.Department;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.util.UUID;

@Getter
@Setter
public class RoleUpdateDTO {

    @NotNull
    private UUID publicId;
    private String name;
    private String description;
    private Actor actor;
    private Department department;
}
