package com.swifttdial.atservice.web;

import com.swifttdial.atservice.domains.IvrOption;
import com.swifttdial.atservice.domains.dto.LoggedInUserDetails;
import com.swifttdial.atservice.services.IvrOptionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/ivrOptions")
public class IvrOptionRestController {

    private final IvrOptionService ivrOptionService;

    public IvrOptionRestController(IvrOptionService ivrOptionService) {
        this.ivrOptionService = ivrOptionService;
    }

    @PostMapping
    public IvrOption createIvrOption(@RequestBody IvrOption ivrOption, LoggedInUserDetails loggedInUserDetails){
        log.error("###############################");
        log.error(loggedInUserDetails.toString());
        ivrOption.setTenant(loggedInUserDetails.getInstitution());
        return ivrOptionService.create(ivrOption);
    }

    @GetMapping
    public Page<IvrOption> fetchIvrOptionsSorted(@PageableDefault Pageable pageable, LoggedInUserDetails loggedInUserDetails){
        return ivrOptionService.fetchAllByTenantPage(loggedInUserDetails.getInstitution(), pageable);
    }

    @GetMapping("/{publicId}")
    public IvrOption  getIvrOption(@PathVariable("publicId") UUID publicId){
        return ivrOptionService.fetchByPublicId(publicId);
    }

    @PatchMapping("/{publicId}")
    public IvrOption updateIvrOption(@PathVariable("publicId") UUID publicId, @RequestBody IvrOption ivrOption, LoggedInUserDetails loggedInUserDetails){
        ivrOption.setTenant(loggedInUserDetails.getInstitution());
        return ivrOptionService.update(publicId, ivrOption);
    }

    @DeleteMapping("/{publicId}")
    public void  deleteIvrOption(@PathVariable("publicId") UUID publicId){
        ivrOptionService.delete(publicId);
    }
}
