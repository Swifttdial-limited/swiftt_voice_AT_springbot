package com.swifttdial.licenceservice.web;

import com.swifttdial.licenceservice.domains.Specialization;
import com.swifttdial.licenceservice.services.SpecializationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/specializations")
public class SpecializationRestController {

    private final SpecializationService specializationService;

    public SpecializationRestController(SpecializationService specializationService) {
        this.specializationService = specializationService;
    }

    @PostMapping
    public Specialization createSpecialization(@RequestBody Specialization newSpecialization) {
        return specializationService.createSpecialization(newSpecialization);
    }

    @GetMapping
    public Page<Specialization> getSpecializations(@PageableDefault(sort = "name")Pageable pageable) {
        return specializationService.fetchAll(pageable);
    }

    @PatchMapping("/{specializationPublicId}")
    public Specialization updateSpecialization(@PathVariable("specializationPublicId") UUID specializationPublicId, @RequestBody Specialization updatedSpecialization) {
        return specializationService.update(updatedSpecialization);
    }

    @DeleteMapping("/{specializationPublicId}")
    public void deleteSpecialization(@PathVariable("specializationPublicId") UUID specializationPublicId) {

    }
}
