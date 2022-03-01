package com.swifftdial.identityservice.web;

import com.swifftdial.identityservice.domains.OrganogramNode;
import com.swifftdial.identityservice.services.OrganogramService;
import com.swifftdial.identityservice.domains.dto.LoggedInUserDetails;
import com.swifftdial.identityservice.domains.dto.OrganogramNodeDTO;
import com.fasterxml.jackson.annotation.JsonView;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/organogramNodes")
public class OrganogramNodeRestController {

    private final OrganogramService organogramService;

    public OrganogramNodeRestController(OrganogramService organogramService) {
        this.organogramService = organogramService;
    }

    @PreAuthorize("hasAuthority('UPDATE_ROLE_HIERARCHY')")
    @PostMapping
    public OrganogramNodeDTO createNode(@RequestBody OrganogramNode newOrganogramNode,
                                        LoggedInUserDetails loggedInUserDetails) {
        newOrganogramNode.setTenant(loggedInUserDetails.getInstitution());
        return organogramService.createNode(newOrganogramNode);
    }

    @PreAuthorize("hasAuthority('UPDATE_ROLE_HIERARCHY')")
    @JsonView(OrganogramNode.View.class)
    @GetMapping
    public Page<OrganogramNodeDTO> getNodes(@PageableDefault(size = 100) Pageable pageable,
                                            LoggedInUserDetails loggedInUserDetails) {
        return organogramService.fetchOrganogram(loggedInUserDetails.getInstitution(), pageable);
    }

    @PreAuthorize("hasAuthority('UPDATE_ROLE_HIERARCHY')")
    @PatchMapping("/{organogramNodePublicId}")
    public OrganogramNodeDTO updateNode(@PathVariable("organogramNodePublicId") UUID organogramNodePublicId,
                                        @RequestBody OrganogramNode updatedOrganogramNode,
                                        LoggedInUserDetails loggedInUserDetails) {
        return organogramService.updateNode(loggedInUserDetails.getInstitution(), organogramNodePublicId, updatedOrganogramNode);
    }

    @PreAuthorize("hasAuthority('UPDATE_ROLE_HIERARCHY')")
    @DeleteMapping("/{organogramNodePublicId}")
    public void deleteNode(@PathVariable("organogramNodePublicId") UUID organogramNodePublicId,
                           LoggedInUserDetails loggedInUserDetails) {
        organogramService.deleteNode(loggedInUserDetails.getInstitution(), organogramNodePublicId);
    }
}
