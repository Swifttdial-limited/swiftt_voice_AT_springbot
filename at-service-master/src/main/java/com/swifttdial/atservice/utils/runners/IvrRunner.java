package com.swifttdial.atservice.utils.runners;

import com.swifttdial.atservice.datatypes.IvrOptionType;
import com.swifttdial.atservice.domains.Ivr;
import com.swifttdial.atservice.domains.IvrOption;
import com.swifttdial.atservice.services.IvrService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.net.URL;
import java.util.UUID;

//@Component
public class IvrRunner implements CommandLineRunner {

    private final IvrService ivrService;

    public IvrRunner(IvrService ivrService) {
        this.ivrService = ivrService;
    }

    @Override
    public void run(String... args) throws Exception {
        Ivr ivr = new Ivr();
        ivr.setTenant(UUID.fromString("b7e2bfcb-48a3-4f7c-9a59-2d8f0b1bc1e3"));
//        ivr.setInitialUrl(new URL("http", "34.121.219.244", 8081, "/api/v1/calls/b7e2bfcb-48a3-4f7c-9a59-2d8f0b1bc1e3/handle"));
        ivr.setInitialUrl(new URL("http://dev.swifttdial.com:8081/api/v1/calls/" + ivr.getTenant() + "/handle"));
        ivr.setDescription("Ivr for swifttdial");

        Ivr newIvr = ivrService.create(ivr);

        IvrOption ivrOption1 = new IvrOption();
        ivrOption1.setTenant(UUID.fromString("b7e2bfcb-48a3-4f7c-9a59-2d8f0b1bc1e3"));
        ivrOption1.setType(IvrOptionType.PLAY_AUDIO);
        ivrOption1.setAudioUrl(new URL("http://swifttdial.com/swifttdial/main_menu.mp3"));
        ivrOption1.setLevel(0);

        IvrOption ivrOption2 = new IvrOption();
        ivrOption2.setTenant(UUID.fromString("b7e2bfcb-48a3-4f7c-9a59-2d8f0b1bc1e3"));
        ivrOption2.setType(IvrOptionType.SPEAK_TO_AGENT);
        ivrOption2.setAudioUrl(new URL("http://swifttdial.com/callcentre/call_center_ringing.mp3"));
        ivrOption2.setLevel(1);

//        ivrService.addIvrOptions(newIvr.getPublicId(), ivrOption1);
//        ivrService.addIvrOptions(newIvr.getPublicId(), ivrOption2);
    }
}
