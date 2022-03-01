package com.swifftdial.identityservice.web;

import com.swifftdial.identityservice.domains.Region;
import com.swifftdial.identityservice.services.RegionService;
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
@RequestMapping("/regions")
public class RegionRestController {

    private final RegionService regionService;

    public RegionRestController(RegionService service) {
        this.regionService = service;
    }

    @PreAuthorize("hasAuthority('CREATE_REGION')")
    @PostMapping
    public Region create(@RequestBody Region region, LoggedInUserDetails loggedInUserDetails) {
        region.setTenant(loggedInUserDetails.getInstitution());
        return regionService.create(region);
    }

    @PreAuthorize("hasAuthority('READ_REGIONS')")
    @GetMapping
    public Page<Region> fetchAllSorted(@RequestParam(required = false, name = "searchQueryParam") String searchQueryParam,
                                       @PageableDefault(sort = "name", size = 20) Pageable pageable,
                                       LoggedInUserDetails loggedInUserDetails) {
        if (!StringUtils.isEmpty(searchQueryParam)) {
            if (searchQueryParam.length() > 2)
                return regionService.fetchByNameContaining(loggedInUserDetails.getInstitution(), searchQueryParam, pageable);
            else
                throw new BadRequestRestApiException()
                        .developerMessage("Search query Parameter must be longer than 2 characters")
                        .userMessage("Search query Parameter must be longer than 2 characters");
        } else {
            return regionService.fetchAll(loggedInUserDetails.getInstitution(), pageable);
        }
    }

    @PreAuthorize("hasAuthority('UPDATE_REGION')")
    @PatchMapping("/{regionPublicId}")
    public Region update(@PathVariable UUID regionPublicId,
                         @RequestBody Region region,
                         LoggedInUserDetails loggedInUserDetails) {
        return regionService.update(loggedInUserDetails.getInstitution(), regionPublicId, region);
    }

    @PreAuthorize("hasAuthority('DELETE_REGION')")
    @DeleteMapping("/{regionPublicId}")
    public void delete(@PathVariable UUID regionPublicId, LoggedInUserDetails loggedInUserDetails) {
        regionService.delete(loggedInUserDetails.getInstitution(), regionPublicId);
    }

}
