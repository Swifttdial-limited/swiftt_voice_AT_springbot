package com.swifttdial.atservice.services;

import com.swifttdial.atservice.domains.Agent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface AgentService {

    Agent createAgent(Agent agent);

    Agent fetchByPublicId(UUID publicId);

    Agent fetchByUserId(UUID userPublicId);

    Page<Agent> fetchByTenant(UUID tenant, Pageable pageable);

    List<Agent> fetchByTenant(UUID tenant);

    Agent updateAgent(UUID publicId, Agent agent);

    void deleteAgent(UUID publicId);
}
