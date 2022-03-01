package com.swifftdial.identityservice.services;

import com.swifftdial.identityservice.repositories.ReligionRepository;
import com.swifftdial.identityservice.utils.exceptions.BadRequestRestApiException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.swifftdial.identityservice.domains.Religion;

import java.util.List;
import java.util.UUID;

@Service
public class ReligionServiceImpl extends ReligionService {

    private final ReligionRepository religionRepository;

    public ReligionServiceImpl( ReligionRepository religionRepository) {
        super(religionRepository);
        this.religionRepository = religionRepository;
    }

    @Override
    public Religion create(Religion religion) {
        if(!religionRepository.findByTenantAndNameIgnoreCase(religion.getTenant(), religion.getName()).isEmpty())
            throw new BadRequestRestApiException()
                    . developerMessage("Duplicate religion definition found")
                    .userMessage("Sorry. Duplicate religion definition exists");

        return religionRepository.save(religion);
    }

    @Override
    public Religion update(UUID tenant, UUID religionPublicId, Religion religion) {
        this.validate(tenant, religionPublicId);

        if(!religionRepository.findByTenantAndNameIgnoreCaseAndIdNot(
                tenant, religion.getName(), religion.getId()).isEmpty())
            throw new BadRequestRestApiException()
                    . developerMessage("Duplicate religion definition found")
                    .userMessage("Sorry. Duplicate religion definition exists");

        return religionRepository.save(religion);
    }

    @Override
    public Page<Religion> fetchByNameContaining(UUID tenant, String name, Pageable pageable) {
        return religionRepository.findByTenantAndNameContainingIgnoreCase(tenant, name, pageable);
    }

    @Override
    public List<Religion> fetchReligions(UUID tenant) {
        return religionRepository.findByTenant(tenant);
    }
}
