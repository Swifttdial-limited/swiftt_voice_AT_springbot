package com.swifttdial.atservice.web;

import com.swifttdial.atservice.domains.Call;
import com.swifttdial.atservice.domains.dto.CallCountTotalDto;
import com.swifttdial.atservice.domains.dto.CallDto;
import com.swifttdial.atservice.domains.dto.LoggedInUserDetails;
import com.swifttdial.atservice.domains.dto.MakeCallDTO;
import com.swifttdial.atservice.domains.dto.cdr.Cdr;
import com.swifttdial.atservice.services.CallService;
import com.swifttdial.atservice.utils.validators.Validators;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/calls")
public class CallRestController {

    private final CallService callService;

    public CallRestController(CallService callService) {
        this.callService = callService;
    }

    @GetMapping
    public Page<Call> getSortedCallsPage(@RequestParam(required = false) UUID tenant,
                                         @RequestParam(name = "startDate", required = false) String startDate,
                                         @RequestParam(name = "endDate", required = false) String endDate,
                                         @RequestParam(name = "date", required = false) String date,
                                         @PageableDefault(size = 20, sort = "createdDate", direction = Sort.Direction.DESC) Pageable pageable, LoggedInUserDetails loggedInUserDetails) {
        if (Validators.allEqualNull(tenant))
            tenant = loggedInUserDetails.getInstitution();
        return callService.fetchSortedTenantCalls(tenant, startDate, endDate, date, pageable);
    }

    @GetMapping("/{publicId}")
    public Call getCallBYPublicId(@PathVariable("publicId") UUID publicId, LoggedInUserDetails loggedInUserDetails) {
        return callService.fetchByPublicId(publicId);
    }

    @PatchMapping("/{publicId}")
    public Call patchCall(@PathVariable("publicId") UUID publicId, @RequestBody Call updatedCall, LoggedInUserDetails loggedInUserDetails) {
        updatedCall.setUpdatedBy(loggedInUserDetails.getClientId());
        return callService.update(publicId, updatedCall);
    }

    @DeleteMapping("/{publicId}")
    public void deleteIvr(@PathVariable("publicId") UUID publicId) {
        callService.delete(publicId);
    }

    @PostMapping
    public void makeCall(@RequestBody MakeCallDTO makeCallDTO, LoggedInUserDetails loggedInUserDetails) {
        callService.makeCall(makeCallDTO);
    }

    @PostMapping(value = {"/{tenant}/handle", "/{tenant}/handle/{level}"}, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_XML_VALUE)
    public String handleCall(@PathVariable UUID tenant, @PathVariable(required = false) Integer level, CallDto callDto) throws MalformedURLException {
        if (Validators.allEqualNull(level)) {
            level = 0;
        }

        log.error("Handle Call for " + tenant.toString() + " Level:" + level + " Call: " + callDto.toString());

        return callService.handleCall(callDto, tenant, level);
    }

    @GetMapping("/analysis/groupedTotals")
    public CallCountTotalDto callCountTotal(@RequestParam(required = false) UUID tenant, LoggedInUserDetails loggedInUserDetails) {
        if (Validators.allNotEqualNull(tenant))
            callService.callCountTotals(tenant);
        return callService.callCountTotals(loggedInUserDetails.getInstitution());
    }

    @PostMapping("/cdr")
    public void handleCallCdr(@RequestBody Cdr cdr){
        log.error("################# Received CDR");
        callService.handleCallCdr(cdr);
    }
}
