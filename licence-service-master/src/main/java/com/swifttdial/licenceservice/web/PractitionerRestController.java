package com.swifttdial.licenceservice.web;

import com.swifttdial.licenceservice.domains.Practitioner;
import com.swifttdial.licenceservice.services.PractitionerService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/practitioners")
public class PractitionerRestController {

    private final PractitionerService practitionerService;

    public PractitionerRestController(PractitionerService practitionerService) {
        this.practitionerService = practitionerService;
    }

    @PostMapping
    public Practitioner createPractitioner(@RequestBody Practitioner newPractitioner) {
        return practitionerService.create(newPractitioner);
    }

    @GetMapping
    public Page<Practitioner> getPractitioners(@PageableDefault(sort = "firstName") Pageable pageable) {
        return practitionerService.fetchAll(pageable);
    }
}
