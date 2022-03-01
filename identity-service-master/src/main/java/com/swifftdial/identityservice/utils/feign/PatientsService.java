package com.swifftdial.identityservice.utils.feign;

import org.springframework.stereotype.Service;

@Service
public class PatientsService {

    private final PatientFeignClient patientFeignClient;

    public PatientsService(PatientFeignClient patientFeignClient) {
        this.patientFeignClient = patientFeignClient;
    }
}
