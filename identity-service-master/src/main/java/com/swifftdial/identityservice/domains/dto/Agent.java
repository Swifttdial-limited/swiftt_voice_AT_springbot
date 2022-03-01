package com.swifftdial.identityservice.domains.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

@Getter
@Setter
@ToString
public class Agent implements Serializable {

    private String phoneNumber;

    private boolean sipId;
}
