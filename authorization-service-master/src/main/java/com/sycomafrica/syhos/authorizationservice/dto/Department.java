package com.sycomafrica.syhos.authorizationservice.dto;

import lombok.Data;

import java.util.UUID;

/**
 * Created by olanga on 11/9/16.
 */
@Data
public class Department {
    private UUID publicId;
    private String name;
}