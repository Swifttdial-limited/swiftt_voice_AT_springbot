package com.swifttdial.atservice.web;

import com.swifttdial.atservice.domains.Ivr;
import com.swifttdial.atservice.domains.IvrOption;
import com.swifttdial.atservice.domains.dto.LoggedInUserDetails;
import com.swifttdial.atservice.services.IvrService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/ivr")
public class IvrRestController {

    private final IvrService ivrService;

    public IvrRestController(IvrService ivrService) {
        this.ivrService = ivrService;
    }

    @PostMapping
    public Ivr createIvr(@RequestBody Ivr ivr, LoggedInUserDetails loggedInUserDetails) {
        ivr.setTenant(loggedInUserDetails.getInstitution());
        return ivrService.create(ivr);
    }

    @GetMapping
    public Page<Ivr> getSortedIvrPage(@PageableDefault Pageable pageable, LoggedInUserDetails loggedInUserDetails) {
        return ivrService.fetchSorted(pageable);
    }

    @GetMapping("/{publicId}")
    public Ivr getIvrBYPublicId(@PathVariable("publicId") UUID publicId, LoggedInUserDetails loggedInUserDetails) {
        return ivrService.fetchByPublicId(publicId);
    }

    @PatchMapping("/{publicId}")
    public Ivr patchIvr(@PathVariable("publicId") UUID publicId, @RequestBody Ivr updatedIvr, LoggedInUserDetails loggedInUserDetails) {
        updatedIvr.setUpdatedBy(loggedInUserDetails.getClientId());
        return ivrService.update(publicId, updatedIvr);
    }

    @DeleteMapping("/{publicId}")
    public void deleteIvr(@PathVariable("publicId") UUID publicId) {
        ivrService.delete(publicId);
    }

    @GetMapping("/query/byTenant/{tenant}")
    public Ivr fetchByTenant(@PathVariable("tenant") UUID tenant){
        return ivrService.fetchByTenant(tenant);
    }

//    @PostMapping("/{publicId}/options")
//    public IvrOption addIvrOption(@PathVariable("publicId") UUID publicId, @RequestBody IvrOption ivrOption, LoggedInUserDetails loggedInUserDetails) {
//        ivrOption.setTenant(loggedInUserDetails.getInstitution());
//        return ivrService.addIvrOptions(publicId, ivrOption);
//    }
}
