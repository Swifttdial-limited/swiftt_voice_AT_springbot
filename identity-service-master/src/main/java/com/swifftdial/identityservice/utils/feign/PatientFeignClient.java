package com.swifftdial.identityservice.utils.feign;

import org.springframework.cloud.netflix.feign.FeignClient;

@FeignClient("patient-service")
public interface PatientFeignClient {
}
