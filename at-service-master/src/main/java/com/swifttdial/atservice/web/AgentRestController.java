package com.swifttdial.atservice.web;

import com.swifttdial.atservice.domains.Agent;
import com.swifttdial.atservice.domains.dto.LoggedInUserDetails;
import com.swifttdial.atservice.services.AgentService;
import com.swifttdial.atservice.utils.validators.Validators;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/agents")
public class AgentRestController {

    private final AgentService agentService;

    public AgentRestController(AgentService agentService) {
        this.agentService = agentService;
    }

    @PostMapping
    public Agent createAgent(@RequestBody Agent agent, LoggedInUserDetails loggedInUserDetails) {
        return agentService.createAgent(agent);
    }

//    @GetMapping
//    public Page<Agent> fetchAllSorted(@RequestParam UUID tenant, Pageable pageable) {
//        return agentService.fetchByTenant(tenant, pageable);
//    }

    @GetMapping
    public Page<Agent> fetchAllSorted(@RequestParam(required = false) UUID tenant, @PageableDefault Pageable pageable, LoggedInUserDetails loggedInUserDetails) {
        if (Validators.allEqualNull(tenant))
            tenant = loggedInUserDetails.getInstitution();
        return agentService.fetchByTenant(tenant, pageable);
    }

    @GetMapping("/byUser/{userPublicId}")
    public Agent fetchByUser(@PathVariable("userPublicId") UUID userPublicId){
        return agentService.fetchByUserId(userPublicId);
    }

    @GetMapping("/{publicId}")
    public Agent fetchByPublicId(@PathVariable("publicId") UUID publicId){
        return agentService.fetchByPublicId(publicId);
    }

    @PatchMapping("/{publicId}")
    public Agent updateAgent(@PathVariable UUID publicId, @RequestBody Agent agent, LoggedInUserDetails loggedInUserDetails){
        return agentService.updateAgent(publicId, agent);
    }
}
