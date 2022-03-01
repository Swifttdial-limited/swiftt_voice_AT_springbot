package com.swifftdial.identityservice.repositories;

import com.swifftdial.identityservice.domains.Region;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface RegionRepository extends GenericJpaRepository<Region, Long> {
    Page<Region> findByTenantAndNameContainingIgnoreCase(UUID tenant, String name, Pageable pageable);

    List<Region> findByTenant(UUID tenant);

    List<Region> findByTenantAndNameIgnoreCase(UUID tenant, String name);

    List<Region> findByTenantAndNameIgnoreCaseAndIdNot(UUID tenant, String name, Long regionId);
}
