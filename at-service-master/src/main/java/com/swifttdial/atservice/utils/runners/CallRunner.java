package com.swifttdial.atservice.utils.runners;

import com.swifttdial.atservice.domains.dto.MakeCallDTO;
import com.swifttdial.atservice.services.CallService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

//@Component
//@Order(100)
public class CallRunner implements CommandLineRunner {

    private final CallService callService;

    public CallRunner(CallService callService) {
        this.callService = callService;
    }

    @Override
    public void run(String... args){
        callService.makeCall(new MakeCallDTO());
    }
}
