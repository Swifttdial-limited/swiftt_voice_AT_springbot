package com.swifttdial.atservice.utils.feign;

import com.swifttdial.atservice.domains.vo.SipServerResponse;
import feign.Headers;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.Map;

@FeignClient(url = "https://ke.sip.swifttdial.com", name = "sip-server")
public interface SipServerFeignClient {

    @RequestMapping(method = RequestMethod.POST, value = "/extension", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_XML_VALUE)
    SipServerResponse createExtension(Map<String, String> params);


    @RequestMapping(method = RequestMethod.DELETE, value = "/extension", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_XML_VALUE)
    SipServerResponse deleteExtension(Map<String, String> params);

    @RequestMapping(method = RequestMethod.POST, value = "/call", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_XML_VALUE)
    SipServerResponse makeCall(@RequestBody Map<String, String> params);
}
