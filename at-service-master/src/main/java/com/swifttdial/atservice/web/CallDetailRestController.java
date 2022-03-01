package com.swifttdial.atservice.web;

import com.swifttdial.atservice.domains.CallDetail;
import com.swifttdial.atservice.domains.CallProfile;
import com.swifttdial.atservice.domains.dto.LoggedInUserDetails;
import com.swifttdial.atservice.services.CallDetailService;
import com.swifttdial.atservice.services.CallProfileService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/callDetails")
public class CallDetailRestController {

    private final CallDetailService callDetailService;

    public CallDetailRestController(CallDetailService callDetailService) {
        this.callDetailService = callDetailService;
    }

    @PostMapping
    public CallDetail createCallDetail(@RequestBody CallDetail callDetail, LoggedInUserDetails loggedInUserDetails){
        callDetail.setTenant(loggedInUserDetails.getInstitution());
        return callDetailService.createCallDetail(callDetail);
    }

    @GetMapping("/{publicId}")
    public CallDetail fetchOne(@PathVariable UUID publicId){
        return callDetailService.findByPublicId(publicId);
    }

    @GetMapping
    public Page<CallDetail> fetchSorted(@RequestParam UUID callPublicId, @PageableDefault(size = 20, sort = "createdDate", direction = Sort.Direction.DESC) Pageable pageable){
        return callDetailService.findSortedByCall(callPublicId, pageable);
    }

    @PatchMapping("/{publicId}")
    public CallDetail update(@PathVariable UUID publicId, @RequestBody CallDetail callDetail, LoggedInUserDetails loggedInUserDetails){
        callDetail.setUpdatedBy(loggedInUserDetails.getClientId());
        return callDetailService.updateCallDetail(publicId, callDetail);
    }

    @DeleteMapping("/{publicId}")
    public void delete(@PathVariable UUID publicId){
        callDetailService.deleteCallDetail(publicId);
    }
}
