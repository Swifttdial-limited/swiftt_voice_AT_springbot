package com.swifftdial.identityservice.web;

import com.fasterxml.jackson.annotation.JsonView;
import com.swifftdial.identityservice.datatypes.Status;
import com.swifftdial.identityservice.domains.Actor;
import com.swifftdial.identityservice.domains.UserSpecialization;
import com.swifftdial.identityservice.repositories.UserSpecializationRepository;
import com.swifftdial.identityservice.services.ActorService;
import com.swifftdial.identityservice.utils.exceptions.BadRequestRestApiException;
import com.swifftdial.identityservice.utils.validators.Validators;
import com.swifftdial.identityservice.domains.dto.LoggedInUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Created by daniel.gathigai on 13/09/2016.
 */
@RestController
@RequestMapping("/actors")
public class ActorRestController {

    private final ActorService actorService;
    private final UserSpecializationRepository userSpecializationRepository;

    @Autowired
    public ActorRestController(ActorService actorService, UserSpecializationRepository userSpecializationRepository) {
        this.actorService = actorService;
        this.userSpecializationRepository = userSpecializationRepository;
    }

    @PreAuthorize("hasAuthority('CREATE_USER_GROUP')")
    @PostMapping
    public Actor createActor(@RequestBody @Valid Actor newActor, LoggedInUserDetails loggedInUserDetails) {
        newActor.setTenant(loggedInUserDetails.getInstitution());
        return actorService.createActor(newActor);
    }

    @PreAuthorize("hasAuthority('READ_USER_GROUPS')")
    @GetMapping
    public Page<Actor> getActors(@RequestParam(required = false, name = "actorName") String actorName,
                                 @PageableDefault(sort = "name", size = 20) Pageable pageable,
                                 LoggedInUserDetails loggedInUserDetails) {
        if(Validators.allNotEqualNull(actorName))
            if(actorName.length() > 2)
                return actorService.searchByActorName(loggedInUserDetails.getInstitution(), actorName, pageable);
            else
                throw new BadRequestRestApiException()
                        .developerMessage("Search parameter must be more than 2 characters")
                        .userMessage("Sorry. Search parameter must be more than 2 characters");
        else
           return actorService.fetchSortedActors(loggedInUserDetails.getInstitution(), pageable);
    }

    @PreAuthorize("hasAuthority('UPDATE_USER_GROUP')")
    @PatchMapping("/{actorPublicId}")
    public Actor patchActor(@PathVariable("actorPublicId") UUID actorPublicId,
                            @RequestBody Actor updatedActor,
                            LoggedInUserDetails loggedInUserDetails) {
        return actorService.updateActor(loggedInUserDetails.getInstitution(), actorPublicId, updatedActor);
    }

    @PreAuthorize("hasAuthority('DEACTIVATE_USER_GROUP')")
    @PatchMapping("{actorPublicId}/status}")
    Actor patchActorStatus(@PathVariable("actorPublicId") UUID actorPublicId,
                           @RequestBody Status status,
                           LoggedInUserDetails loggedInUserDetails) {
        return this.actorService.changeStatus(loggedInUserDetails.getInstitution(), status, actorPublicId);
    }

    @PreAuthorize("hasAuthority('DELETE_USER_GROUP')")
    @DeleteMapping("/{actorPublicId}")
    void deleteActor(@PathVariable("actorPublicId") UUID actorPublicId,
                     LoggedInUserDetails loggedInUserDetails) {
        Actor foundActor = actorService.fetchActorByPublicId(loggedInUserDetails.getInstitution(), actorPublicId);
        actorService.deleteActor(loggedInUserDetails.getInstitution(), foundActor);
    }

    @PreAuthorize("hasAuthority('READ_USER_GROUPS')")
    @GetMapping("/count")
    public Map<String, Long> countActors() {
        Map<String, Long> result = new HashMap<>();
        result.put("count", actorService.countActors());
        return result;
    }

    @JsonView(UserSpecialization.FullView.class)
    @PreAuthorize("hasAuthority('READ_USERS')")
    @GetMapping("/{actorPublicId}/userSpecializations")
    public Page<UserSpecialization> getUserSpecializations(@PathVariable("actorPublicId") UUID actorPublicId,
                                                           @PageableDefault Pageable pageable,
                                                           LoggedInUserDetails loggedInUserDetails) {
        Actor foundActor = actorService.fetchActorByPublicId(loggedInUserDetails.getInstitution(), actorPublicId);
        return userSpecializationRepository.findByTenantAndActorId(loggedInUserDetails.getInstitution(), foundActor.getId(), pageable);
    }
}