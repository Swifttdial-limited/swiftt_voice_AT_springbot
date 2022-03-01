package com.swifftdial.identityservice.repositories;

import com.swifftdial.identityservice.domains.Actor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ActorRepository extends JpaRepository<Actor, Long> {
    Optional<Actor> findByTenantAndPublicId(UUID tenant, UUID actorPublicId);

    List<Actor> findByTenantAndNameIgnoreCase(UUID tenant, String name);

    Optional<Actor> findByTenantAndNameIgnoreCaseAndIdNot(UUID tenant, String name, Long id);

    Page<Actor> findByTenantAndNameContainingIgnoreCase(UUID tenant, String actorName, Pageable pageable);

    Page<Actor> findByTenant(UUID tenant, Pageable pageable);
}
