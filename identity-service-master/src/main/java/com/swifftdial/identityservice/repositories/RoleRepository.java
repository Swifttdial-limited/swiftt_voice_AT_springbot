package com.swifftdial.identityservice.repositories;

import com.swifftdial.identityservice.domains.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Page<Role> findByTenantAndNameContainingIgnoreCase(UUID tenant, String searchQueryParam, Pageable pageable);

    Optional<Role> findByTenantAndPublicId(UUID tenant, UUID rolePublicId);

    List<Role> findByTenantAndNameIgnoreCase(UUID tenant, String name);

    List<Role> findByTenantAndNameIgnoreCaseAndIdNot(UUID tenant, String name, Long id);

    List<Role> findByTenantAndActorPublicId(UUID tenant, UUID actorPublicId);

    Page<Role> findByTenant(UUID tenant, Pageable pageable);
}
