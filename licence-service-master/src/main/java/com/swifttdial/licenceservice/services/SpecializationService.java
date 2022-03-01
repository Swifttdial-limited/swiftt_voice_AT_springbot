package com.swifttdial.licenceservice.services;

import com.swifttdial.licenceservice.domains.Specialization;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SpecializationService {
    Specialization createSpecialization(Specialization newSpecialization);

    Page<Specialization> fetchAll(Pageable pageable);

    Specialization update(Specialization updatedSpecialization);

}
