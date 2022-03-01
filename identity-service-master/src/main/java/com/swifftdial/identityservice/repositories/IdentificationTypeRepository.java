package com.swifftdial.identityservice.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.swifftdial.identityservice.domains.IdentificationType;

@Repository
public interface IdentificationTypeRepository extends JpaRepository<IdentificationType, Long> {

    Optional<IdentificationType> findByPublicId(UUID publicId);

    List<IdentificationType> findByTenantAndNameIgnoreCase(UUID tenant, String name);

    List<IdentificationType> findByTenantAndNameIgnoreCaseAndIdNot(UUID tenant, String name, Long identificationTypeId);

    Page<IdentificationType> findByTenantAndPersonIs(UUID tenant, Boolean isPerson, Pageable pageable);

    Page<IdentificationType> findByTenantAndContactIs(UUID tenant, Boolean isContact, Pageable pageable);

    Page<IdentificationType> findByTenantAndNameIgnoreCase(UUID tenant, String name, Pageable pageable);

    List<IdentificationType> findByTenant(UUID tenant);

    Page<IdentificationType> findByTenant(UUID tenant, Pageable pageable);

    Optional<IdentificationType> findByTenantAndPublicId(UUID tenant, UUID identificationTypePublicId);
}
