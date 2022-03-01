package com.swifttdial.licenceservice.web;

import com.swifttdial.licenceservice.domains.Institution;
import com.swifttdial.licenceservice.services.InstitutionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/internal")
public class InternalController {

    private final InstitutionService institutionService;

    @Autowired
    public InternalController(InstitutionService institutionService) {
        this.institutionService = institutionService;
    }

    /**
     * In use by ingestion service
     * @return
     */
    @GetMapping("/institutions/{institutionPublicId}")
    public Institution getInstitution(@PathVariable("institutionPublicId") UUID institutionPublicId){
        return institutionService. validate(institutionPublicId);
    }
}
