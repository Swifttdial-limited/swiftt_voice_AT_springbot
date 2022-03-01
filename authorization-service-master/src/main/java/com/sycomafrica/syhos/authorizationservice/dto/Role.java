package com.sycomafrica.syhos.authorizationservice.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Created by olanga on 11/9/16.
 */
@Data
public class Role {

    private UUID publicId;
    private String name;
    private Actor actor;
    private Department department;
    private List<Privilege> privileges = new ArrayList<>();

}