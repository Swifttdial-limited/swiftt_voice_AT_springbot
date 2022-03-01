package com.sycomafrica.syhos.authorizationservice.utils;

import com.sycomafrica.syhos.authorizationservice.dto.User;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

/**
 * Created by olanga on 11/3/16.
 */
@FeignClient("identity-service")
public interface SystemUserServiceFeignClient {

    @RequestMapping(method = GET, value = "/internal/users/search/byUsername")
    User fetchSystemUserByUsername(@RequestParam("username") String username);

}