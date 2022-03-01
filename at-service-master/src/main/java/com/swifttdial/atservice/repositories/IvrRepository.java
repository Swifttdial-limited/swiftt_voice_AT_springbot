package com.swifttdial.atservice.repositories;

import com.swifttdial.atservice.domains.Ivr;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface IvrRepository extends JpaRepository<Ivr,Long> {

    Optional<Ivr> findByPublicId(UUID publicId);

    Optional<Ivr> findByTenantAndPublicId(UUID tenant, UUID actorPublicId);

    Optional<Ivr> findByTenant(UUID tenant);
}
