package com.swifttdial.licenceservice.services;

import com.swifttdial.licenceservice.domains.Practitioner;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PractitionerService {
    Practitioner create(Practitioner newPractitioner);

    Page<Practitioner> fetchAll(Pageable pageable);
}
