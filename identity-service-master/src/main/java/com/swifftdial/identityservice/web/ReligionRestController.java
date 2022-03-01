package com.swifftdial.identityservice.web;

import com.swifftdial.identityservice.domains.Religion;
import com.swifftdial.identityservice.services.ReligionService;
import com.swifftdial.identityservice.utils.exceptions.BadRequestRestApiException;
import com.swifftdial.identityservice.domains.dto.LoggedInUserDetails;
import org.apache.commons.lang.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/religions")
public class ReligionRestController{

    private final ReligionService religionService;

    public ReligionRestController(ReligionService service) {
        this.religionService = service;
    }

    @PreAuthorize("hasAuthority('CREATE_RELIGION')")
    @PostMapping
    public Religion create(@RequestBody Religion religion, LoggedInUserDetails loggedInUserDetails) {
        religion.setTenant(loggedInUserDetails.getInstitution());
        return religionService.create(religion);
    }

    @PreAuthorize("hasAuthority('READ_RELIGIONS')")
    @GetMapping
    public Page<Religion> fetchAllSorted(@RequestParam(required = false, name = "searchQueryParam") String searchQueryParam,
                                         @PageableDefault(sort = "name", size = 20) Pageable pageable,
                                         LoggedInUserDetails loggedInUserDetails) {
        if (!StringUtils.isEmpty(searchQueryParam)) {
            if (searchQueryParam.length() > 2)
                return religionService.fetchByNameContaining(loggedInUserDetails.getInstitution(), searchQueryParam, pageable);
            else
                throw new BadRequestRestApiException()
                        .developerMessage("Search Query Parameter must be longer than 2 characters")
                        .userMessage("Search Query Parameter must be longer than 2 characters");
        } else {
            return religionService.fetchAll(loggedInUserDetails.getInstitution(), pageable);
        }
    }

    @PreAuthorize("hasAuthority('UPDATE_RELIGION')")
    @PatchMapping("/{religionPublicId}")
    public Religion update(@PathVariable UUID religionPublicId,
                           @RequestBody Religion religion,
                           LoggedInUserDetails loggedInUserDetails) {
        return religionService.update(loggedInUserDetails.getInstitution(), religionPublicId, religion);
    }

    @PreAuthorize("hasAuthority('DELETE_RELIGION')")
    @DeleteMapping("/{religionPublicId}")
    public void delete(@PathVariable UUID religionPublicId, LoggedInUserDetails loggedInUserDetails) {
        religionService.delete(loggedInUserDetails.getInstitution(), religionPublicId);
    }
}
