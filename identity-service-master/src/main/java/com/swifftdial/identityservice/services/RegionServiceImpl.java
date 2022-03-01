package com.swifftdial.identityservice.services;

import com.swifftdial.identityservice.repositories.RegionRepository;
import com.swifftdial.identityservice.utils.exceptions.BadRequestRestApiException;
import com.swifftdial.identityservice.domains.Region;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class RegionServiceImpl extends RegionService {

    private final RegionRepository regionRepository;

    public RegionServiceImpl(RegionRepository regionRepository) {
        super(regionRepository);
        this.regionRepository = regionRepository;
    }

    @Override
    public Region create(Region region) {
        if(!regionRepository.findByTenantAndNameIgnoreCase(region.getTenant(), region.getName()).isEmpty())
            throw new BadRequestRestApiException()
                    . developerMessage("Duplicate region definition found")
                    .userMessage("Sorry. Duplicate region definition exists");

        return regionRepository.save(region);
    }

    @Override
    public Region update(UUID tenant, UUID regionPublicId, Region region) {
        this.validate(tenant, regionPublicId);

        if(!regionRepository.findByTenantAndNameIgnoreCaseAndIdNot(
                tenant, region.getName(), region.getId()).isEmpty())
            throw new BadRequestRestApiException()
                    . developerMessage("Duplicate region definition found")
                    .userMessage("Sorry. Duplicate region definition exists");

        return regionRepository.save(region);
    }

    @Override
    public Page<Region> fetchByNameContaining(UUID tenant, String name, Pageable pageable) {
        return regionRepository.findByTenantAndNameContainingIgnoreCase(tenant, name, pageable);
    }

    @Override
    public List<Region> fetchRegions(UUID tenant) {
        return regionRepository.findByTenant(tenant);
    }
}
