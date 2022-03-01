package com.swifftdial.identityservice.repositories;

import com.swifftdial.identityservice.domains.OrganogramNode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrganogramNodeRepository extends JpaRepository<OrganogramNode, Long> {
    List<OrganogramNode> findByTenantAndRolePublicId(UUID tenant, UUID rolePublicId);

    Optional<OrganogramNode> findByPublicId(UUID organogramNodePublicId);

    List<OrganogramNode> findByParentRolePublicId(UUID publicId);

    Page<OrganogramNode> findByTenant(UUID tenant, Pageable pageable);

    Optional<OrganogramNode> findByTenantAndPublicId(UUID tenant, UUID organogramNodePublicId);
}
