package com.swifttdial.licenceservice.services;

import com.swifttdial.licenceservice.repositories.SpecializationRepository;
import com.swifttdial.licenceservice.domains.Specialization;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class SpecializationServiceImpl implements SpecializationService {

    private final SpecializationRepository specializationRepository;

    public SpecializationServiceImpl(SpecializationRepository specializationRepository) {
        this.specializationRepository = specializationRepository;
    }

    @Override
    public Specialization createSpecialization(Specialization newSpecialization) {
        return specializationRepository.save(newSpecialization);
    }

    @Override
    public Page<Specialization> fetchAll(Pageable pageable) {
        return specializationRepository.findAll(pageable);
    }

    @Override
    public Specialization update(Specialization updatedSpecialization) {
        return specializationRepository.save(updatedSpecialization);
    }
}
