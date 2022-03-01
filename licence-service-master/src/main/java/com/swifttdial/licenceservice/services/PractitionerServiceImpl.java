package com.swifttdial.licenceservice.services;

import com.swifttdial.licenceservice.repositories.PractitionerRepository;
import com.swifttdial.licenceservice.domains.Practitioner;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class PractitionerServiceImpl implements PractitionerService {

    private final PractitionerRepository practitionerRepository;

    public PractitionerServiceImpl(PractitionerRepository practitionerRepository) {
        this.practitionerRepository = practitionerRepository;
    }

    @Override
    public Practitioner create(Practitioner newPractitioner) {
        return practitionerRepository.save(newPractitioner);
    }

    @Override
    public Page<Practitioner> fetchAll(Pageable pageable) {
        return practitionerRepository.findAll(pageable);
    }
}
