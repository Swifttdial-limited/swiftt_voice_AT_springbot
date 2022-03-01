package com.swifftdial.identityservice.services;

import com.swifftdial.identityservice.domains.OrganogramNode;
import com.swifftdial.identityservice.domains.dto.OrganogramNodeDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface OrganogramService {

    Page<OrganogramNodeDTO> fetchOrganogram(UUID tenant, Pageable pageable);

    OrganogramNodeDTO createNode(OrganogramNode newOrganogramNode);

    OrganogramNode validate(UUID tenant, UUID organogramNodePublicId);

    OrganogramNodeDTO updateNode(UUID tenant, UUID organogramNodePublicId, OrganogramNode updatedOrganogramNode);

    void deleteNode(UUID tenant, UUID organogramNodePublicId);
}
