package com.swifttdial.atservice.repositories;

import com.swifttdial.atservice.domains.Agent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AgentRepository extends JpaRepository<Agent, Long> {

    Optional<Agent> findByPublicId(UUID publicId);

    Optional<Agent> findByUserPublicId(UUID userPublicId);

    Page<Agent> findAllByTenant(UUID tenant, Pageable pageable);

    List<Agent> findAllByTenant(UUID tenant);

    Optional<Agent> findAgentByTenantAndPhoneNumber(UUID tenant, String phoneNumber);

}