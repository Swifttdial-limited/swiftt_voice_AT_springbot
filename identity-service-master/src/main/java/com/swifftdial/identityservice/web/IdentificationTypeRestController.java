package com.swifftdial.identityservice.web;

import com.swifftdial.identityservice.domains.IdentificationType;
import com.swifftdial.identityservice.services.IdentificationTypeService;
import com.swifftdial.identityservice.utils.validators.Validators;
import com.swifftdial.identityservice.domains.dto.LoggedInUserDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/identificationTypes")
public class IdentificationTypeRestController {

    private final IdentificationTypeService identificationTypeService;

    public IdentificationTypeRestController(IdentificationTypeService identificationTypeService) {
        this.identificationTypeService = identificationTypeService;
    }

    @PreAuthorize("hasAuthority('CREATE_IDENTIFICATION_TYPE')")
    @PostMapping
    public IdentificationType create(@RequestBody IdentificationType identificationType,
                                     LoggedInUserDetails loggedInUserDetails){
        identificationType.setTenant(loggedInUserDetails.getInstitution());
        return identificationTypeService.createIdentificationType(identificationType);
    }

    @PreAuthorize("hasAuthority('READ_IDENTIFICATION_TYPES')")
    @GetMapping
    public Page<IdentificationType> fetchAll(@RequestParam(name = "name", required = false) String name,
                                             @RequestParam(required = false, name = "isPerson") Boolean isPerson,
                                             @RequestParam(required = false, name = "isContact") Boolean isContact,
                                             @PageableDefault(size = 20, sort = "name")Pageable pageable,
                                             LoggedInUserDetails loggedInUserDetails) {
        if(Validators.allNotEqualNull(name) && Validators.allEqualNull(isPerson, isContact)) {
            return identificationTypeService.searchByName(loggedInUserDetails.getInstitution(), name, pageable);
        } else if(Validators.allNotEqualNull(isPerson) && Validators.allEqualNull(isContact))
            return identificationTypeService.fetchPersonIdentificationTypes(loggedInUserDetails.getInstitution(), isPerson, pageable);
        else if(Validators.allNotEqualNull(isContact) && Validators.allEqualNull(isPerson))
            return identificationTypeService.fetchContactIdentificationTypes(loggedInUserDetails.getInstitution(), isContact, pageable);
        else
            return identificationTypeService.fetchSortedIdentificationTypes(loggedInUserDetails.getInstitution(), pageable);
    }

    @PreAuthorize("hasAuthority('UPDATE_IDENTIFICATION_TYPE')")
    @PatchMapping("/{identificationTypePublicId}")
    public IdentificationType update(@PathVariable("identificationTypePublicId") UUID identificationTypePublicId,
                                     @RequestBody IdentificationType identificationType,
                                     LoggedInUserDetails loggedInUserDetails) {
        return identificationTypeService.update(
                loggedInUserDetails.getInstitution(),
                identificationTypePublicId,
                identificationType);
    }

    @PreAuthorize("hasAuthority('DELETE_IDENTIFICATION_TYPE')")
    @DeleteMapping("/{identificationTypePublicId}")
    public void delete(@PathVariable UUID identificationTypePublicId, LoggedInUserDetails loggedInUserDetails){
        identificationTypeService.validate(loggedInUserDetails.getInstitution(), identificationTypePublicId);

        identificationTypeService.delete(identificationTypePublicId);
    }
}
