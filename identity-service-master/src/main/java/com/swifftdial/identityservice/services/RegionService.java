package com.swifftdial.identityservice.services;

import com.swifftdial.identityservice.repositories.RegionRepository;
import com.swifftdial.identityservice.domains.Region;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public abstract class RegionService extends GenericCrudService<Region, RegionRepository> {
    public RegionService(RegionRepository regionRepository) {
        super(new Region(), regionRepository);
    }

    public abstract Region create(Region region);

    public abstract Region update(UUID tenant, UUID regionPublicId, Region region);

    abstract public Page<Region> fetchByNameContaining(UUID tenant, String name, Pageable pageable);

    public abstract List<Region> fetchRegions(UUID tenant);
}
