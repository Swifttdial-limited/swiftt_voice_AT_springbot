package com.swifttdial.atservice.web;

import com.swifttdial.atservice.domains.CallDetail;
import com.swifttdial.atservice.domains.CallProfile;
import com.swifttdial.atservice.domains.dto.LoggedInUserDetails;
import com.swifttdial.atservice.services.CallProfileService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/callProfiles")
public class CallProfileRestController {

    private final CallProfileService callProfileService;

    public CallProfileRestController(CallProfileService callProfileService) {
        this.callProfileService = callProfileService;
    }

    @PostMapping
    public CallProfile createCallProfile(@RequestBody CallProfile callProfile, LoggedInUserDetails loggedInUserDetails){
        callProfile.setTenant(loggedInUserDetails.getInstitution());
        return callProfileService.createProfile(callProfile);
    }

    @GetMapping("/{publicId}")
    public CallProfile fetchOne(@PathVariable UUID publicId){
        return callProfileService.fetchProfileByPublicId(publicId);
    }

    @GetMapping
    public Page<CallProfile> fetchSorted(@PageableDefault Pageable pageable){
        return callProfileService.fetchProfilesSorted(pageable);
    }

    @PatchMapping("/{publicId}")
    public CallProfile update(@PathVariable UUID publicId, @RequestBody CallProfile callProfile, LoggedInUserDetails loggedInUserDetails){
        callProfile.setUpdatedBy(loggedInUserDetails.getClientId());
        return callProfileService.updateProfile(publicId, callProfile);
    }

    @DeleteMapping("/{publicId}")
    public void delete(@PathVariable UUID publicId){
        callProfileService.deleteProfile(publicId);
    }
}
