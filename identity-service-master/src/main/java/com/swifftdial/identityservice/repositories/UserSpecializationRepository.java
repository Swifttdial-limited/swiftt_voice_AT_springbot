package com.swifftdial.identityservice.repositories;

import com.swifftdial.identityservice.domains.UserSpecialization;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserSpecializationRepository extends JpaRepository<UserSpecialization, Long> {
    Page<UserSpecialization> findByTenantAndUserId(UUID tenant, Long userId, Pageable pageable);

    Optional<UserSpecialization> findByTenantAndUserIdAndPublicId(UUID tenant, Long userId, UUID userSpecializationPublicId);

    Page<UserSpecialization> findByTenantAndActorId(UUID tenant, Long actorId, Pageable pageable);
}
