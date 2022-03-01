package com.swifftdial.identityservice.repositories;

import com.swifftdial.identityservice.domains.Title;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TitleRepository extends JpaRepository<Title, Long> {

    List<Title> findByTenantAndNameIgnoreCase(UUID tenant, String titleName);

    Page<Title> findByTenantAndNameIgnoreCase(UUID tenant, String name, Pageable pageable);

    List<Title> findByTenantAndNameIgnoreCaseAndIdNot(UUID tenant, String name, Long titleId);

    Optional<Title> findByTenantAndPublicId(UUID tenant, UUID titlePublicId);

    List<Title> findByTenant(UUID tenant);

    Page<Title> findByTenant(UUID tenant, Pageable pageable);
}
