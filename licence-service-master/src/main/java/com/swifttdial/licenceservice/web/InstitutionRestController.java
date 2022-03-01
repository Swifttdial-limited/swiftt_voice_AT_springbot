package com.swifttdial.licenceservice.web;

import com.swifttdial.licenceservice.domains.Institution;
import com.swifttdial.licenceservice.domains.Licence;
import com.swifttdial.licenceservice.domains.dto.InstitutionDTO;
import com.swifttdial.licenceservice.domains.dto.LoggedInUserDetails;
import com.swifttdial.licenceservice.services.InstitutionService;
import com.swifttdial.licenceservice.services.LicenseService;
import com.swifttdial.licenceservice.utils.exceptions.BadRequestRestApiException;
import com.swifttdial.licenceservice.utils.converters.LoggedInUserDetailsToUserConverter;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.UUID;

@RestController
@RequestMapping("/institutions")
public class InstitutionRestController {

    private final InstitutionService institutionService;
    private final LicenseService licenseService;
    private final LoggedInUserDetailsToUserConverter loggedInUserDetailsToUserConverter;

    @Autowired
    public InstitutionRestController(InstitutionService institutionService,
                                     LicenseService licenseService,
                                     LoggedInUserDetailsToUserConverter loggedInUserDetailsToUserConverter) {
        this.institutionService = institutionService;
        this.licenseService = licenseService;
        this.loggedInUserDetailsToUserConverter = loggedInUserDetailsToUserConverter;
    }

//    @PreAuthorize("hasAuthority('CREATE_INSTITUTION')")
//    @PostMapping
//    public Institution createInstitution(@RequestBody Institution institution) {
//        //institution.setCreatedBy(loggedInUserDetailsToUserConverter.convert(loggedInUserDetails).getPublicId());
//        return institutionService.createInstitution(institution);
//    }

    @PreAuthorize("hasAuthority('CREATE_INSTITUTION')")
    @PostMapping
    public Institution createInstitution(@RequestBody InstitutionDTO institutionDTO, LoggedInUserDetails loggedInUserDetails) {
        institutionDTO.getInstitution().setCreatedBy(loggedInUserDetailsToUserConverter.convert(loggedInUserDetails).getPublicId());
        return institutionService.createInstitution(institutionDTO);
    }

    @PreAuthorize("hasAuthority('CREATE_INSTITUTION_LICENSE')")
    @PostMapping("/{institutionPublicId}")
    public Licence createLicense(@PathVariable(name = "institutionPublicId") UUID institutionPublicId,
                                 @RequestBody Licence license,
                                 LoggedInUserDetails loggedInUserDetails) {
        final Institution institution = institutionService.validate(institutionPublicId);

        license.setCreatedBy(loggedInUserDetailsToUserConverter.convert(loggedInUserDetails).getPublicId());
        license.setCreatedDate(new Date());

        return licenseService.createLicense(institution, license);
    }

    @PreAuthorize("hasAuthority('READ_INSTITUTIONS')")
    @GetMapping
    public Page<Institution> getInstitutions(@RequestParam(required = false, name = "searchQueryParam") String searchQueryParam,
                                             @PageableDefault(size = 20, sort = "institutionName") Pageable pageable) {
        if(searchQueryParam != null) {
            if(!StringUtils.isEmpty(searchQueryParam) && searchQueryParam.length() < 3)
                throw new BadRequestRestApiException()
                        .developerMessage("Search query parameters must be 3 characters or more")
                        .developerMessage("Sorry. Search query parameters must be 3 characters or more");

            return institutionService.fetchInstitutions(searchQueryParam, pageable);
        } else
           return institutionService.fetchInstitutions(pageable);
    }

    @PreAuthorize("hasAuthority('READ_INSTITUTIONS')")
    @GetMapping("/{institutionPublicId}")
    public Institution getInstitution(@PathVariable(required = false, name = "institutionPublicId") UUID institutionPublicId) {
        return institutionService.validate(institutionPublicId);
    }

    @PreAuthorize("hasAuthority('READ_MY_INSTITUTION')")
    @GetMapping("/me")
    public Institution getMyInstitution(LoggedInUserDetails loggedInUserDetails) {
        return institutionService.validate(loggedInUserDetails.getInstitution());
    }

//    @PreAuthorize("hasAuthority('READ_MY_LICENSE')")
//    @GetMapping("/license")
//    public Institution getMyInstitutionCurrentLicense(LoggedInUserDetails loggedInUserDetails) {
//        return institutionService.fetchByPublicId(loggedInUserDetails.getInstitution());
//    }

    @PreAuthorize("hasAuthority('UPDATE_MY_INSTITUTION')")
    @PatchMapping("/me")
    public Institution updateMe(@RequestBody Institution institution,
                                LoggedInUserDetails loggedInUserDetails){
        return institutionService.update(
                loggedInUserDetails.getInstitution(),
                institution,
                loggedInUserDetailsToUserConverter.convert(loggedInUserDetails));
    }

    @PreAuthorize("hasAuthority('UPDATE_INSTITUTION')")
    @PatchMapping("/{institutionPublicId}")
    public Institution update(@PathVariable("institutionPublicId") UUID institutionPublicId,
                              @RequestBody Institution institution,
                              LoggedInUserDetails loggedInUserDetails){
        return institutionService.update(
                institutionPublicId,
                institution,
                loggedInUserDetailsToUserConverter.convert(loggedInUserDetails));
    }

}