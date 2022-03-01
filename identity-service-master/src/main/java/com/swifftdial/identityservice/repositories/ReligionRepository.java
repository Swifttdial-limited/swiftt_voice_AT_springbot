package com.swifftdial.identityservice.repositories;

import com.swifftdial.identityservice.domains.Religion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ReligionRepository extends GenericJpaRepository<Religion, Long> {
    Page<Religion> findByTenantAndNameContainingIgnoreCase(UUID tenant, String name, Pageable pageable);

    List<Religion> findByTenant(UUID tenant);

    List<Religion> findByTenantAndNameIgnoreCase(UUID tenant, String name);

    List<Religion> findByTenantAndNameIgnoreCaseAndIdNot(UUID tenant, String name, Long religionId);
}
