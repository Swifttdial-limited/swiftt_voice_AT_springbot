package com.swifftdial.identityservice.web;

import com.swifftdial.identityservice.domains.Privilege;
import com.swifftdial.identityservice.services.PrivilegeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by gathigai on 9/15/16.
 */
@RestController
@RequestMapping("/privileges")
public class PrivilegesRestController {

    private final PrivilegeService privilegeService;

    public PrivilegesRestController(PrivilegeService privilegeService) {
        this.privilegeService = privilegeService;
    }

    @PreAuthorize("hasAuthority('READ_PRIVILEGES')")
    @GetMapping
    Page<Privilege> getPrivileges(@PageableDefault(sort = "privilegeGroup", size = 1000)Pageable pageable) {
        return privilegeService.fetchGlobalPrivileges(pageable);
    }

}