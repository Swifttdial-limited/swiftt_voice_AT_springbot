package com.swifftdial.identityservice.services;

import com.swifftdial.identityservice.repositories.OrganogramNodeRepository;
import com.swifftdial.identityservice.utils.converters.OrganogramNodeToOrganogramNodeDTOConverter;
import com.swifftdial.identityservice.utils.exceptions.BadRequestRestApiException;
import com.swifftdial.identityservice.utils.exceptions.ResourceNotFoundRestApiException;
import com.swifftdial.identityservice.domains.OrganogramNode;
import com.swifftdial.identityservice.domains.dto.OrganogramNodeDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class OrganogramServiceImpl implements OrganogramService {

    private final OrganogramNodeToOrganogramNodeDTOConverter organogramNodeToOrganogramNodeDTOConverter;
    private final OrganogramNodeRepository organogramNodeRepository;

    public OrganogramServiceImpl(OrganogramNodeToOrganogramNodeDTOConverter organogramNodeToOrganogramNodeDTOConverter,
                                 OrganogramNodeRepository organogramNodeRepository) {
        this.organogramNodeToOrganogramNodeDTOConverter = organogramNodeToOrganogramNodeDTOConverter;
        this.organogramNodeRepository = organogramNodeRepository;
    }

    @Override
    public Page<OrganogramNodeDTO> fetchOrganogram(UUID tenant, Pageable pageable) {
        return organogramNodeRepository.findByTenant(tenant, pageable).map(organogramNodeToOrganogramNodeDTOConverter);
    }

    @Override
    public OrganogramNodeDTO createNode(OrganogramNode newOrganogramNode) {
        if(!organogramNodeRepository.findByTenantAndRolePublicId(
                newOrganogramNode.getTenant(), newOrganogramNode.getRole().getPublicId()).isEmpty())
            throw new BadRequestRestApiException()
                    .developerMessage("Role already has a definition")
                    .userMessage("Sorry. Duplicate definition already exisits");

        return organogramNodeToOrganogramNodeDTOConverter.convert(organogramNodeRepository.save(newOrganogramNode));
    }

    @Override
    public OrganogramNode validate(UUID tenant, UUID organogramNodePublicId) {
        return organogramNodeRepository.findByTenantAndPublicId(tenant, organogramNodePublicId)
                .orElseThrow(() -> new ResourceNotFoundRestApiException()
                        .developerMessage("Node does not exist")
                        .userMessage("Sorry. Node does not exist"));
    }

    @Override
    public OrganogramNodeDTO updateNode(UUID tenant, UUID organogramNodePublicId, OrganogramNode updatedOrganogramNode) {
        this.validate(tenant, organogramNodePublicId);

        return organogramNodeToOrganogramNodeDTOConverter.convert(organogramNodeRepository.save(updatedOrganogramNode));
    }

    @Override
    public void deleteNode(UUID tenant, UUID organogramNodePublicId) {
        OrganogramNode foundNode = this.validate(tenant, organogramNodePublicId);
        
        if(!organogramNodeRepository.findByParentRolePublicId(foundNode.getPublicId()).isEmpty())
            throw new BadRequestRestApiException()
                    .developerMessage("Operation not allowed on a parent node")
                    .userMessage("Sorry. You cannot delete a parent node");
        
        organogramNodeRepository.delete(foundNode.getId());
    }
}
