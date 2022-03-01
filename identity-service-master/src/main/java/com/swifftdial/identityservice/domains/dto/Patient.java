package com.swifftdial.identityservice.domains.dto;

import com.fasterxml.jackson.annotation.JsonView;

import javax.validation.constraints.NotNull;

import com.swifftdial.identityservice.domains.User;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class Patient {

    private String id;

    @JsonView({CreateView.class})
    @NotNull
    private User user;

    private String patientNumber;

    public Patient(User user) {
        this.user = user;
    }

    public interface CreateView {}
}
