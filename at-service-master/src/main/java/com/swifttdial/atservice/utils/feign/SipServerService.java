package com.swifttdial.atservice.utils.feign;

import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;
import com.swifttdial.atservice.domains.vo.SipServerResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
public class SipServerService {

    private final SipServerFeignClient sipServerFeignClient;

    public SipServerService(SipServerFeignClient sipServerFeignClient) {
        this.sipServerFeignClient = sipServerFeignClient;
    }

    @HystrixCommand(fallbackMethod = "makeCallFallback")
    public Optional<SipServerResponse> makeCall(Map<String, String> params){
        return Optional.of(sipServerFeignClient.makeCall(params));
    }

    public Optional<String> makeCallFallback(Map<String, String> params){
        return Optional.empty();
    }
}
