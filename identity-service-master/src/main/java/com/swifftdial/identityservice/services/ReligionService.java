package com.swifftdial.identityservice.services;

import com.swifftdial.identityservice.repositories.ReligionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.swifftdial.identityservice.domains.Religion;

import java.util.List;
import java.util.UUID;

public abstract class ReligionService extends GenericCrudService<Religion, ReligionRepository> {
    public ReligionService(ReligionRepository religionRepository) {
        super(new Religion(), religionRepository);
    }

    public abstract Religion create(Religion religion);

    public abstract Religion update(UUID tenant, UUID religionPublicId, Religion religion);

    abstract public Page<Religion> fetchByNameContaining(UUID tenant, String name, Pageable pageable);

    public abstract List<Religion> fetchReligions(UUID tenant);
}
