package com.swifftdial.identityservice.web;

import com.swifftdial.identityservice.domains.Title;
import com.swifftdial.identityservice.services.TitleService;
import com.swifftdial.identityservice.utils.validators.Validators;
import com.swifftdial.identityservice.domains.dto.LoggedInUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.UUID;

/**
 * Created by gathigai on 12/17/16.
 */
@RestController
@RequestMapping("/titles")
public class TitleRestController {
    
    private final TitleService titleService;
    
    @Autowired
    public TitleRestController(TitleService titleService) {
        this.titleService = titleService;
    }

    @PreAuthorize("hasAuthority('CREATE_TITLE')")
    @PostMapping
    public Title createTitles(@RequestBody @Valid Title newTitle, LoggedInUserDetails loggedInUserDetails) {
        newTitle.setTenant(loggedInUserDetails.getInstitution());
        return titleService.createTitle(newTitle);
    }

    @PreAuthorize("hasAuthority('READ_TITLES')")
    @GetMapping
    public Page<Title> getTitles(@RequestParam(name = "name", required = false) String name,
                                 @PageableDefault(size = 20, sort = "name") Pageable pageable,
                                 LoggedInUserDetails loggedInUserDetails) {
        if(Validators.allNotEqualNull(name))
            return titleService.searchTitle(loggedInUserDetails.getInstitution(), name, pageable);
        else
            return titleService.fetchTitles(loggedInUserDetails.getInstitution(), pageable);
    }

    @PreAuthorize("hasAuthority('UPDATE_TITLE')")
    @PatchMapping("/{titlePublicId}")
    public Title updateTitle(@PathVariable("titlePublicId") UUID titlePublicId,
                             @RequestBody @Valid Title updatedTitle,
                             LoggedInUserDetails loggedInUserDetails) {
        return titleService.updateTitle(loggedInUserDetails.getInstitution(), titlePublicId, updatedTitle);
    }

    @PreAuthorize("hasAuthority('DELETE_TITLE')")
    @DeleteMapping("/{titlePublicId}")
    void deleteTitle(@PathVariable("titlePublicId") UUID titlePublicId, LoggedInUserDetails loggedInUserDetails) {
        titleService.deleteTitle(loggedInUserDetails.getInstitution(), titlePublicId);
    }
    
}
